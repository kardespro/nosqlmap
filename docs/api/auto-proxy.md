# NoSqlMap - API - Auto-Proxy

**Change Proxy Host**

<p>Import Auto-Proxy Utils of NoSqlMap</p>

```js
import { getProxies } from '../src/utils/auto-proxy'
//  cjs
const  { getProxies } = require("../dist/utils/auto-proxy")
```

<p> Update </p>

```js
// url , method
await getProxies("https://cdn3.nego.one/proxy.json", "GET")
```
