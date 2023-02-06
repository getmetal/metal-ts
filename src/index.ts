import axios from 'axios';

const API_URL: string = 'https://api.getmetal.io';


class MetalSDK {
  apiKey: string;
  clientId: string;
  appId?: string;

  constructor(apiKey: string, clientId: string, appId?: string) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.appId = appId;
  }
  

  index(input: string, appId?: string): Promise<object> {
    const app = appId || this.appId;
    if (!app) {
      throw new Error('appId required');
    }

    return axios.post(
      `${API_URL}/v1/index`,
      { input, app },
      { headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      } }
    );
  }

  search(input: string, appId?: string): Promise<object> {
    const app = appId || this.appId;
    if (!app) {
      throw new Error('appId required');
    }
    return axios.post(
      `${API_URL}/v1/search`,
      { input, app },
      { headers: {
        'Content-Type': 'application/json',
        'x-metal-api-key': this.apiKey,
        'x-metal-client-id': this.clientId,
      } }
    );
  }
}

export default MetalSDK;
