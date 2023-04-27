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
