import http from 'http';
import fs from 'fs';
import path from 'path';
import { match } from 'path-to-regexp';
import { Injector, Request, IResolver, IMiddleware, Method, Type, Constructor, Handler, handlerList, Resolvers, RouteType, ServerConfig, Middlewares } from '../';

export class Server {

    private handlers: handlerList
    private middlewares: IMiddleware[] = [];

    private server: http.Server

    constructor(private config: ServerConfig) {
        this.handlers = Object.values(Method).reduce((acc, method: string) => (acc[method as Method] = [], acc), {} as handlerList);
        this.server = http.createServer();
        this.deepReadDir(path.join(process.cwd(), config.appFolder));

        const controllers = Injector.getInstancesByType(Type.Controller);

        console.group('Routes :')
        controllers.forEach(controller => {
            
            (controller as any).ROUTE_MAP.forEach((route: RouteType, key: string) => {
                console.debug([route.method].flat().join(','), ' - ', path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), route.resolvers ? ' - ' + JSON.stringify(Object.keys(route.resolvers).reduce((acc: any, curr) => (acc[curr] = route.resolvers?.[curr]?.name, acc), {})) : '');
                if (typeof route.method === 'string') this.handle(route.method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), ((controller as Object)[key as keyof typeof controller] as Handler).bind(controller), route.resolvers, [...(controller as any).MIDDLEWARES, ...(route.middlewares || [])]);
                else route.method.forEach(method => this.handle(method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), ((controller as Object)[key as keyof typeof controller] as Handler).bind(controller), route.resolvers, [...(controller as any).MIDDLEWARES, ...(route.middlewares || [])]));
            })
        })
        console.groupEnd();
    }

    private handle(method: Method, path: string, handler: Handler, resolvers?: Resolvers, middlewares?: Middlewares) {
        if (!this.handlers[method]) this.handlers[method] = [];
        this.handlers[method].push({ path, handler, resolvers, middlewares });
    }

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

    public use(middleware: Constructor<IMiddleware>) {
        this.middlewares.push(Injector.resolve(middleware) as IMiddleware);
    }
}