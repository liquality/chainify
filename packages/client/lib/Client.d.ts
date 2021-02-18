export default class Client {
    static debug(namespace?: string): void;
    /**
     * Client
     * @param {Provider} [provider] - Data source/provider for the instance
     * @param {string} [version] - Minimum blockchain node version to support
     */
    constructor(provider: any, version: any);
    /**
     * Add a provider
     * @param {!Provider} provider - The provider instance or RPC connection string
     * @return {Client} Returns instance of Client
     * @throws {InvalidProviderError} When invalid provider is provider
     * @throws {DuplicateProviderError} When same provider is added again
     */
    addProvider(provider: any): this;
    /**
     * Check the availability of a method.
     * @param {!string} method - Name of the method to look for in the provider stack
     * @param {boolean|object} [requestor=false] - If provided, it returns providers only
     *  above the requestor in the stack.
     * @return {Provider} Returns a provider instance associated with the requested method
     * @throws {NoProviderError} When no provider is available in the stack.
     * @throws {UnimplementedMethodError} When the requested method is not provided
     *  by any provider above requestor in the provider stack
     * @throws {UnsupportedMethodError} When requested method is not supported by
     *  version specified
     */
    getProviderForMethod(method: any, requestor?: boolean): any;
    /**
     * Helper method that returns method from a provider.
     * @param {!string} method - Name of the method to look for in the provider stack
     * @param {object} [requestor] - If provided, it returns method from providers only
     *  above the requestor in the stack.
     * @return {function} Returns method from provider instance associated with the requested method
     */
    getMethod(method: any, requestor: any): any;
    assertValidTransaction(transaction: any): void;
    assertValidBlock(block: any): void;
    get chain(): any;
    get wallet(): any;
    get swap(): any;
}
