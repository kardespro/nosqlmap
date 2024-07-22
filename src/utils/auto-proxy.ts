import axios from "axios";

export async function getProxies(
  url = "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&protocol=http&proxy_format=protocolipport&format=json&timeout=619",
  method = "GET"
) {
  const data = await axios.get(url, {
    timeout: 6000,
    method: method,
  });
  return data.data.proxies;
}
