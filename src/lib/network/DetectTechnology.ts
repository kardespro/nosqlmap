import axios from "axios";
import * as cheerio from "cheerio";

async function detectTechnologies(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const headers = response.headers;
    const html = response.data;

    let result = "";

    if (headers["x-frame-options"]) {
      console.log(`X-Frame-Options: ${headers["x-frame-options"]}`);
      result += "Nodejs\n";
    }

    if (headers["x-content-type-options"]) {
      console.log(
        `X-Content-Type-Options: ${headers["x-content-type-options"]}`
      );
      result += "Nodejs\n";
    }

    if (headers["x-xss-protection"]) {
      console.log(`X-XSS-Protection: ${headers["x-xss-protection"]}`);
      result += "Nodejs\n";
    }

    if (headers["access-control-allow-origin"]) {
      console.log(
        `Access-Control-Allow-Origin: ${headers["access-control-allow-origin"]}`
      );
      result += "Nodejs\n";
    }

    if (headers["x-powered-by"]) {
      console.log(`x-powered-by: ${headers["x-powered-by"]}`);
      if (headers["x-powered-by"].toLowerCase().includes("express")) {
        result += "NodeJS\n";
      }
      if (headers["x-powered-by"].toLowerCase().includes("php")) {
        result += "PHP\n";
      }
    } else {
    }

    if (headers["server"]) {
      if (headers["server"].toLowerCase().includes("node")) {
        result += "NodeJS\n";
      }
    } else {
    }

    const $ = cheerio.load(html);

    if (html.includes("/_next/static/")) {
      result += "NextJS\n";
    }

    if (
      headers["x-platform"] &&
      headers["x-platform"].toLowerCase().includes("hostinger")
    ) {
      result += "PHP\n";
    }

    return result.trim();
  } catch (error) {
    console.error("Error Detecting:", error);
    return "Error detecting technologies";
  }
}
export { detectTechnologies }