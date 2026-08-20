const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env file
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value.trim();
      }
    });
    console.log("Loaded environment variables from .env");
  }
} catch (e) {
  console.warn("No .env file found or failed to load .env");
}

const PORT = 8080;
const chatHandler = require("./netlify/functions/chat.js").handler;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];

  // Route API requests to Netlify function handler
  if (urlPath === "/api/chat" || urlPath === "/.netlify/functions/chat") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", async () => {
      try {
        const event = {
          httpMethod: req.method,
          headers: req.headers,
          body: body
        };
        const result = await chatHandler(event, {});
        res.writeHead(result.statusCode || 200, result.headers || { "Content-Type": "application/json" });
        res.end(result.body || "");
      } catch (err) {
        console.error("Local function handler error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", answer: "Looks like I hit a small technical bump. Please try again in a moment. 🚀" }));
      }
    });
    return;
  }

  // Serve static portfolio files
  let filePath = path.join(__dirname, urlPath === "/" ? "index.html" : urlPath);
  
  // Security check to prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Portfolio & Pavan AI Dev Server running at http://localhost:${PORT}`);
});
