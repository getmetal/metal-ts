# Metal SDK

## Usage

```bash
  npm i --save @getmetal/metal-sdk

  yarn add @getmetal/metal-sdk
```

Then in your app you can use it to index.


```javascript
import Metal from '@getmetal/metal-sdk'


const metal = new Metal('api-key', 'client-id', 'app-id');

await metal.index('Data to index! Heavy metal is the law');

```