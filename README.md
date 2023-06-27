# 🤘 Metal Node SDK

[**Developer Documentation**](https://docs.getmetal.io/sdk-typescript)

## Install

```bash
  npm install @getmetal/metal-sdk
  # or
  yarn add @getmetal/metal-sdk
```

## Retrieval Usage

### Setup

```ts
import { Metal } from '@getmetal/metal-sdk'
const metal = new Metal('pk_123', 'ci_123', 'idx_123')
```

### Indexing

```ts
import { Metal } from '@getmetal/metal-sdk'

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
import { Metal } from '@getmetal/metal-sdk'

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

## Memory Usage

### Setup

```ts
import { Motorhead } from '@getmetal/metal-sdk'
const motor = new Motorhead({ apiKey: 'pk_123', clientId: 'ci_123' })
```

### Add Memory

```ts
const memoryPayload = {
  messages: [
    { role: 'Human', content: 'Who is the best vocalist of all time?' },
    { role: 'AI', content: 'Ozzy!' },
  ],
  context: 'User ask what can he eat in Colombia. The AI responds arepas are really nice',
}

await motorhead.addMemory('session-id', memoryPayload)
```

### Get Memory

```ts
await motorhead.getMemory('session-id')
```

---

View the full documentation on [https://docs.getmetal.io/sdks/node](https://docs.getmetal.io/sdks/node)
