import express from "express";
import { fileURLToPath } from "url";
import qrcode from "qrcode";

import { loadDb, getData, addData } from "./jsondb.js";
await loadDb();

const SERVER_PORT = 4192;

const app = express();
app.use(express.json());

// Added this in conjunction with the nginx config:
// proxy_set_header Host $host;
// proxy_set_header X-Forwarded-Proto $scheme;
app.set("trust proxy", true);

// Send an email using a template.
app.post("/api/encode", async (req, res) => {
  const appUrl = req.protocol + "://" + req.get("host");
  const { url } = req.body;
  let qrData;
  // Validate URL:
  if (url) {
    // && /^https?:\/\/\S+$/.test(url)
    // create short url:
    const code = Math.random().toString(36).substring(2, 8);
    // save the url and code pair
    addData(code, url);
    const shortUrl = `${appUrl}/qr/${code}`;
    qrData = await qrcode.toDataURL(shortUrl);
  } else {
    // @TODO: handle errors.
  }
  return res.status(200).json({ qrData });
});

// Send an email using a template.
app.get("/qr/:code", async (req, res) => {
  let code = req.params.code;
  const dest = getData(code);
  if (dest) {
    // res.redirect(301, dest);
    const appUrl = req.protocol + "://" + req.get("host");
    res.send(`
  <html>
    <head>
      <meta http-equiv="refresh" content="2;url=${dest}">
    </head>
    <body>
      <a href="${appUrl}">
      <h1>${appUrl}</h1>
      <p>Click to try ${appUrl}</p>
      <p>Redirecting to ${dest} . . .</p>
      </a>
    </body>
  </html>
`);
  } else {
    res.status(404).json({ error: "Not found." });
  }
});

// Static public folder.
app.use("/", express.static(fileURLToPath(new URL("public", import.meta.url))));

// Run the server
app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
