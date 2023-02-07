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

// Index Text
await metal.index({ text: 'Data to index! Heavy metal is the law' });

// Index Image from URL
await metal.index({ imageUrl: 'https://images.unsplash.com/photo-1593573969589-c416b9c926de' });

// Index Image from Base64
await metal.index({ imageBase64: '<base-64-str>' });

```