import axios from 'axios'
import { Motorhead } from '../src/index'
import { type Memory } from '../src/types'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const API_KEY = 'api-key'
const CLIENT_ID = 'client-id'
const BASE_URL = 'https://google.com'

const AXIOS_MANAGED_OPTS = {
  headers: {
    'Content-Type': 'application/json',
    'x-metal-api-key': API_KEY,
    'x-metal-client-id': CLIENT_ID,
  },
}

const AXIOS_NON_MANAGED_OPTS = {
  headers: {
    'Content-Type': 'application/json',
  },
}

describe('Motorhead', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear()
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

      mockedAxios.post.mockResolvedValue({ data: null })

      await motorhead.addMemory(MOCK_SESSION, MOCK_PAYLOAD)

      expect(axios.post).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        MOCK_PAYLOAD,
        AXIOS_MANAGED_OPTS
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      mockedAxios.post.mockResolvedValue({ data: null })

      await motorhead.addMemory(MOCK_SESSION, MOCK_PAYLOAD)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/sessions/${MOCK_SESSION}/memory`,
        MOCK_PAYLOAD,
        AXIOS_NON_MANAGED_OPTS
      )
    })
  })

  describe('getMemory()', () => {
    it('should send payload for managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })

      mockedAxios.get.mockResolvedValue({ data: MOCK_PAYLOAD })

      const res = await motorhead.getMemory(MOCK_SESSION)

      expect(res).toEqual(MOCK_PAYLOAD)
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        AXIOS_MANAGED_OPTS
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const MOCK_PAYLOAD: Memory = { messages: [{ role: 'AI', content: 'hey' }] }
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      mockedAxios.get.mockResolvedValue({ data: MOCK_PAYLOAD })

      const res = await motorhead.getMemory(MOCK_SESSION)

      expect(res).toEqual(MOCK_PAYLOAD)
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/sessions/${MOCK_SESSION}/memory`,
        AXIOS_NON_MANAGED_OPTS
      )
    })
  })

  describe('deleteMemory()', () => {
    it('should send payload for managed', async () => {
      const MOCK_SESSION = 'session-id'
      const motorhead = new Motorhead({ apiKey: API_KEY, clientId: CLIENT_ID })

      mockedAxios.delete.mockResolvedValue({ data: null })

      await motorhead.deleteMemory(MOCK_SESSION)

      expect(axios.delete).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/motorhead/sessions/${MOCK_SESSION}/memory`,
        AXIOS_MANAGED_OPTS
      )
    })

    it('should send payload for non-managed', async () => {
      const MOCK_SESSION = 'session-id'
      const motorhead = new Motorhead({ baseUrl: BASE_URL })

      mockedAxios.delete.mockResolvedValue({ data: null })

      await motorhead.deleteMemory(MOCK_SESSION)

      expect(axios.delete).toHaveBeenCalledWith(
        `${BASE_URL}/sessions/${MOCK_SESSION}/memory`,
        AXIOS_NON_MANAGED_OPTS
      )
    })
  })
})
