import axios from 'axios';
import { API_URL } from './constants';
import { IndexPayload, SearchPayload, TuningPayload } from './types';

class MetalSDK {
  apiKey: string;
  appId?: string;
  clientId: string;

  constructor(apiKey: string, clientId: string, appId?: string) {
    this.apiKey = apiKey;
    this.appId = appId;
    this.clientId = clientId;
  }

  async index(payload: IndexPayload, appId?: string): Promise<object> {
    const app = appId || this.appId;
    if (!app) {
      throw new Error('appId required');
    }

    const { imageBase64, imageUrl, text, embedding } = payload;
    if (!imageBase64 && !imageUrl && !text && !embedding) {
      throw new Error('payload required');
    }

    const body = { app } as IndexPayload;
    if (imageBase64) {
      body.imageBase64 = imageBase64;
    } else if (imageUrl) {
      body.imageUrl = imageUrl;
    } else if (text) {
      body.text = text;
    } else if (embedding) {
      body.embedding = embedding;
    }

    const { data } = await axios.post(`${API_URL}/v1/index`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    });

    return data;
  }

  async search(payload: SearchPayload, appId?: string): Promise<object[]> {
    const app = appId || this.appId;
    if (!app) {
      throw new Error('appId required');
    }

    const { imageBase64, imageUrl, text } = payload;
    if (!imageBase64 && !imageUrl && !text) {
      throw new Error('payload required');
    }

    const body = { app } as SearchPayload;
    if (imageBase64) {
      body.imageBase64 = imageBase64;
    } else if (imageUrl) {
      body.imageUrl = imageUrl;
    } else if (text) {
      body.text = text;
    }

    const { data } = await axios.post(`${API_URL}/v1/search`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      },
    });

    return data;
  }

  async tune(payload: TuningPayload, appId?: string): Promise<object> {
    const app = appId || this.appId;
    if (!app) {
      throw new Error('appId required');
    }

    if (!payload.idA || !payload.idB || !payload.label) {
      throw new Error('idA, idB, & label required for payload');
    }

    const { data } = await axios.post(
      `${API_URL}/v1/apps/${app}/tunings`,
      { ...payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-metal-api-key': this.apiKey,
          'x-metal-client-id': this.clientId,
        },
      }
    );

    return data;
  }
}

export default MetalSDK;