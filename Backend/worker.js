// List of Terabox cookie strings
const COOKIES = [
  'ndus=YzeXcd1peHuiK2_zig1UkhLraLgytieQ2TwpyHiy; ndut_fmt=35E53AA0B7793B84FF6E3D1F88C1A7D86BC036C1885B169D0EAA35446C0F2E65;',
  'ndus=YV2gziEteHuirP143VrwHfvzxBYjlRyws16RqEca; ndut_fmt=09299EF54861A4CE7868C0A70C12FA4C526F756846080492F91DCF9A4A56CE55;',
  // Add premium cookies here
];

const VALID_DOMAINS = [
  "terabox.com", "www.terabox.com", "teraboxapp.com", "www.teraboxapp.com",
  "teraboxshare.com", "www.teraboxshare.com", "1024tera.com", "www.1024tera.com",
  "1024tera.co", "www.1024tera.co", "pan.terabox.com", "pan.1024tera.com",
  "share.terabox.com", "share.1024tera.com", "mirrobox.com", "www.mirrobox.com",
  "nephobox.com", "www.nephobox.com", "freeterabox.com", "www.freeterabox.com",
  "4funbox.co", "www.4funbox.com", "terabox.app", "www.terabox.app", "terabox.fun",
  "momerybox.com", "www.momerybox.com", "tibibox.com", "www.tibibox.com"
];

function createHeaders(cookie, host) {
  return {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "DNT": "1",
    "Host": host || "www.terabox.app",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Cookie": cookie,
  };
}

function createDLHeaders(cookie) {
  return {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Referer": "https://terabox.com/",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cookie": cookie,
  };
}

function getSize(bytes) {
  if (bytes >= 1 << 30) return `${(bytes / (1 << 30)).toFixed(2)} GB`;
  if (bytes >= 1 << 20) return `${(bytes / (1 << 20)).toFixed(2)} MB`;
  if (bytes >= 1 << 10) return `${(bytes / (1 << 10)).toFixed(2)} KB`;
  return `${bytes} bytes`;
}

function findBetween(str, start, end) {
  const startIndex = str.indexOf(start);
  if (startIndex === -1) return "";
  const endIndex = str.indexOf(end, startIndex + start.length);
  if (endIndex === -1) return "";
  return str.slice(startIndex + start.length, endIndex);
}

async function getFileInfo(link, request) {
  if (!link) return { error: "Link cannot be empty." };

  // Extract host from link
  const urlObj = new URL(link);
  const host = urlObj.host;
  if (!VALID_DOMAINS.includes(host)) {
    return { error: `Unsupported domain: ${host}.` };
  }

  for (let i = 0; i < COOKIES.length; i++) {
    const cookie = COOKIES[i];
    try {
      console.log(`Trying cookie ${i + 1}/${COOKIES.length} for ${host}`);
      const HEADERS = createHeaders(cookie, host);
      const response = await fetch(link, { headers: HEADERS, redirect: "follow" });
      if (!response.ok) {
        console.log(`Cookie ${i + 1} failed with status ${response.status}`);
        continue;
      }

      const finalUrl = response.url;
      const surl = new URL(finalUrl).searchParams.get("surl");
      if (!surl) {
        console.log(`Cookie ${i + 1}: No surl found`);
        continue;
      }

      const text = await response.text();
      const jsToken = findBetween(text, 'fn%28%22', '%22%29');
      const logid = findBetween(text, 'dp-logid=', '&');
      const bdstoken = findBetween(text, 'bdstoken":"', '"');

      if (!jsToken || !logid || !bdstoken) {
        console.log(`Cookie ${i + 1}: Missing jsToken, logid, or bdstoken`);
        continue;
      }

      const params = new URLSearchParams({
        app_id: "250528",
        web: "1",
        channel: "dubox",
        clienttype: "0",
        jsToken,
        "dp-logid": logid,
        page: "1",
        num: "20",
        by: "name",
        order: "asc",
        site_referer: finalUrl,
        shorturl: surl,
        root: "1,",
      });

      const fileListRes = await fetch(`https://dm.terabox.app/share/list?${params}`, { headers: HEADERS });
      const data = await fileListRes.json();

      if (!data?.list?.length || data.errno) {
        console.log(`Cookie ${i + 1}: No file list or errno ${data.errno}`);
        continue;
      }

      const file = data.list[0];
      let speedInfo = "";
      if (file.dlink) {
        const startTime = Date.now();
        const testRes = await fetch(file.dlink, { method: "HEAD", headers: createDLHeaders(cookie) });
        const duration = (Date.now() - startTime) / 1000;
        speedInfo = `Download link response time: ${duration}s, status: ${testRes.status}`;
        console.log(speedInfo);
      }

      return {
        file_name: file.server_filename || "unknown",
        download_link: file.dlink || "",
        thumbnail: file.thumbs?.url3 || "",
        file_size: getSize(parseInt(file.size || 0)),
        size_bytes: parseInt(file.size || 0),
        proxy_url: `https://${new URL(request.url).host}/proxy?url=${encodeURIComponent(file.dlink)}&file_name=${encodeURIComponent(file.server_filename || 'download')}`,
        debug_info: speedInfo,
      };
    } catch (e) {
      console.log(`Cookie ${i + 1} error: ${e.message}`);
      continue;
    }
  }

  return { error: "All cookie attempts failed. Cookies may be expired or invalid." };
}

async function proxyDownload(url, fileName, request) {
  for (const cookie of COOKIES) {
    try {
      const DL_HEADERS = createDLHeaders(cookie);
      const headers = new Headers(DL_HEADERS);
      const range = request.headers.get("Range");
      if (range) headers.set("Range", range);

      const res = await fetch(url, { headers, redirect: "follow" });

      if (!res.ok && res.status !== 206) {
        console.log(`Proxy fetch failed with status ${res.status}`);
        continue;
      }

      const responseHeaders = new Headers({
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`, // Changed to attachment
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Range",
        "Access-Control-Expose-Headers": "Content-Length,Content-Range",
      });

      if (res.headers.has("Content-Range"))
        responseHeaders.set("Content-Range", res.headers.get("Content-Range"));
      if (res.headers.has("Content-Length"))
        responseHeaders.set("Content-Length", res.headers.get("Content-Length"));

      return new Response(res.body, {
        status: res.status,
        headers: responseHeaders,
      });
    } catch (e) {
      console.log(`Proxy error with cookie: ${e.message}`);
      continue;
    }
  }

  return new Response(JSON.stringify({ error: "All proxy cookie attempts failed." }), {
    status: 502,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request) {
    const { method, url } = request;
    const parsed = new URL(url);

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Range",
          "Access-Control-Expose-Headers": "Content-Length,Content-Range",
        },
      });
    }

    if (method === "POST" && parsed.pathname === "/") {
      try {
        const { link } = await request.json();
        const info = await getFileInfo(link, request);
        return new Response(JSON.stringify(info), {
          status: info.error ? 400 : 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: `Bad request: ${e.message}` }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (method === "GET" && parsed.pathname === "/proxy") {
      const downloadUrl = parsed.searchParams.get("url");
      const fileName = parsed.searchParams.get("file_name") || "download";
      if (!downloadUrl) {
        return new Response(JSON.stringify({ error: "Missing download URL." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      return await proxyDownload(downloadUrl, fileName, request);
    }

    return new Response(JSON.stringify({ error: "Unsupported method or route." }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  },
};
