import axios from 'axios'
import { API_URL } from './constants'
import {
  type Client,
  type IndexInput,
  type IndexPayload,
  type BulkIndexPayload,
  type SearchInput,
  type SearchPayload,
  type TuningInput,
  type TuningPayload,
} from './types'

class Metal implements Client {
  apiKey: string
  indexId?: string
  clientId: string

  constructor(apiKey: string, clientId: string, indexId?: string) {
    this.apiKey = apiKey
    this.indexId = indexId
    this.clientId = clientId
  }

  async index(payload: IndexInput): Promise<object> {
    const index = payload.indexId ?? this.indexId
    if (!index) {
      throw new Error('indexId required')
    }

    const { imageBase64, imageUrl, text, embedding } = payload
    if (!imageBase64 && !imageUrl && !text && !embedding) {
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

    return data?.data ?? data
  }

  async indexMany(payload: IndexPayload[]): Promise<object> {
    const body: BulkIndexPayload = { data: payload }

    const { data } = await axios.post(`${API_URL}/v1/index/bulk`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data?.data ?? data
  }

  async search(payload: SearchInput): Promise<object[]> {
    const index = payload.indexId ?? this.indexId
    if (!index) {
      throw new Error('indexId required')
    }

    const { imageBase64, imageUrl, text, filters } = payload
    if (!imageBase64 && !imageUrl && !text) {
      throw new Error('payload required')
    }

    const body: SearchPayload = { index, filters }
    if (imageBase64) {
      body.imageBase64 = imageBase64
    } else if (imageUrl) {
      body.imageUrl = imageUrl
    } else if (text) {
      body.text = text
    }

    const limit = payload.limit ?? 10
    let url = `${API_URL}/v1/search?limit=${limit}`

    if (payload.idsOnly) {
      url += '&idsOnly=true'
    }

    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data?.data ?? data
  }

  async tune(payload: TuningInput): Promise<object> {
    const index = payload.indexId ?? this.indexId
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

    return data?.data ?? data
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

    return data?.data ?? data
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

    return data?.data ?? data
  }

  async deleteMany(ids: string[]): Promise<object> {
    if (!ids?.length) {
      throw new Error('ids required')
    }

    const { data } = await axios.delete(`${API_URL}/v1/documents/bulk`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
      data: { ids },
    })

    return data?.data ?? data
  }
}

export default Metal
