import axios from 'axios'
import path from 'path'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import MetalSDK from '../src/index'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const API_KEY = 'api-key'
const CLIENT_ID = 'client-id'

const AXIOS_OPTS = {
  headers: {
    'Content-Type': 'application/json',
    'x-metal-api-key': API_KEY,
    'x-metal-client-id': CLIENT_ID,
  },
}

describe('MetalSDK', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear()
  })
  it('should be defined', () => {
    expect(MetalSDK).toBeDefined()
  })

  it('should instantiate properly', () => {
    const indexId = 'index-id'

    const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

    expect(metal.apiKey).toBe(API_KEY)
    expect(metal.indexId).toBe(indexId)
    expect(metal.clientId).toBe(CLIENT_ID)
  })

  describe('index()', () => {
    it('should error without indexId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)
      const result = metal.index({})
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      const result = metal.index({})
      await expect(result).rejects.toThrowError('payload required')
    })

    it('should send imageBase64 payload', async () => {
      const indexId = 'index-id'
      const base64 = 'base64'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.index({ imageBase64: base64 })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          imageBase64: base64,
          index: indexId,
        },
        AXIOS_OPTS
      )

      mockedAxios.post.mockClear()
    })

    it('should send imageUrl payload', async () => {
      const indexId = 'index-id'
      const imageUrl = 'image.png'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.index({ imageUrl })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          imageUrl,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })

    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.index({ text })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          text,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })

    it('should send metadata payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metadata = { foo: 'bar' }

      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.index({ metadata, text })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          metadata,
          text,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })

    it('should send embedding payload', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.index({ embedding })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          embedding,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })
  })

  describe('indexMany()', () => {
    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.indexMany([{ text, index: indexId }])

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index/bulk',
        {
          data: [
            {
              text,
              index: indexId,
            },
          ],
        },
        AXIOS_OPTS
      )
    })

    it('should send metadata payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const text2 = 'text-to-index2'
      const metadata = { foo: 'bar' }

      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.indexMany([
        { metadata, text, index: indexId },
        { metadata, text: text2, index: indexId },
      ])

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index/bulk',
        {
          data: [
            {
              metadata,
              text,
              index: indexId,
            },
            {
              metadata,
              text: text2,
              index: indexId,
            },
          ],
        },
        AXIOS_OPTS
      )
    })

    it('should send embedding payload', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.indexMany([{ index: indexId, embedding }])

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index/bulk',
        {
          data: [
            {
              embedding,
              index: indexId,
            },
          ],
        },
        AXIOS_OPTS
      )
    })
  })

  describe('search()', () => {
    it('should error without indexId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)
      const result = metal.search({})
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.search()

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=10',
        {
          index: 'index-id',
        },
        AXIOS_OPTS
      )
    })

    it('should send imageBase64 payload', async () => {
      const indexId = 'index-id'
      const base64 = 'base64'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.search({ imageBase64: base64 })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=10',
        {
          imageBase64: base64,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })

    it('should send imageUrl payload', async () => {
      const indexId = 'index-id'
      const imageUrl = 'image.png'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.search({ imageUrl })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=10',
        {
          imageUrl,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })

    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-search'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.search({ text, filters: [{ field: 'favoriteNumber', value: 666 }] })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=10',
        {
          text,
          index: indexId,
          filters: [{ field: 'favoriteNumber', value: 666 }],
        },
        AXIOS_OPTS
      )
    })

    it('should add idsOnly=true querystring', async () => {
      const indexId = 'index-id'
      const text = 'text-to-search'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      await metal.search({ text, idsOnly: true, limit: 100 })

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=100&idsOnly=true',
        {
          text,
          index: indexId,
        },
        AXIOS_OPTS
      )
    })
  })

  describe('tune()', () => {
    it('should error without indexId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)
      const result = metal.tune({ idA: 'a', idB: 'b', label: 1 })
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.tune({})
      await expect(result).rejects.toThrowError('idA, idB, & label required for payload')
    })

    it('should send with payload', async () => {
      const indexId = 'index-id'
      const metal = new MetalSDK(API_KEY, CLIENT_ID, indexId)

      mockedAxios.post.mockResolvedValue({ data: null })

      const idA = 'id-a'
      const idB = 'id-b'
      const label = 1

      await metal.tune({ idA, idB, label })

      expect(axios.post).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/tune`,
        {
          index: indexId,
          idA,
          idB,
          label,
        },
        AXIOS_OPTS
      )
    })
  })

  describe('getOne()', () => {
    it('should error without `id`', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.getOne()
      await expect(result).rejects.toThrowError('id required')
    })

    it('should error without `id`', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)
      const result = metal.getOne('megadeth')
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should get one by id', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')

      mockedAxios.get.mockResolvedValue({
        data: { id: 'megadeth', metadata: { vocalist: 'Dave Mustain' } },
      })

      await metal.getOne('megadeth')

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/megadeth`,
        AXIOS_OPTS
      )
    })
  })

  describe('deleteOne()', () => {
    it('should error without `id`', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.deleteOne()
      await expect(result).rejects.toThrowError('id required')
    })

    it('should error without `id`', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)
      const result = metal.deleteOne('megadeth')
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should del one by id', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')

      mockedAxios.delete.mockResolvedValue({
        data: null,
      })

      await metal.deleteOne('megadeth')

      expect(axios.delete).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/megadeth`,
        AXIOS_OPTS
      )
    })
  })

  describe('deleteMany()', () => {
    it('should error without `ids`', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.deleteMany()
      await expect(result).rejects.toThrowError('ids required')
    })

    it('should del by ids', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID)

      mockedAxios.delete.mockResolvedValue({
        data: null,
      })

      await metal.deleteMany(['megadeth', 'blacksabbath'])

      expect(axios.delete).toHaveBeenCalledWith(`https://api.getmetal.io/v1/documents/bulk`, {
        ...AXIOS_OPTS,
        data: { ids: ['megadeth', 'blacksabbath'] },
      })
    })

    describe('uploadFile()', () => {
      it('takes path', async () => {
        const metal = new MetalSDK(API_KEY, CLIENT_ID)

        mockedAxios.put.mockResolvedValue({
          data: {},
        })

        mockedAxios.post.mockResolvedValue({
          data: { url: 'mocked.com/berghain?withquery=true' },
        })

        const filePath = path.join(__dirname, 'fixtures', 'sample.csv')

        await metal.uploadFile({ indexId: 'index-id', file: filePath })

        expect(axios.post).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/files`,
          {
            fileName: 'sample.csv',
            fileType: 'text/csv',
          },
          {
            headers: { ...AXIOS_OPTS.headers, 'x-metal-file-size': '43' },
          }
        )

        expect(axios.put).toHaveBeenCalledWith(
          'mocked.com/berghain?withquery=true',
          expect.anything(),
          {
            headers: {
              'content-length': '43',
              'content-type': 'text/csv',
            },
          }
        )
      })

      it('takes File object', async () => {
        const metal = new MetalSDK(API_KEY, CLIENT_ID)

        mockedAxios.put.mockResolvedValue({
          data: {},
        })

        mockedAxios.post.mockResolvedValue({
          data: { url: 'mocked.com/berghain?withquery=true' },
        })

        const dom = new JSDOM()
        const fileContent = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample.csv'))
        const file = new dom.window.File([fileContent], 'sample.csv', { type: 'text/csv' })

        await metal.uploadFile({ indexId: 'index-id', file })

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/files`,
          {
            fileName: 'sample.csv',
            fileType: 'text/csv',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-metal-api-key': API_KEY,
              'x-metal-client-id': CLIENT_ID,
              'x-metal-file-size': '43',
            },
          }
        )

        expect(mockedAxios.put).toHaveBeenCalledWith(
          'mocked.com/berghain?withquery=true',
          expect.anything(),
          {
            headers: {
              'content-length': '43',
              'content-type': 'text/csv',
            },
          }
        )
      })
    })
  })
})
