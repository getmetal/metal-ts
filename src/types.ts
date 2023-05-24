
// Motorhead Client


export interface MotorheadClient {
  addMemory: (sessionId: string, payload: Memory) => Promise<Memory>
  getMemory: (sessionId: string) => Promise<Memory>
  deleteMemory: (sessionId: string) => Promise<void>
}

export interface MotorheadConfig {
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
}

export interface Memory {
  messages: {
    content: string;
    role: 'Human' | 'AI',
  }[]
  context?: string
}


// Metal Client
export interface Client {
  index: (payload: IndexInput) => Promise<object>
  search: (payload: SearchInput) => Promise<object[]>
  tune: (payload: TuningInput) => Promise<object>
  getOne: (id: string) => Promise<object>
  deleteOne: (id: string) => Promise<object>
}

export interface IndexInput {
  indexId?: string
  id?: string
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
  metadata?: object
}

export interface IndexPayload {
  index: string
  id?: string
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
  metadata?: object
}

export interface BulkIndexPayload {
  data: IndexPayload[]
}

export interface Filter {
  field: string
  value: string | number
}

export interface SearchInput {
  indexId?: string
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
  filters?: Filter[]
  idsOnly?: boolean
  limit?: number
}

export interface SearchPayload {
  index: string
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
  filters?: Filter[]
}

export interface TuningInput {
  indexId?: string
  idA: string
  idB: string
  label: -1 | 0 | 1
}

export interface TuningPayload {
  index: string
  idA: string
  idB: string
  label: -1 | 0 | 1
}
