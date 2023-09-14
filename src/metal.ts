import mime from 'mime-types'
import { API_URL, SUPPORTED_FILE_TYPES } from './constants'
import { sanitizeFilename } from './helpers'
import { request } from './request'
import {
  type Client,
  type IndexInput,
  type IndexPayload,
  type BulkIndexItemInput,
  type BulkIndexPayload,
  type SearchInput,
  type SearchPayload,
  type TuningInput,
  type TuningPayload,
  type CreateResourcePayload,
  type FilePayload,
  type UploadFileToUrlPayload,
  type UploadFilePayload,
  type CreateFileResouceResponse,
} from './types'

export class Metal implements Client {
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

    const data = await request(`${API_URL}/v1/index`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async indexMany(payload: BulkIndexItemInput[]): Promise<object> {
    for (const item of payload) {
      if (!item.index) {
        item.index = this.indexId
      }
    }

    const body: BulkIndexPayload = { data: payload }

    const data = await request(`${API_URL}/v1/index/bulk`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async search(payload: SearchInput = {}): Promise<object[]> {
    const index = payload.indexId ?? this.indexId
    if (!index) {
      throw new Error('indexId required')
    }

    const { imageBase64, imageUrl, text, filters } = payload

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

    const data = await request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
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

    const data = await request(`${API_URL}/v1/tune`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async getOne(id: string, indexId?: string): Promise<object> {
    const index = indexId ?? (this.indexId as string)

    if (!id) {
      throw new Error('id required')
    }

    if (!index) {
      throw new Error('indexId required')
    }

    const data = await request(`${API_URL}/v1/indexes/${index}/documents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async getMany(ids: string[], indexId?: string): Promise<object> {
    const index = indexId ?? (this.indexId as string)

    if (ids?.length > 100 || ids?.length < 1) {
      throw new Error('ids should be between 1 and 100')
    }

    if (!index) {
      throw new Error('indexId required')
    }

    const data = await request(`${API_URL}/v1/indexes/${index}/documents/${ids.join(',')}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async deleteOne(id: string, indexId?: string): Promise<object> {
    const index = indexId ?? (this.indexId as string)

    if (!id) {
      throw new Error('id required')
    }

    if (!index) {
      throw new Error('indexId required')
    }

    const data = await request(`${API_URL}/v1/indexes/${index}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  async deleteMany(ids: string[], indexId?: string): Promise<object> {
    const index = indexId ?? (this.indexId as string)
    if (!index) {
      throw new Error('indexId required')
    }

    if (!ids?.length) {
      throw new Error('ids required')
    }

    const data = await request(`${API_URL}/v1/indexes/${index}/documents/bulk`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    })

    return data
  }

  private async createResource(payload: CreateResourcePayload): Promise<CreateFileResouceResponse> {
    const { indexId, fileName, fileType, fileSize } = payload

    const url = `${API_URL}/v1/indexes/${indexId}/files`
    const body: FilePayload = {
      fileName: sanitizeFilename(fileName),
      fileType,
    }
    const headers = {
      'Content-Type': 'application/json',
      'x-metal-file-size': fileSize.toString(),
      'x-metal-api-key': this.apiKey,
      'x-metal-client-id': this.clientId,
    }

    const data = await request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })

    return data
  }

  private async uploadFileToUrl(payload: UploadFileToUrlPayload): Promise<object> {
    const { url, file, fileType, fileSize } = payload

    const headers = {
      'content-type': fileType,
      'content-length': fileSize.toString(),
    }

    const data = await request(url, {
      method: 'PUT',
      body: file,
      headers,
    })

    return data
  }

  async uploadFile(file: UploadFilePayload, indexId?: string): Promise<object> {
    const index = indexId ?? (this.indexId as string)
    if (!index) {
      throw new Error('indexId required')
    }

    let fileType: string
    let fileSize: number
    let fileName: string
    let fileData: File | Buffer

    if (typeof file === 'string') {
      const fs = await import('fs')
      const path = await import('path')
      fileType = mime.lookup(file) || ''
      fileSize = fs.statSync(file).size
      fileName = path.basename(file)
      fileData = fs.readFileSync(file)
    } else {
      fileType = file.type || ''
      fileSize = file.size
      fileName = file.name
      fileData = file
    }

    if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
      throw new Error('Invalid file type. Supported types are: pdf, docx, csv.')
    }

    const resource = await this.createResource({ indexId: index, fileName, fileType, fileSize })

    return await this.uploadFileToUrl({ url: resource.url, file: fileData, fileType, fileSize })
  }
}

export default Metal
