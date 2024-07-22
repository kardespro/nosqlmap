# NoSqlMap - API - WAF

**Update/Delete Waf Signatures with api**

<p>Import Waf Utils of NoSqlMap</p>

```js
import { pushWafSign, deleteWafSign } from '../src/utils/waf'
//  cjs
const  { pushWafSign, deleteWafSign } = require("../dist/utils/waf")
```

<p> Update </p>

```js
// name ,  header , value(optional)
await pushWafSign("Example Waf","x-fw", "Example")
```

<p> Delete </p>

```js
// header
await deleteWafSign("x-fw")
```