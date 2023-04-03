import 'reflect-metadata';
import { ServerConfig } from './type';
import { Server } from './class/Server';

export default (config: ServerConfig) => new Server(config);