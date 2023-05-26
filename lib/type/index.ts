import http from 'http';
import { Method, IResolver } from '../';

/**
 * Represents a route object with path, method and name
 * Mostly used with @Route decorator to register a route on a controller
 * @typedef {Object} RouteType
 * @property {string} path - The path of the route
 * @property {string[]} method - The method of the route
 * @property {string} name - The name of the route
 * @property {Resolvers} resolvers - The resolvers of the route
 * @property {Middlewares} middlewares - The middlewares of the route
 */
export type RouteType = {
  path: string
  method: [Method, ...Method[]] | Method
  name: string
  resolvers?: Resolvers
  middlewares?: Middlewares
}

/**
 * Represents a constructor function
 * @typedef {Object} Constructor
 * @property {Function} new - The constructor function
 */
export type Constructor<T> = {
  new(...args: any[]): T;
}

/**
 * Represents a handler function
 * @typedef {Object} Handler
 */
export type Handler = ((req: Request, res: Response) => unknown) | ((req: Request, res: Response) => Promise<unknown>);

/**
 * Represents a route object with path, handler and resolvers
 * @typedef {Object} route
 * @property {string} path - The path of the route
 * @property {Handler} handler - The handler of the route
 * @property {Resolvers} resolvers - The resolvers of the route
 * @property {Middlewares} middlewares - The middlewares of the route
 */
export type route = { path: string, handler: Handler, resolvers?: Resolvers, middlewares?: Middlewares };

/**
 * Represents a list of routes
 * @typedef {Object} handlerList
 * @property {route[]} [keyof Method] - The list of routes per methods
 */
export type handlerList = Record<Method, route[]>;

/**
 * Represents a controller options
 * @typedef {Object} ControllerOptions
 * @property {string} [path] - The path of the controller
 * @property {Middlewares} [middlewares] - The middlewares of the controller
 */
export type ControllerOptions = { path?: string, middlewares?: Middlewares };

/**
 * Represents a server config
 * @typedef {Object} ServerConfig
 * @property {string} appFolder - The folder of the app
 * @property {boolean} [trailingSlashRedirect] - The trailing slash redirect option
 */
export type ServerConfig = {
  appFolder: string | undefined;
  trailingSlashRedirect?: boolean;
}

/**
 * Represents a list of resolvers
 * @typedef {Object} Resolvers
 * @property {Constructor<IResolver>} [_param_] - a resolver constructor 
 */
export type Resolvers = Record<any, Constructor<IResolver>>;

/**
 * Represents a request object
 * @typedef {http.IncomingMessage} Request
 * @property {Record<string, string>} params - The params of the request
 * @property {Record<string, unknown>} data - The data of the request
 */
export interface Request extends http.IncomingMessage {
  params?: Record<string, string>,
  data?: Record<string, unknown>,
  url: string,
};

/**
 * Represents a response object
 * @typedef {http.ServerResponse} Response
 */
export interface Response extends http.ServerResponse {
  sendEvent: (data: string, event?: string, id?: unknown) => void
};

export type Middleware = Handler
export type Middlewares = Middleware[]
export type MiddlewareFactory = (...args: unknown[]) => Middleware