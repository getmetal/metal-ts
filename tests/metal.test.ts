const { default: axios } = require('axios');
import MetalSDK from '../src/metal';

jest.mock('axios');

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
      const base_64 = 'base64';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      axios.post = jest.fn(() => Promise.resolve({ data: null }));

      const result = await metal.index({ imageBase64: base_64 });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.getmetal.io/v1/index',
        {
          imageBase64: base_64,
          app: appId,
        },
        AXIOS_OPTS
      );
    });

    it('should send imageUrl payload', async () => {
      const appId = 'app-id';
      const imageUrl = 'image.png';
      const metal = new MetalSDK(API_KEY, CLIENT_ID, appId);

      axios.post = jest.fn(() => Promise.resolve({ data: null }));

      const result = await metal.index({ imageUrl });

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

      axios.post = jest.fn(() => Promise.resolve({ data: null }));

      const result = await metal.index({ text });

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

      axios.post = jest.fn(() => Promise.resolve({ data: null }));

      const result = await metal.index({ embedding });

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
  });
});
