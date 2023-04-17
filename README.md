# 🤘 Metal TypeScript SDK

[**Developer Documentation**](https://docs.getmetal.io/sdk-typescript)

## Setup

```bash
  npm i --save @getmetal/metal-sdk

  yarn add @getmetal/metal-sdk
```

## Usage

### Indexing

```ts
import Metal from '@getmetal/metal-sdk'

const metal = new Metal('api-key', 'client-id', 'index-id')

// Index Text
await metal.index({ text: 'text to index' })

// Index Image from URL
await metal.index({ imageUrl: 'https://image.png' })

// Index Image from Base64
await metal.index({ imageBase64: '<base-64-str>' })
```

### Searching

```ts
import Metal from '@getmetal/metal-sdk'

const metal = new Metal('api-key', 'client-id', 'index-id')

// Index Text
await metal.search({ text: 'search by text' })
await metal.search({ imageUrl: 'search-by-image.png' })
```

### Tuning

```ts
import Metal from '@getmetal/metal-sdk'

const metal = new Metal('api-key', 'client-id', 'index-id')

// Tune to decrease distance
await metal.tune({ idA: 'id-a', idB: 'id-b', label: 1 })

// Tune to increase distance
await metal.tune({ idA: 'id-a', idB: 'id-b', label: -1 })
```
