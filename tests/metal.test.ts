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
              embedding,
              index: indexId,
            },
          ],
        }),
        headers: HEADERS,
      })
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

  describe('getMany()', () => {
    it('should error without `ids`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')
      const result = metal.getMany([])
      await expect(result).rejects.toThrowError('ids should be between 1 and 100')
    })

    it('should error without `indexId`', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID)
      const result = metal.getMany(['123', '456'])

      await expect(result).rejects.toThrowError('indexId required')
    })

    it('should get one by id', async () => {
      const metal = new Metal(API_KEY, CLIENT_ID, 'index-id')

      fetchMock.mockImplementationOnce(
        getMockRes([
          { id: 'megadeth', metadata: { vocalist: 'Dave Mustain' } },
          { id: 'ironmaiden', metadata: { vocalist: 'Bruce' } },
        ])
      )

      await metal.getMany(['megadeth', 'ironmaiden'])

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/indexes/index-id/documents/megadeth,ironmaiden`,
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

    describe('addDatasource()', () => {
      it('should error without name', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const result = metal.addDatasource({ sourcetype: 'File', autoExtract: true } as any)
        await expect(result).rejects.toThrowError('name required')
      })

      it('should error without sourcetype', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const result = metal.addDatasource({ name: 'Test DataSource', autoExtract: true } as any)
        await expect(result).rejects.toThrowError('sourcetype required')
      })

      it('should send correct payload with File sourcetype', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const payload = {
          name: 'Sample Data Source',
          sourcetype: 'file' as 'file',
          autoExtract: true,
        }

        fetchMock.mockImplementationOnce(getMockRes(null))

        await metal.addDatasource(payload)

        expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/datasources', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })

      it('should send correct payload with Text sourcetype', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const payload = {
          name: 'Sample Data Source',
          sourcetype: 'text' as 'text',
          autoExtract: false,
        }

        fetchMock.mockImplementationOnce(getMockRes(null))

        await metal.addDatasource(payload)

        expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/datasources', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })

      it('should handle error and reject', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const payload = {
          name: 'Sample Data Source',
          sourcetype: 'file' as 'file',
          autoExtract: true,
        }

        fetchMock.mockImplementationOnce(getMockRes({ message: 'bad param' }, false, 400))

        await metal
          .addDatasource(payload)
          .then(() => {
            throw new Error('should not resolve')
          })
          .catch((err) => {
            expect(err.message).toBe('Error status code: 400.')
          })

        expect(fetchMock).toHaveBeenCalledWith('https://api.getmetal.io/v1/datasources', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })
    })

    describe('getDatasource()', () => {
      it('should error without `id`', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        // @ts-expect-error testing
        const result = metal.getDatasource()
        await expect(result).rejects.toThrowError('id required')
      })

      it('should get a datasource by id', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const mockId = '1234'

        fetchMock.mockImplementationOnce(getMockRes({ id: mockId, name: 'Some Datasource' }))

        await metal.getDatasource(mockId)

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/datasources/${mockId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-metal-api-key': API_KEY,
            'x-metal-client-id': CLIENT_ID,
          },
        })
      })
    })

    describe('getAllDatasources()', () => {
      it('should get all datasources without parameters', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock.mockImplementationOnce(
          getMockRes([
            { id: '1', name: 'Datasource1' },
            { id: '2', name: 'Datasource2' },
          ])
        )

        await metal.getAllDatasources()

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/datasources?`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-metal-api-key': API_KEY,
            'x-metal-client-id': CLIENT_ID,
          },
        })
      })

      it('should get all datasources with limit and page parameters', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const mockLimit = 10
        const mockPage = 2

        fetchMock.mockImplementationOnce(getMockRes([{ id: '3', name: 'Datasource3' }]))

        await metal.getAllDatasources(mockLimit, mockPage)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/datasources?limit=${mockLimit}&page=${mockPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-metal-api-key': API_KEY,
              'x-metal-client-id': CLIENT_ID,
            },
          }
        )
      })
    })

    describe('deleteDatasource()', () => {
      const API_URL = 'https://api.getmetal.io'
      const HEADERS = {
        'Content-Type': 'application/json',
        'x-metal-api-key': API_KEY,
        'x-metal-client-id': CLIENT_ID,
      }

      it('should error without `id`', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)

        // @ts-expect-error testing
        const result = metal.deleteDatasource()

        await expect(result).rejects.toThrowError('id required')
      })

      it('should delete datasource by id', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }))

        await metal.deleteDatasource('datasource-id')

        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/datasources/datasource-id`, {
          method: 'DELETE',
          headers: HEADERS,
        })
      })

      it('should throw error if response is not ok', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock.mockResolvedValueOnce(
          new Response('Error message', { status: 404, statusText: 'Not Found' })
        )

        const result = metal.deleteDatasource('datasource-id')

        await expect(result).rejects.toThrowError('Error deleting data source: Not Found')
      })
    })

    describe('updateDatasource()', () => {
      it('should error without id', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        await expect(async () => await metal.updateDatasource('', {})).rejects.toThrowError(
          'id required'
        )
      })

      it('should send update with empty payload', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleID'

        fetchMock.mockImplementationOnce(getMockRes(null))

        await metal.updateDatasource(id, {})

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/datasources/${id}`, {
          method: 'PUT',
          body: JSON.stringify({}),
          headers: HEADERS,
        })
      })

      it('should send correct update with filled payload', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const payload = {
          name: 'Updated Data Source',
          sourcetype: 'text' as 'text',
          autoExtract: true,
        }
        const id = 'sampleID'

        fetchMock.mockImplementationOnce(getMockRes(null))

        await metal.updateDatasource(id, payload)

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/datasources/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })

      it('should handle error and reject', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleID'

        fetchMock.mockImplementationOnce(getMockRes({ message: 'bad param' }, false, 400))

        await metal
          .updateDatasource(id, {})
          .then(() => {
            throw new Error('should not resolve')
          })
          .catch((err) => {
            expect(err.message).toBe('Error status code: 400.')
          })

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/datasources/${id}`, {
          method: 'PUT',
          body: JSON.stringify({}),
          headers: HEADERS,
        })
      })
    })

    describe('addDataEntity()', () => {
      it('handles file paths', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock
          .mockResolvedValueOnce(new Response(JSON.stringify({ url: 'https://mocked.url/upload' })))
          .mockResolvedValueOnce(new Response(JSON.stringify({})))

        const filepath = path.join(__dirname, 'fixtures', 'sample.csv')
        const datasourceId = 'some-datasource-id'

        await metal.addDataEntity({
          datasource: datasourceId,
          filepath,
          metadata: {
            vocalist: 'ozzy',
          },
        })

        expect(fetchMock.mock.calls[0][0]).toEqual(`https://api.getmetal.io/v1/data-entities`)
        expect(fetchMock.mock.calls[0][1]).toEqual({
          method: 'POST',
          body: JSON.stringify({
            datasource: datasourceId,
            name: 'sample.csv',
            sourceType: 'file',
            metadata: {
              vocalist: 'ozzy',
            },
          }),
          headers: expect.any(Object),
        })

        expect(fetchMock.mock.calls[1][0]).toEqual('https://mocked.url/upload')
        expect(fetchMock.mock.calls[1][1]).toEqual({
          method: 'PUT',
          body: expect.any(Buffer),
          headers: expect.any(Object),
        })
      })
    })

    describe('getDataEntity()', () => {
      it('should error without id', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        await expect(async () => await metal.getDataEntity('')).rejects.toThrowError('id required')
      })

      it('should fetch data entity correctly', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleEntityID'
        const mockEntity = {
          name: 'Sample Data Entity',
          description: 'Sample description',
          // Add other mock fields as necessary
        }

        fetchMock.mockImplementationOnce(getMockRes(mockEntity))

        const response = await metal.getDataEntity(id)

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/data-entities/${id}`, {
          method: 'GET',
          headers: HEADERS,
        })

        expect(response).toEqual(mockEntity)
      })

      it('should handle error and reject', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleEntityID'

        fetchMock.mockImplementationOnce(getMockRes({ message: 'Entity not found' }, false, 404))

        await metal
          .getDataEntity(id)
          .then(() => {
            throw new Error('should not resolve')
          })
          .catch((err) => {
            expect(err.message).toBe('Error status code: 404.')
          })

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/data-entities/${id}`, {
          method: 'GET',
          headers: HEADERS,
        })
      })
    })

    describe('deleteDataEntity()', () => {
      it('should error without id', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        await expect(() => metal.deleteDataEntity('') as any).rejects.toThrowError('id required')
      })

      it('should delete data entity correctly', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleEntityID'

        fetchMock.mockImplementationOnce(
          jest.fn().mockReturnValue({
            ok: true,
            status: 200,
            json: async () => await Promise.resolve({}),
          })
        )

        await metal.deleteDataEntity(id)

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/data-entities/${id}`, {
          method: 'DELETE',
          headers: HEADERS,
        })
      })

      it('should handle error when deleting', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const id = 'sampleEntityID'

        fetchMock.mockImplementationOnce(
          jest.fn().mockReturnValue({
            ok: false,
            status: 404,
            statusText: 'Entity not found',
            json: async () => await Promise.resolve({}),
          })
        )

        await expect(async () => {
          await metal.deleteDataEntity(id)
        }).rejects.toThrowError('Error deleting data entity: Entity not found')

        expect(fetchMock).toHaveBeenCalledWith(`https://api.getmetal.io/v1/data-entities/${id}`, {
          method: 'DELETE',
          headers: HEADERS,
        })
      })
    })

    describe('getAllDataEntities()', () => {
      it('should error without datasourceId', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        await expect(async () => await metal.getAllDataEntities('')).rejects.toThrowError(
          'id required'
        )
      })

      it('should fetch data entities without pagination', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const datasourceId = 'sampleDatasourceID'

        fetchMock.mockImplementationOnce(
          jest.fn().mockReturnValue({
            ok: true,
            status: 200,
            json: async () => await Promise.resolve({ data: [] }),
          })
        )

        await metal.getAllDataEntities(datasourceId)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/datasources/${datasourceId}/data-entities?`,
          {
            method: 'GET',
            headers: HEADERS,
          }
        )
      })

      it('should fetch data entities with pagination', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const datasourceId = 'sampleDatasourceID'

        fetchMock.mockImplementationOnce(
          jest.fn().mockReturnValue({
            ok: true,
            status: 200,
            json: async () => await Promise.resolve({ data: [] }),
          })
        )

        await metal.getAllDataEntities(datasourceId, 10, 2)

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/datasources/${datasourceId}/data-entities?limit=10&page=2`,
          {
            method: 'GET',
            headers: HEADERS,
          }
        )
      })

      it('should handle fetch error', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const datasourceId = 'sampleDatasourceID'

        fetchMock.mockImplementationOnce(
          jest.fn().mockReturnValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            json: async () => await Promise.resolve({ message: 'Invalid query parameters' }),
          })
        )

        await expect(
          async () => await metal.getAllDataEntities(datasourceId, 0, -1)
        ).rejects.toThrowError('Error status code: 400. Invalid query parameters')

        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/datasources/${datasourceId}/data-entities?limit=0&page=-1`,
          {
            method: 'GET',
            headers: HEADERS,
          }
        )
      })
    })

    describe('addIndex()', () => {
      it('should add an index with payload', async () => {
        const mockIndexName = 'test_index'
        const mockDatasource = 'test_datasource'
        const mockModel = 'test_model'
        const mockFilters = [{ field: 'test_field', operator: 'equals', value: 'test_value' }]

        const payload = {
          model: mockModel,
          datasource: mockDatasource,
          name: mockIndexName,
          filters: mockFilters,
        }

        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock.mockResolvedValueOnce(
          new Response('', {
            status: 201,
          })
        )

        await metal.addIndex(payload)

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0][0]).toBe('https://api.getmetal.io/v1/indexes')
        expect(fetchMock.mock.calls[0][1]).toEqual({
          method: 'POST',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })
    })

    describe('updateIndex()', () => {
      it('should update an index with payload', async () => {
        const mockIndexId = 'test_index_id'

        const payload = {
          status: 'DEACTIVATING' as 'DEACTIVATING',
        }

        const metal = new Metal(API_KEY, CLIENT_ID)

        fetchMock.mockResolvedValueOnce(
          new Response('', {
            status: 200,
          })
        )

        await metal.updateIndex(mockIndexId, payload)

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0][0]).toBe('https://api.getmetal.io/v1/indexes/test_index_id')
        expect(fetchMock.mock.calls[0][1]).toEqual({
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: HEADERS,
        })
      })
    })

    describe('getQueries()', () => {
      it('should get queries for the provided indexId', async () => {
        const metal = new Metal(API_KEY, CLIENT_ID)
        const mockData = {
          data: [
            {
              t: '2023-08-30T11:34:35.128Z',
              d: 0.176956892014,
              q: 'Who is the best drummer of all time?',
            },
            {
              t: '2023-08-29T11:34:18.099Z',
              d: 0.156819581985,
              q: 'Which band is represented by the iconic mascot Eddie?',
            },
          ],
        }

        fetchMock.mockImplementationOnce(getMockRes(mockData))

        const response = await metal.getQueries('index-id')
        expect(response).toEqual(mockData)
        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.getmetal.io/v1/indexes/index-id/queries`,
          {
            headers: HEADERS,
          }
        )
      })
    })

    describe('addApp()', () => {
      it('should add an app with payload', async () => {
          const mockAppName = 'test_app';

          const payload = {
              name: mockAppName,
          };

          const metal = new Metal(API_KEY, CLIENT_ID);

          fetchMock.mockResolvedValueOnce(
              new Response('', {
                  status: 201,
              })
          );

          await metal.addApp(payload);

          expect(fetchMock).toHaveBeenCalledTimes(1);
          expect(fetchMock.mock.calls[0][0]).toBe('https://api.getmetal.io/v1/apps');
          expect(fetchMock.mock.calls[0][1]).toEqual({
              method: 'POST',
              body: JSON.stringify(payload),
              headers: {
                  'Content-Type': 'application/json',
                  'x-metal-api-key': API_KEY,
                  'x-metal-client-id': CLIENT_ID,
              },
          });
      });
  });

  describe('getAllApps()', () => {
    it('should fetch all apps', async () => {
        const mockAppsResponse = [
            { id: 'app1', name: 'App 1' },
            { id: 'app2', name: 'App 2' },
        ];

        const metal = new Metal(API_KEY, CLIENT_ID);

        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify(mockAppsResponse), {
                status: 200,
            })
        );

        const apps = await metal.getAllApps();

        expect(apps).toEqual(mockAppsResponse);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe('https://api.getmetal.io/v1/apps');
        expect(fetchMock.mock.calls[0][1]).toEqual({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-metal-api-key': API_KEY,
                'x-metal-client-id': CLIENT_ID,
            },
        });
    });
});

  describe('getApp()', () => {
    it('should fetch a single app by its ID', async () => {
        const mockAppId = 'a'.repeat(24); // Mock app ID of length 24
        const mockAppResponse = {
            data: {
                id: mockAppId,
                name: 'Mock App',
            },
        };

        const metal = new Metal(API_KEY, CLIENT_ID);

        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify(mockAppResponse), {
                status: 200,
            })
        );

        const app = await metal.getApp(mockAppId);

        expect(app).toEqual(mockAppResponse.data);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe(`https://api.getmetal.io/v1/apps/${mockAppId}`);
        expect(fetchMock.mock.calls[0][1]).toEqual({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-metal-api-key': API_KEY,
                'x-metal-client-id': CLIENT_ID,
            },
        });
    });

    it('should throw an error if app ID is not 24 characters long', async () => {
        const invalidAppId = 'shortId';

        const metal = new Metal(API_KEY, CLIENT_ID);

        await expect(metal.getApp(invalidAppId)).rejects.toThrow('App ID must have a length of 24 characters');
    });
  });



  })
})
