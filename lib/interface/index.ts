import { Handler } from '../type';

export interface Resolver<T = unknown> {
    resolve: (param?: string) => T;
}

export interface Middleware {
    execute: Handler
}