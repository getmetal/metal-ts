import axios from 'axios';

const API_URL: string = 'https://api.getmetal.io';


class MetalSDK {
  appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  index(input: string): Promise<object> {
    return axios.post(
      `${API_URL}/v1/index`,
      { input, app: this.appId },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  search(input: String): Promise<object> {
    return axios.post(
      `${API_URL}/v1/search`,
      { input, app: this.appId },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default MetalSDK;
