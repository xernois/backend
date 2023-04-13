import { Handler } from '../';

export interface IResolver<T = unknown> {
    resolve: ((param?: string) => T) | ((param?: string) => Promise<T>) ;
}

export interface IMiddleware {
    execute: Handler
}