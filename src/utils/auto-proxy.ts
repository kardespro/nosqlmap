import axios from "axios";

export async function getProxies() {
  const data = await axios.get(
    "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&protocol=http&proxy_format=protocolipport&format=json&timeout=619",
    {
        timeout: 6000
    }
  );
  return data.data.proxies
}
