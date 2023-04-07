export interface IndexInput {
  id?: string
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
}

export interface IndexPayload extends IndexInput {
  app: string
}

export interface SearchInput {
  imageBase64?: string
  imageUrl?: string
  text?: string
  embedding?: number[]
}

export interface SearchPayload extends SearchInput {
  app: string
}

export interface TuningInput {
  idA: string
  idB: string
  label: -1 | 0 | 1
}

export interface TuningPayload extends TuningInput {
  app: string
}
