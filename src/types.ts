export interface IndexPayload {
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
  embedding?: Array<number>;
}

export interface SearchPayload {
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
  embedding?: Array<number>;
}

export interface TuningPayload {
  idA: string;
  idB: string;
  result: '-1' | '1';
}
