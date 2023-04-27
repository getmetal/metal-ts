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
await metal.index({
  id: '666', // Id is optional <> if not provided, Metal will generate one
  text: 'Ozzy Osbourne',
  metadata: { band: 'Black Sabbath' },
})

// Index Image from URL
await metal.index({ imageUrl: 'https://image.png' })
// Index Image from Base64
await metal.index({ imageBase64: '<base-64-str>' })
```

### Searching

```ts
import Metal from '@getmetal/metal-sdk'

const metal = new Metal('api-key', 'client-id', 'index-id')

// Search Text
await metal.search({
  text: 'Who is the lead singer of Black Sabbath?',
  limit: 1,
})

await metal.search({ imageUrl: 'search-by-image.png' })

// Filtered Search
await metal.search({
  text: 'Heavy Metal',
  filters: [{ field: 'band', value: 'Black Sabbath' }],
})
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
