import { Motorhead } from '../src/index'
import { type Memory } from '../src/types'


const fetchMock = jest.spyOn(global, 'fetch')

const getMockRes = (data: any) => async (): Promise<Response> => {
  return await Promise.resolve({
    json: async () => await Promise.resolve({ data }),
  }) as Response;
}

const API_KEY = 'api-key'
const CLIENT_ID = 'client-id'
const BASE_URL = 'https://google.com'

const HEADERS_MANAGED = {
  'Content-Type': 'application/json',
  'x-metal-api-key': API_KEY,
  'x-metal-client-id': CLIENT_ID,
}

const HEADERS_NON_MANAGED = {
  'Content-Type': 'application/json',
}

describe('Motorhead', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('should be defined', () => {
    expect(Motorhead).toBeDefined()
  })

  it('should instantiate (managed)', () => {
    const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })
    expect(motorhead.apiKey).toBe(API_KEY)
    expect(motorhead.clientId).toBe(CLIENT_ID)
  })

  it('should instantiate (non-managed)', () => {
    const motorhead = new Motorhead({ baseUrl: BASE_URL })
    expect(motorhead.baseUrl).toBe(BASE_URL)
  })

  it('should error without apiKey for managed', async () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Motorhead({ clientId: CLIENT_ID })
    }).toThrowError('apiKey and clientId required for managed motorhead')
  })

  it('should error without clientId for managed', async () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Motorhead({ apiKey: API_KEY })
    }).toThrowError('apiKey and clientId required for managed motorhead')
  })

  describe('addMemory()', () => {
    it('should send payload for managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })

      fetchMock.mockImplementationOnce(getMockRes(null))

      await motorhead.addMemory(MOCK_SESSION, MOCK_PAYLOAD)

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        {
          method: 'POST',
          headers: HEADERS_MANAGED,
          body: JSON.stringify(MOCK_PAYLOAD),
        }
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      fetchMock.mockImplementationOnce(getMockRes(null))

      await motorhead.addMemory(MOCK_SESSION, MOCK_PAYLOAD)

      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/sessions/${MOCK_SESSION}/memory`, {
        method: 'POST',
        headers: HEADERS_NON_MANAGED,
        body: JSON.stringify(MOCK_PAYLOAD),
      })
    })
  })

  describe('getMemory()', () => {
    it('should send payload for managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })

      fetchMock.mockImplementationOnce(getMockRes(MOCK_PAYLOAD))

      const res = await motorhead.getMemory(MOCK_SESSION)

      expect(res).toEqual(MOCK_PAYLOAD)
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        {
          headers: HEADERS_MANAGED,
        }
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      fetchMock.mockImplementationOnce(getMockRes(MOCK_PAYLOAD))

      const res = await motorhead.getMemory(MOCK_SESSION)

      expect(res).toEqual(MOCK_PAYLOAD)
      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/sessions/${MOCK_SESSION}/memory`, {
        headers: HEADERS_NON_MANAGED,
      })
    })
  })

  describe('deleteMemory()', () => {
    it('should send payload for managed', async () => {
      const MOCK_SESSION = 'session-id'
      const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })

      fetchMock.mockImplementationOnce(getMockRes(null))

      await motorhead.deleteMemory(MOCK_SESSION)

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        {
          method: 'DELETE',
          headers: HEADERS_MANAGED,
        }
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      fetchMock.mockImplementationOnce(getMockRes(null))

      await motorhead.deleteMemory(MOCK_SESSION)

      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/sessions/${MOCK_SESSION}/memory`, {
        method: 'DELETE',
        headers: HEADERS_NON_MANAGED,
      })
    })
  })
})
