import axios from "axios";
import { bold, green, red, blue, cyan } from "colorette";
import { generatePayloads } from "../extra/payloads";
const wafSignatures = [
  { name: "Cloudflare", header: "Server", value: "cloudflare" },
  { name: "AWS WAF", header: "x-amzn-RequestId" },
  { name: "AWS ELB", header: "X-AMZ-ID" },
  { name: "Sucuri", header: "x-sucuri-id" },
  { name: "ModSecurity", header: "Server", value: "Mod_Security" },
  { name: "Incapsula", header: "X-CDN", value: "Incapsula" },
  { name: "F5 BIG-IP ASM", header: "X-WAF-Status" },
  { name: "Barracuda", header: "Server", value: "Barracuda" },
  { name: "Imperva", header: "X-Iinfo" },
  { name: "Reblaze", header: "Server", value: "Reblaze Secure Web Gateway" },
  { name: "DenyAll", header: "X-Backside-Transport" },
  { name: "wangshan.360.cn", header: "WZWS-Ray" },
  { name: "aeSecure", header: "aeSecure-code" },
  { name: "Airlock", header: "Set-Cookie", value: "AL-LB" },
  { name: "Anquanbao", header: "X-Powered-by-Anquanbao" },
  { name: "Approach", header: "Server", value: "Approach" },
];

async function pushWafSign(name: string, header: string, value?: string) {
  return wafSignatures.push({ name, header, value });
}

async function deleteWafSign(header: string){
    const index = wafSignatures.map(x => {
        return x.header;
      }).indexOf(header);
    return wafSignatures.splice(index,1)
}

async function detectWAF(url: string, headers?: Record<string, string>) {
  try {
    const response = await axios.get(url, { headers });

    for (const waf of wafSignatures) {
      if (
        response.headers[waf.header.toLowerCase()] &&
        (!waf.value ||
          response.headers[waf.header.toLowerCase()].includes(waf.value))
      ) {
        console.log(`      ${bold(green("WAF Detected"))}: ${bold(blue(waf.name))}`);
        console.log(" ")
        return waf.name;
      }
    }

    const testPayloads = generatePayloads("search", false, true);

    for (const { payload, description } of testPayloads) {
      try {
        const testResponse = await axios.get(`${url}?${payload}`, { headers });
        if (testResponse.status === 403 || testResponse.status === 406) {
          console.log(
            `${bold(red("Possible WAF Detected"))}: Response Status ${
              testResponse.status
            }`
          );
          return "Possible WAF";
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 403 || error.response?.status === 406)
        ) {
          console.log(
            `${bold(red("Possible WAF Detected"))}: Response Status ${
              error.response.status
            }`
          );
          return "Possible WAF";
        }
      }
    }
    console.log(`${bold(cyan("No WAF Detected"))}`);
    return "No WAF";
  } catch (error) {
    console.error(`${bold(red("Error"))}: ${error}`);
  }
}

export { detectWAF, pushWafSign, deleteWafSign };
