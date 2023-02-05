import axios from 'axios';

const API_URL: string = 'https://api.getmetal.io';

export function index(input: string, appId: string): Promise<object> {
  return axios.post(
    `${API_URL}/v1/index`,
    { input, app: appId },
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export function search(input: string, appId: string): Promise<object> {
  return axios.post(
    `${API_URL}/v1/search`,
    { input, app: appId },
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export default { index, search };
