declare class MetalSDK {
    apiKey: string;
    clientId: string;
    appId?: string;
    constructor(apiKey: string, clientId: string, appId?: string);
    index(input: string, appId?: string): Promise<object>;
    search(input: string, appId?: string): Promise<object>;
}
export default MetalSDK;
//# sourceMappingURL=index.d.ts.map