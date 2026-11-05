import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { URL } from 'url';

const PORT = Number(process.argv[2] || process.env.PORT || 8080);
// Normalised to forward slashes so path checks behave the same on Windows and Linux.
const DIST = join(process.cwd(), 'dist').replace(/\\/g, '/');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function safePath(dist, urlPath) {
  const normalized = urlPath.replace(/^\/+/, '') || 'index.html';
  const clean = normalized.replace(/\/+/g, '/').split('?')[0].split('#')[0];
  const buf = Buffer.from(clean, 'utf8');
  const plain = buf.toString('utf8');
  if (plain !== clean) return null;
  const joined = join(dist, plain).replace(/\\/g, '/');
  if (!joined.startsWith(dist + '/') && joined !== dist) return null;
  return joined;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const decodedPath = url.pathname.endsWith('/') ? url.pathname : url.pathname;
  const filePath = safePath(DIST, decodedPath);

  let stat = null;
  let fileExists = false;
  if (filePath) {
    try {
      stat = statSync(filePath);
      fileExists = true;
    } catch (e) {
      fileExists = false;
    }
  }

  if (fileExists && stat.isFile()) {
    serveFile(res, filePath, false);
    return;
  }

  if (fileExists && stat.isDirectory()) {
    const indexPath = join(filePath, 'index.html').replace(/\\/g, '/');
    try {
      const is = statSync(indexPath);
      if (is.isFile()) {
        serveFile(res, indexPath, false);
        return;
      }
    } catch (e) {}
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  // SPA fallback for navigation-like paths
  // DEBUG: uncomment next line to see every request path in stdout
  // console.log(req.method, req.url);
  const candidate = join(DIST, 'index.html').replace(/\\/g, '/');
  let candidateExists = false;
  try {
    const cs = statSync(candidate);
    if (cs.isFile()) candidateExists = true;
  } catch (e) {}

  if (!candidateExists) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  // If the missing path has a file extension, do not mask it with index.html
  const base = decodedPath.split('?')[0].split('#')[0];
  const ext = extname(base);
  if (ext) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  serveFile(res, candidate, true);
});

function serveFile(res, filePath, isFallback) {
  try {
    const buf = readFileSync(filePath);
    const relative = filePath.replace(DIST, '').replace(/^\//, '');
    const ext = extname(relative).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', isFallback ? 'text/html; charset=utf-8' : (MIME[ext] || 'application/octet-stream'));
    res.setHeader('Cache-Control', isFallback ? 'no-cache' : 'public, max-age=31536000, immutable');
    res.setHeader('Accept-Ranges', 'bytes');
    res.end(buf);
  } catch (e) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

server.listen(PORT, () => {
  console.log('Serving ' + DIST + ' on :' + PORT);
});
