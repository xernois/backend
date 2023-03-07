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
  method: string[] | string;
  name: string
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