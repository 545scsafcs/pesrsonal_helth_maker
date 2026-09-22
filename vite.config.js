import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function vercelApiPlugin() {
  return {
    name: 'vercel-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          let pathname = urlObj.pathname;
          
          let fileCandidates = [
            path.join(process.cwd(), `${pathname}.js`),
            path.join(process.cwd(), pathname, 'index.js')
          ];

          let filePath = fileCandidates.find(f => fs.existsSync(f));
          if (!filePath) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'API route not found' }));
          }

          // Read body if POST/PUT/PATCH/DELETE
          let body = {};
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const dataStr = Buffer.concat(buffers).toString();
            if (dataStr) {
              try {
                body = JSON.parse(dataStr);
              } catch {
                body = dataStr;
              }
            }
          }

          // Parse query
          const query = Object.fromEntries(urlObj.searchParams.entries());

          req.query = query;
          req.body = body;

          // Helper methods on res
          res.status = function(code) {
            res.statusCode = code;
            return res;
          };

          res.json = function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          res.send = function(data) {
            if (typeof data === 'object') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } else {
              res.setHeader('Content-Type', 'text/html');
              res.end(String(data));
            }
            return res;
          };

          res.redirect = function(url) {
            res.statusCode = 307;
            res.setHeader('Location', url);
            res.end();
            return res;
          };

          // Load serverless handler via Vite's ssrLoadModule
          const module = await server.ssrLoadModule(filePath);
          const handler = module.default;

          if (typeof handler === 'function') {
            await handler(req, res);
          } else {
            res.status(500).json({ message: 'Invalid API handler export' });
          }
        } catch (err) {
          console.error('Vite API Handler Error:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: err.message || 'Internal server error in API middleware' }));
          }
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      vercelApiPlugin(),
    ],
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});


