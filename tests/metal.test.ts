import MetalSDK from '../src/metal';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_KEY = 'api-key';
const CLIENT_ID = 'client-id';

const AXIOS_OPTS = {
  headers: {
    'Content-Type': 'application/json',
    'x-metal-api-key': API_KEY,
    'x-metal-client-id': CLIENT_ID,
  },
};

describe('MetalSDK', () => {
  it('should be defined', () => {
    expect(MetalSDK).toBeDefined();
  });

  it('should instantiate properly', () => {
    const appId = 'app-id';

    const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

    expect(metal.apiKey).toBe(API_KEY);
    expect(metal.appId).toBe(appId);
    expect(metal.clientId).toBe(CLIENT_ID);
  });

  describe('index()', () => {
    it('should error without appId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID);
      const result = metal.index({});
      await expect(result).rejects.toThrowError('appId required');
    });

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'app-id');
      const result = metal.index({});
      await expect(result).rejects.toThrowError('payload required');
    });

    it('should send imageBase64 payload', async () => {
      const appId = 'app-id';
      const base64 = 'base64';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.index({ imageBase64: base64 });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          imageBase64: base64,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send imageUrl payload', async () => {
      const appId = 'app-id';
      const imageUrl = 'image.png';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.index({ imageUrl });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          imageUrl,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send text payload', async () => {
      const appId = 'app-id';
      const text = 'text-to-index';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.index({ text });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          text,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send embedding payload', async () => {
      const appId = 'app-id';
      const embedding = [1, 2, 3];
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.index({ embedding });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          embedding,
          app: appId,
        },
        AXIOS_OPTS
      );
    });
  });

  describe('search()', () => {
    it('should error without appId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID);
      const result = metal.search({});
      await expect(result).rejects.toThrowError('appId required');
    });

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'app-id');
      const result = metal.search({});
      await expect(result).rejects.toThrowError('payload required');
    });

    it('should send imageBase64 payload', async () => {
      const appId = 'app-id';
      const base64 = 'base64';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.search({ imageBase64: base64 });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=1',
        {
          imageBase64: base64,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send imageUrl payload', async () => {
      const appId = 'app-id';
      const imageUrl = 'image.png';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.search({ imageUrl });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=1',
        {
          imageUrl,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send text payload', async () => {
      const appId = 'app-id';
      const text = 'text-to-search';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.search({ text });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=1',
        {
          text,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should add idsOnly=true querystring', async () => {
      const appId = 'app-id';
      const text = 'text-to-search';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      await metal.search({ text }, undefined, true, 10);

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/search?limit=10&idsOnly=true',
        {
          text,
          app: appId,
        },
        AXIOS_OPTS
      );
    });
  });

  describe('tune()', () => {
    it('should error without appId', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID);
      const result = metal.tune({ idA: 'a', idB: 'b', label: 1 });
      await expect(result).rejects.toThrowError('appId required');
    });

    it('should error without payload', async () => {
      const metal = new MetalSDK(API_KEY, CLIENT_ID, 'app-id');
      // @ts-expect-error testing
      const result = metal.tune({});
      await expect(result).rejects.toThrowError('idA, idB, & label required for payload');
    });

    it('should send with payload', async () => {
      const appId = 'app-id';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      mockedAxios.post.mockResolvedValue({ data: null });

      const idA = 'id-a';
      const idB = 'id-b';
      const label = 1;

      await metal.tune({ idA, idB, label });

      expect(axios.post).toHaveBeenCalledWith(
        `https://api.getmetal.io/v1/tune`,
        {
          app: appId,
          idA,
          idB,
          label,
        },
        AXIOS_OPTS
      );
    });
  });
});
