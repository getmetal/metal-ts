import axios from 'axios'
import Motorhead from '../src/motorhead'
import { Memory } from '../src/types'

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
    const BASE_URL = 'https://google.com'
    const motorhead = new Motorhead({ baseUrl: BASE_URL })
    expect(motorhead.baseUrl).toBe(BASE_URL)
  })

  it('should error without apiKey for managed', async () => {
    const motorhead = new Motorhead({ clientId: CLIENT_ID })
    await expect(motorhead).rejects.toThrowError(
      'apiKey and clientId required for managed motorhead'
    )
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
        AXIOS_OPTS
      )
    })
  })
})
