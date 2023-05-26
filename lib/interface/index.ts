/**
 * Represents a resolver Interface
 * @typedef {Object} IResolver
 * @property {((param?: string) => T) | ((param?: string) => Promise<T>)} resolve - The resolve function of the resolver
 */
export interface IResolver<T = unknown> {
    resolve: ((param?: string) => T) | ((param?: string) => Promise<T>) ;
}