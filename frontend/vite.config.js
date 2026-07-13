import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'run-c-plus-plus-scheduler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/simulate' && req.method === 'POST') {
            let body = '';
            
            req.on('data', chunk => {
              body += chunk;
            });
            
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const { rrQuantum, processes } = data;
                
                let inputStr = `${rrQuantum || 4}\n`;
                inputStr += `${processes.length}\n`;
                
                processes.forEach(p => {
                  inputStr += `${p.id} ${p.arrivalTime} ${p.burstTime} ${p.priority}\n`;
                });

                const exePath = path.resolve(__dirname, '../backend/scheduler.exe');
                
                const proc = spawn(exePath);

                let stdoutData = '';
                let stderrData = '';

                proc.stdout.on('data', (chunk) => {
                  stdoutData += chunk.toString();
                });

                proc.stderr.on('data', (chunk) => {
                  stderrData += chunk.toString();
                });

                proc.on('close', (code) => {
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                  
                  if (code !== 0) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ 
                      error: 'C++ Scheduler subprocess exited with error.', 
                      code: code,
                      stderr: stderrData 
                    }));
                    return;
                  }
                  
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(stdoutData);
                });

                proc.on('error', (err) => {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: 'Failed to spawn C++ scheduler binary. Has it been compiled?', 
                    details: err.message 
                  }));
                });

                proc.stdin.write(inputStr);
                proc.stdin.end();

              } catch (e) {
                res.statusCode = 400;
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to process request data structure.', details: e.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});
