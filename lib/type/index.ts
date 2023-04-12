import http from 'http';
import { Method } from '../enum';
import { Resolver } from '../interface';
/**
 * Represents a route object with path, method and name
 * @typedef {Object} RouteType
 * @property {string} path - The path of the route
 * @property {string[]} method - The method of the route
 * @property {string} name - The name of the route
 *
 * @example {
 *  path: '/home',
 *  method: 'get',
 *  name: 'index'
 * }
 *
 * Mostly used with @Route decorator to register a route on a controller
 */
export type RouteType = {
  path: string;
  method: Method[] | Method;
  name: string
  resolvers?: Resolvers
}

/**
 * Represents a constructor function
 * @typedef {Object} Constructor
 * @property {Function} new - The constructor function
 *
 * @example class Test {
 *  constructor() {}
 * }
 */
export interface Constructor<T> {
  new(...args: any[]): T;
}

export type Handler = (req: http.IncomingMessage, res: http.ServerResponse) => void;
export type route = { path: string, handler: Handler, resolvers?: Resolvers };
export type handlerList = Record<Method, route[]>;

export type Request = http.IncomingMessage & { params?: Record<string, string>, data?: Record<string, unknown> };
export type Response = http.ServerResponse;

export type ControllerOptions = { path: string };

export type ServerConfig = {
  appFolder: string;
  trailingSlashRedirect?: boolean;
}

export type Resolvers = Record<any, Constructor<Resolver>>;