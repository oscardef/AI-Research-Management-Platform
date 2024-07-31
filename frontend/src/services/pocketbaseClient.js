import PocketBase from 'pocketbase';

/**
 * Initializes a PocketBase client instance for interacting with the PocketBase API.
 * The client is configured to connect to the local PocketBase server.
 * 
 * @constant {PocketBase} pb - The PocketBase client instance.
 */
const pb = new PocketBase('http://127.0.0.1:8090');

export { pb };
