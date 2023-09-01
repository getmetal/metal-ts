import { Metal } from '../src/index'
import path from 'path'
import { JSDOM } from 'jsdom'
import fs from 'fs'

const fetchMock = jest.spyOn(global, 'fetch')

const getMockRes =
  (data: any, ok: boolean = true, status: number = 200) =>
  async (): Promise<Response> => {
    return (await Promise.resolve({
      json: async () => await Promise.resolve({ data }),
      ok,
      status,
    })) as Response
  }

const API_KEY = 'api-key'
const CLIENT_ID = 'client-id'

const HEADERS = {
  'Content-Type': 'application/json',
  'x-metal-api-key': API_KEY,
  'x-metal-client-id': CLIENT_ID,
}

describe('Metal', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('should be defined', () => {
    expect(Metal).toBeDefined()
  })

  it('should instantiate properly', () => {
    const indexId = 'index-id'

    const metal = new Metal(API_KEY, CLIENT_ID, indexId)

    expect(metal.apiKey).toBe(API_KEY)
    expect(metal.indexId).toBe(indexId)
    expect(metal.clientId).toBe(CLIENT_ID)
  })

  describe('index()', () => {
    it('should error without indexId', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.index({})
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      const result = metal.index({})
      await expect(result).rejects.toThrowError('payload required')
    })

    it('should send imageBase64 payload', async () => {
      const indexId = 'index-id'
      const base64 = 'base64'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.index({ imageBase64: base64 })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          index: indexId,
          imageBase64: base64,
        }),
      })
    })

    it('should send imageUrl payload', async () => {
      const indexId = 'index-id'
      const imageUrl = 'image.png'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.index({ imageUrl })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          imageUrl,
        }),
        headers: HEADERS,
      })
    })

    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.index({ text })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          text,
        }),
        headers: HEADERS,
      })
    })

    it('should send metadata payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metadata = { foo: 'bar' }

      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.index({ metadata, text })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          metadata,
          text,
        }),
        headers: HEADERS,
      })
    })

    it('should send embedding payload', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.index({ embedding })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          embedding,
        }),
        headers: HEADERS,
      })
    })

    it('should handle error and reject', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes({ message: 'bad param' }, false, 400))

      await metal
        .index({ text })
        .then(() => {
          throw new Error('should not resolve')
        })
        .catch((err) => {
          expect(err.message).toBe('Error status code: 400.')
        })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          text,
        }),
        headers: HEADERS,
      })
    })
  })

  describe('indexMany()', () => {
    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.indexMany([{ text, index: indexId }])

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index/bulk', {
        method: 'POST',
        body: JSON.stringify({
          data: [
            {
              text,
              index: indexId,
            },
          ],
        }),
        headers: HEADERS,
      })
    })

    it('should send metadata payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-index'
      const text2 = 'text-to-index2'
      const metadata = { foo: 'bar' }

      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.indexMany([
        { metadata, text, index: indexId },
        { metadata, text: text2, index: indexId },
      ])

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index/bulk', {
        method: 'POST',
        body: JSON.stringify({
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
        }),
        headers: HEADERS,
      })
    })

    it('should send embedding payload', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.indexMany([{ index: indexId, embedding }])

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index/bulk', {
        method: 'POST',
        body: JSON.stringify({
          data: [
            {
              index: indexId,
              embedding,
            },
          ],
        }),
        headers: HEADERS,
      })
    })

    it('should handle error', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes({ message: 'bad param' }, false, 400))

      await metal
        .indexMany([{ index: indexId, embedding }])
        .then(() => {
          throw new Error('should not resolve')
        })
        .catch((err) => {
          expect(err.message).toBe('Error status code: 400.')
        })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index/bulk', {
        method: 'POST',
        body: JSON.stringify({
          data: [
            {
              index: indexId,
              embedding,
            },
          ],
        }),
        headers: HEADERS,
      })
    })

    it('should inject index into payload', async () => {
      const indexId = 'index-id'
      const embedding = [1, 2, 3]
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.indexMany([{ embedding }])

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/index/bulk', {
        method: 'POST',
        body: JSON.stringify({
          data: [
            {
              index: indexId,
              embedding,
            },
          ],
        }),
        headers: HEADERS,
      })
  })

  describe('search()', () => {
    it('should error without indexId', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.search({})
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.search()

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/search?limit=10', {
        method: 'POST',
        body: JSON.stringify({
          index: 'index-id',
        }),
        headers: HEADERS,
      })
    })

    it('should send imageBase64 payload', async () => {
      const indexId = 'index-id'
      const base64 = 'base64'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.search({ imageBase64: base64 })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/search?limit=10', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          imageBase64: base64,
        }),
        headers: HEADERS,
      })
    })

    it('should send imageUrl payload', async () => {
      const indexId = 'index-id'
      const imageUrl = 'image.png'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.search({ imageUrl })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/search?limit=10', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          imageUrl,
        }),
        headers: HEADERS,
      })
    })

    it('should send text payload', async () => {
      const indexId = 'index-id'
      const text = 'text-to-search'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.search({
        text,
        filters: { and: [{ field: 'favoriteNumber', operator: 'lt', value: 666 }] },
      })

      expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/search?limit=10', {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          filters: { and: [{ field: 'favoriteNumber', operator: 'lt', value: 666 }] },
          text,
        }),
        headers: HEADERS,
      })
    })

    it('should add idsOnly=true querystring', async () => {
      const indexId = 'index-id'
      const text = 'text-to-search'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.search({ text, idsOnly: true, limit: 100 })

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=100&idsOnly=true',
        {
          method: 'POST',
          body: JSON.stringify({
            index: indexId,
            text,
          }),
          headers: HEADERS,
        }
      )
    })

    it('should handle error', async () => {
      const indexId = 'index-id'
      const text = 'text-to-search'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes({ message: 'bad param' }, false, 400))

      await metal
        .search({ text, idsOnly: true, limit: 100 })
        .then(() => {
          throw new Error('should not resolve')
        })
        .catch((err) => {
          expect(err.message).toBe('Error status code: 400.')
        })

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=100&idsOnly=true',
        {
          method: 'POST',
          body: JSON.stringify({
            index: indexId,
            text,
          }),
          headers: HEADERS,
        }
      )
    })
  })

  describe('tune()', () => {
    it('should error without indexId', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.tune({ idA: 'a', idB: 'b', label: 1 })
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should error without payload', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.tune({})
      await expect(result).rejects.toThrowError('idA, idB, & label required for payload')
    })

    it('should send with payload', async () => {
      const indexId = 'index-id'
      const metal = new Metal(API_KEY, CLIENT_ID, indexId)

      fetchMock.mockImplementationOnce(getMockRes(null))

      const idA = 'id-a'
      const idB = 'id-b'
      const label = 1

      await metal.tune({ idA, idB, label })

      expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/tune`, {
        method: 'POST',
        body: JSON.stringify({
          index: indexId,
          idA,
          idB,
          label,
        }),
        headers: HEADERS,
      })
    })
  })

  describe('getOne()', () => {
    it('should error without `id`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.getOne()
      await expect(result).rejects.toThrowError('id required')
    })

    it('should error without `id`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.getOne('megadeth')
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should get one by id', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

      fetchMock.mockImplementationOnce(
        getMockRes({ id: 'megadeth', metadata: { vocalist: 'Dave Mustain' } })
      )

      await metal.getOne('megadeth')

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/megadeth`,
        {
          headers: HEADERS,
        }
      )
    })
  })

  describe('deleteOne()', () => {
    it('should error without `id`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.deleteOne()
      await expect(result).rejects.toThrowError('id required')
    })

    it('should error without `id`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.deleteOne('megadeth')
      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should del one by id', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.deleteOne('megadeth')

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/megadeth`,
        {
          method: 'DELETE',
          headers: HEADERS,
        }
      )
    })
  })

  describe('deleteMany()', () => {
    it('should error without `ids`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      // @ts-expect-error testing
      const result = metal.deleteMany()
      await expect(result).rejects.toThrowError('ids required')
    })

    it('should del by ids', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

      fetchMock.mockImplementationOnce(getMockRes(null))

      await metal.deleteMany(['megadeth', 'blacksabbath'])

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/bulk`,
        {
          method: 'DELETE',
          body: JSON.stringify({ ids: ['megadeth', 'blacksabbath'] }),
          headers: HEADERS,
        }
      )
    })

    describe('uploadFile()', () => {
      it('takes path', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

        fetchMock
          .mockImplementationOnce(getMockRes({ url: 'mocked.com/berghain?withquery=true' }))
          .mockImplementationOnce(getMockRes({}))

        const filePath = path.join(__dirname, 'fixtures', 'sample.csv')
        await metal.uploadFile(filePath)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/files`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileName: 'sample.csv',
              fileType: 'text/csv',
            }),
            headers: {
              ...HEADERS,
              'x-metal-file-size': '43',
            },
          }
        )

        expect(fetchMock).toHaveBeenCalledWith('mocked.com/berghain?withquery=true', {
          method: 'PUT',
          body: fs.readFileSync(filePath),
          headers: {
            'content-length': '43',
            'content-type': 'text/csv',
          },
        })
      })

      it('sanitizes file name', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

        fetchMock
          .mockImplementationOnce(getMockRes({ url: 'mocked.com/berghain?withquery=true' }))
          .mockImplementationOnce(getMockRes({}))

        const filePath = path.join(__dirname, 'fixtures', '_+$!*badname.csv')

        await metal.uploadFile(filePath)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/files`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileName: '_____badname.csv',
              fileType: 'text/csv',
            }),
            headers: {
              ...HEADERS,
              'x-metal-file-size': '14',
            },
          }
        )

        expect(fetchMock).toHaveBeenCalledWith('mocked.com/berghain?withquery=true', {
          method: 'PUT',
          body: expect.anything(),
          headers: {
            'content-length': '14',
            'content-type': 'text/csv',
          },
        })
      })

      it('takes File object', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

        fetchMock
          .mockImplementationOnce(getMockRes({ url: 'mocked.com/berghain?withquery=true' }))
          .mockImplementationOnce(getMockRes({}))

        const dom = new JSDOM()
        const fileContent = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample.csv'))
        const file = new dom.window.File([fileContent], 'sample.csv', { type: 'text/csv' })

        await metal.uploadFile(file)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/files`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileName: 'sample.csv',
              fileType: 'text/csv',
            }),
            headers: {
              ...HEADERS,
              'x-metal-file-size': '43',
            },
          }
        )

        expect(fetchMock).toHaveBeenCalledWith('mocked.com/berghain?withquery=true', {
          method: 'PUT',
          body: expect.anything(),
          headers: {
            'content-length': '43',
            'content-type': 'text/csv',
          },
        })
      })
    })
  })
})
