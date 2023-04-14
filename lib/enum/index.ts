/**
 * Represents the type of a class.
 * This type is added to the prototype of a class when it is decorated with @Controller or @Service
 *
 * @enum {string}
 * @property {string} Controller - The class is a controller
 * @property {string} Service - The class is a service
 * @property {string} Middleware - The class is a middleware
 * @property {string} Resolver - The class is a resolver
 *
 * @example class Test {
 * constructor() {}
 * }
 *
 * Test.prototype.TYPE = Type.Controller;
 *
 * console.log(Test.prototype.TYPE); // controller
 */
export enum Type {
    Controller = 'controller',
    Service = 'service',
    Middleware = 'middleware',
    Resolver = 'resolver'
}

/**
 * Represents the HTTP methods.
 * This type is used in the @Route decorator
 * 
 * @enum {string} 
 * @property {string} GET - The HTTP GET method
 * @property {string} POST - The HTTP POST method
 */
export enum Method {
    GET = 'GET',
    POST = 'POST',
}