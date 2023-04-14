import http from 'http';
import fs from 'fs';
import path from 'path';
import { match } from 'path-to-regexp';
import { Injector, Request, IResolver, IMiddleware, Method, Type, Constructor, Handler, Resolvers, RouteType, Middlewares, handlerList, ServerConfig } from '../';

/**
 * Server class
 * @class
 * @classdesc - The server class to handle the http requests
 * @see {@link ServerConfig}
 */
export class Server {

    /**
     * Map of handlers
     * @private
     * @type {handlerList}
     * 
     * @see {@link handlerList}
     * @see {@link Server}
     */
    private handlers: handlerList

    /**
     * Array of global middlewares
     * @private
     * @type {IMiddleware[]}
     *  
     * @see {@link IMiddleware}
     * @see {@link Server}
     */
    private middlewares: IMiddleware[]

    /**
     * The http server
     * @private
     * @type {http.Server}
     *  
     * @see {@link http.Server}
     * @see {@link http}
     * @see {@link Server}
     */
    private server: http.Server

    /**
     * Instanciate the server
     * @constructor 
     * @param {ServerConfig} config - The server configuration
     * 
     * @see {@link ServerConfig}  
     * @see {@link Server}
     */
    constructor(private config: ServerConfig) {
        // initialize the server properties
        this.middlewares = []
        this.handlers = Object.values(Method).reduce((acc, method: string) => (acc[method as Method] = [], acc), {} as handlerList);
        this.server = http.createServer();

        // crawl the app folder to get all the controllers, middlewares, etc. and store them in the dependency injector if they singleton
        this.deepReadDir(path.join(process.cwd(), config.appFolder));

        // get all controllers instances
        const controllers = Injector.getInstancesByType(Type.Controller);

        console.group('Routes :')
        // iterate over all controllers and get their routes
        controllers.forEach(controller => {
            // iterate over all routes and store them in the handlers map
            (controller as any).ROUTE_MAP.forEach((route: RouteType, key: string) => {
                console.log([route.method].flat().join(','), ' - ', path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), route.resolvers ? ' - ' + JSON.stringify(Object.keys(route.resolvers).reduce((acc: any, curr) => (acc[curr] = route.resolvers?.[curr]?.name, acc), {})) : '');
                if (typeof route.method === 'string') this.handle(route.method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), ((controller as Object)[key as keyof typeof controller] as Handler).bind(controller), route.resolvers, [...(controller as any).MIDDLEWARES, ...(route.middlewares || [])]);
                else route.method.forEach(method => this.handle(method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), ((controller as Object)[key as keyof typeof controller] as Handler).bind(controller), route.resolvers, [...(controller as any).MIDDLEWARES, ...(route.middlewares || [])]));
            })
        })
        console.groupEnd();
    }

    /**
     * Add a route handler to the handlers map
     * @private
     * @param {Method} method - The http method
     * @param {string} path - The route path
     * @param {Handler} handler - The handler function
     * @param {Resolvers} [resolvers] - The resolvers for the route
     * @param {Middlewares} [middlewares] - The middlewares for the route
     * 
     * @see {@link Method}
     * @see {@link Handler}
     * @see {@link Resolvers}
     * @see {@link Middlewares}
     * @see {@link Server}
     */
    private handle(method: Method, path: string, handler: Handler, resolvers?: Resolvers, middlewares?: Middlewares) {
        if (!this.handlers[method]) this.handlers[method] = [];
        this.handlers[method].push({ path, handler, resolvers, middlewares });
    }

    /**
     * Recursively crawl the app folder to get all the controllers, middlewares, etc. and store them in the dependency injector if they singleton
     * @private
     * @param {string} appFolder - The app folder path (the starting poin)
     * 
     * @see {@link Injector}
     * @see {@link Server}
     */
    private deepReadDir(appFolder: string) {
        fs.readdirSync(appFolder).forEach(async file => {
            if (file.endsWith('.ts')) {
                const classType = require(path.join(appFolder, file)).default;
                if (classType?.prototype?.SINGLETON === true) {
                    Injector.resolve(classType);
                }
            } else if (fs.lstatSync(path.join(appFolder, file)).isDirectory()) this.deepReadDir(path.join(appFolder, file));
        })
    }

    /**
     * Start the server
     * @param {number} port - The port to listen to
     * @param {Function} [callback] - The callback to call when the server is up and running
     * 
     * @see {@link http.Server}
     * @see {@link http}
     * @see {@link Server}
     */
    public listen(port: number, callback?: () => void) {
        this.server.listen(port, callback);

        this.server.on('request', async (req, res) => {

            // apply all global middlewares
            for (const middleware of this.middlewares) {
                if (res.writableEnded) return
                await middleware.execute(req, res)
            }

            // if the url has a trailing / redirect to the same url without the trailing /
            if (this.config.trailingSlashRedirect && req.url?.endsWith('/') && req.url?.length > 1) {
                res.writeHead(301, { Location: req.url.slice(0, -1) });
                return res.end();
            }

            // otherwise, find the handler for the request and call it
            if (this.handlers[req.method as Method]) {
                // get le bon handler pour la route et la methode
                for (const handler of this.handlers[req.method as Method]) {
                    const results = match(handler.path.replace(/\/$/, ''), { decode: decodeURIComponent })(req.url || '');
                    if (results) {
                        (<Request>req).params = results.params as Record<string, any>;

                        (<Request>req).data = {};
                        for (const key in handler.resolvers) {
                            if (handler.resolvers?.[key] && (<Request>req).data) {
                                ((<Request>req).data as Record<string, unknown>)[key] = await (Injector.resolve(handler.resolvers?.[key]) as IResolver)?.resolve?.((<Request>req).params?.[key])
                            }
                        }

                        // apply all route middlewares
                        for (const middleware of handler.middlewares || []) {
                            if (res.writableEnded) return
                            await (Injector.resolve(middleware) as IMiddleware).execute(req, res)
                        }

                        handler.handler(req, res)
                        break;
                    }
                }
            }

            // if the response is not ended and if no handler were found, return 404
            if (res.writableEnded) return
            res.writeHead(404)
            res.end()
        });
    }

    /**
     * Add a global middleware to the server
     * @param {Constructor<IMiddleware>} middleware - The middleware class
     *  
     * @see {@link IMiddleware}
     * @see {@link Server}
     */
    public use(middleware: Constructor<IMiddleware>) {
        this.middlewares.push(Injector.resolve(middleware) as IMiddleware);
    }
}