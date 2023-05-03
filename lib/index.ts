import 'reflect-metadata';
import { Server } from './class';
import { ServerConfig } from './type';

export * from "./decorators";
export * from "./interface";
export * from "./class";
export * from "./enum";
export * from "./type";

/**
 * Function to creates a new server instance
 * @param {ServerConfig} config - The server configuration
 * @returns {Server} - The server instance
 * 
 * @see {@link ServerConfig}
 */
export default (config: ServerConfig) => new Server(config);
