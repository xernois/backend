/**
 * Represents the type of a class.
 * This type is added to the prototype of a class when it is decorated with @Controller or @Service
 *
 * @enum {string}
 * @property {string} Controller - The class is a controller
 * @property {string} Service - The class is a service
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
    Service = 'service'
}


export enum Method {
    GET = 'GET',
    POST = 'POST',
}