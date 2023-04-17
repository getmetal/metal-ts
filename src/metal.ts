import axios from 'axios'
import { API_URL } from './constants'
import {
  type IndexInput,
  type IndexPayload,
  type SearchInput,
  type SearchPayload,
  type TuningInput,
  type TuningPayload,
} from './types'

class MetalSDK {
  apiKey: string
  indexId?: string
  clientId: string

  constructor(apiKey: string, clientId: string, indexId?: string) {
    this.apiKey = apiKey
    this.indexId = indexId
    this.clientId = clientId
  }

  async index(payload: IndexInput, indexId?: string): Promise<object> {
    const index = indexId ?? this.indexId
    if (!index) {
      throw new Error('indexId required')
    }

    const { imageBase64, imageUrl, text, embedding } = payload
    if (!imageBase64 && !imageUrl && !text && embedding == null) {
      throw new Error('payload required')
    }

    const body: IndexPayload = { index }
    if (payload?.id) {
      body.id = payload.id
    }

    if (payload?.metadata) {
      body.metadata = payload.metadata
    }

    if (imageBase64) {
      body.imageBase64 = imageBase64
    } else if (imageUrl) {
      body.imageUrl = imageUrl
    } else if (text) {
      body.text = text
    } else if (embedding != null) {
      body.embedding = embedding
    }

    const { data } = await axios.post(`${API_URL}/v1/index`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async search(
    payload: SearchInput,
    indexId?: string,
    idsOnly?: boolean,
    limit: number = 1
  ): Promise<object[]> {
    const index = indexId ?? this.indexId

    if (!index) {
      throw new Error('indexId required')
    }

    const { imageBase64, imageUrl, text } = payload
    if (!imageBase64 && !imageUrl && !text) {
      throw new Error('payload required')
    }

    const body: SearchPayload = { index }
    if (imageBase64) {
      body.imageBase64 = imageBase64
    } else if (imageUrl) {
      body.imageUrl = imageUrl
    } else if (text) {
      body.text = text
    }

    let url = `${API_URL}/v1/search?limit=${limit}`

    if (idsOnly) {
      url += '&idsOnly=true'
    }

    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async tune(payload: TuningInput, indexId?: string): Promise<object> {
    const index = indexId ?? this.indexId
    if (!index) {
      throw new Error('indexId required')
    }

    if (!payload.idA || !payload.idB || Number.isNaN(payload.label)) {
      throw new Error('idA, idB, & label required for payload')
    }

    const body: TuningPayload = { index, ...payload }

    const { data } = await axios.post(`${API_URL}/v1/tune`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async getOne(id: string): Promise<object> {
    if (!id) {
      throw new Error('id required')
    }

    const { data } = await axios.get(`${API_URL}/v1/documents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async deleteOne(id: string): Promise<object> {
    if (!id) {
      throw new Error('id required')
    }

    const { data } = await axios.delete(`${API_URL}/v1/documents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }
}

export default MetalSDK
