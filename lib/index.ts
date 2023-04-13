import 'reflect-metadata';
import { Server } from './class';
import { ServerConfig } from './type';

export * from "./decorators";
export * from "./interface";
export * from "./class";
export * from "./enum";
export * from "./type";

export default (config: ServerConfig) => new Server(config);