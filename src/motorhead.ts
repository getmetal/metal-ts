import axios from 'axios'
import { API_URL } from './constants'
import { type MotorheadClient, type MotorheadConfig, type Memory } from './types'

const MANAGED_BASE_URL = `${API_URL}/v1/motorhead`

export class Motorhead implements MotorheadClient {
  apiKey?: string
  clientId?: string
  baseUrl: string

  constructor({ apiKey, clientId, baseUrl = MANAGED_BASE_URL }: MotorheadConfig) {
    const isManaged = baseUrl === MANAGED_BASE_URL
    if (isManaged && (!apiKey || !clientId)) {
      throw new Error('apiKey and clientId required for managed motorhead')
    }

    this.apiKey = apiKey
    this.clientId = clientId
    this.baseUrl = baseUrl
  }

  async addMemory(sessionId: string, payload: Memory): Promise<Memory> {
    const { data } = await axios.post(`${this.baseUrl}/sessions/${sessionId}/memory`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    const memory: Memory = data?.data ?? data
    return memory
  }

  async getMemory(sessionId: string): Promise<Memory> {
    const { data } = await axios.get(`${this.baseUrl}/sessions/${sessionId}/memory`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    const memory: Memory = data?.data ?? data
    return memory
  }

  async deleteMemory(sessionId: string): Promise<void> {
    const { data } = await axios.delete(`${this.baseUrl}/sessions/${sessionId}/memory`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data?.data ?? data
  }
}

export default Motorhead;
