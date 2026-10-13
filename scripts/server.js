import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};
http
  .createServer(async (req, res) => {
    try {
      const name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const file = path.resolve(root, "." + (name === "/" ? "/index.html" : name));
      if (!file.startsWith(root + path.sep)) throw new Error("Invalid path");
      const content = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(8081, "127.0.0.1", () => console.log("Portfolio: http://127.0.0.1:8081"));
