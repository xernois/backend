import http from 'http';
import { Handler, handlerList, Plugin, RouteType, ServerConfig } from '../type';
import { Method, Type } from '../enum';
import path from 'path';
import fs from 'fs';
import { Resolver } from './Injector';

export class Server {

    private handlers: handlerList
    private plugins: Plugin[] = [];

    private server: http.Server

    constructor(config: ServerConfig) {
        this.handlers = Object.values(Method).reduce((acc, method: string) => (acc[method as Method] = [], acc), {} as handlerList);
        this.server = http.createServer();
        this.deepReadDir(path.join(process.cwd(), config.appFolder));

        const controllers = Resolver.getInstancesByType(Type.Controller);

        controllers.forEach(controller => {
            (controller as any).ROUTE_MAP.forEach((route: RouteType, key: string) => {
                if (typeof route.method === 'string') this.handle(route.method, path.join((controller as any).BASE_ROUTE, route.path), (controller[key as keyof typeof controller] as Handler).bind(controller));
                else route.method.forEach(method => this.handle(method, path.join((controller as any).BASE_ROUTE, route.path), (controller[key as keyof typeof controller] as Handler).bind(controller)));
            })
        })
    }

    private handle(method: Method, path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
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
            this.plugins.forEach(plugin => plugin(req, res));

            if(res.writableEnded) return

            if (this.handlers[req.method as Method] && !res.writableEnded) {
                const handler = this.handlers[req.method as Method].find(handler => handler.path === req.url);
                if (handler) handler.handler(req, res);
            }

            if(res.writableEnded) return
                res.writeHead(404)
                res.end()
        });
    }

    public use(plugin: Plugin) {
        this.plugins.push(plugin);
    }
}