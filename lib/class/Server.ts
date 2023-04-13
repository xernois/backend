import http from 'http';
import { Handler, handlerList, Plugin, RouteType, ServerConfig } from '../type';
import { Method, Type } from '../enum';
import fs from 'fs';
import path from 'path';
import { Response, Request } from '../type';
import { Resolver } from './Injector';
import { match } from 'path-to-regexp';

export class Server {

    private handlers: handlerList
    private plugins: Plugin[] = [];

    private server: http.Server

    constructor(private config: ServerConfig) {
        this.handlers = Object.values(Method).reduce((acc, method: string) => (acc[method as Method] = [], acc), {} as handlerList);
        this.server = http.createServer();
        this.deepReadDir(path.join(process.cwd(), config.appFolder));

        const controllers = Resolver.getInstancesByType(Type.Controller);

        controllers.forEach(controller => {
            (controller as any).ROUTE_MAP.forEach((route: RouteType, key: string) => {
                if (typeof route.method === 'string') this.handle(route.method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), (controller[key as keyof typeof controller] as Handler).bind(controller));
                else route.method.forEach(method => this.handle(method, path.join((controller as any).BASE_ROUTE, route.path).split(path.sep).join(path.posix.sep), (controller[key as keyof typeof controller] as Handler).bind(controller)));
            })
        })
    }

    private handle(method: Method, path: string, handler: Handler) {
        if (!this.handlers[method]) this.handlers[method] = [];
        this.handlers[method].push({ path, handler });
    }

    private deepReadDir(appFolder: string) {
        fs.readdirSync(appFolder).forEach(async file => {
            if (file.endsWith('.ts')) {
                const classType = require(path.join(appFolder, file)).default;
                if (classType?.prototype?.TYPE === Type.Service || classType?.prototype?.TYPE === Type.Controller) {
                    Resolver.resolve(classType);
                }
            } else if (fs.lstatSync(path.join(appFolder, file)).isDirectory()) this.deepReadDir(path.join(appFolder, file));
        })
    }

    public listen(port: number, callback?: () => void) {
        this.server.listen(port, callback);

        this.server.on('request', (req, res) => {

            // call all plugins
            this.plugins.forEach(plugin => plugin(req, res));

            // if the url has a trailing / redirect to the same url without the trailing /
            if (this.config.trailingSlashRedirect && req.url?.endsWith('/')) {
                res.writeHead(301, { Location: req.url.slice(0, -1) });
                res.end();
            }

            // if the response is already ended, return
            if (res.writableEnded) return

            // otherwise, find the handler for the request and call it
            if (this.handlers[req.method as Method]) {
                const handler = this.handlers[req.method as Method].find(handler => {
                    let res = match(handler.path.replace(/\/$/, ''), { decode: decodeURIComponent })(req.url || '');
                    
                    if(res) {
                        (<Request>req).params = res.params as Record<string, any>;                     
                    }
                    return res;
                });
                if (handler) handler.handler(req, res);
            }

            // if the response is not ended and if no handler were found, return 404
            if (res.writableEnded) return
            res.writeHead(404)
            res.end()
        });
    }

    public use(plugin: Plugin) {
        this.plugins.push(plugin);
    }
}