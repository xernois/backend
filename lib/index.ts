import * as path from 'path';
import * as fs from 'fs';
import 'reflect-metadata';
import express from 'express';
import { Resolver } from './class/Injector';
import { RouteType } from './type';
import { Type } from './enum';

export default function () {

    const config = {
        appFolder: 'src',
    }

    const appFolder = path.join(process.cwd(), config.appFolder);

    const deepReadDir = (appFolder: string) => {
        fs.readdirSync(appFolder).forEach(file => {
            if (file.endsWith('.ts')) {
                const classType = require(path.join(appFolder, file)).default;
                if (classType?.prototype?.TYPE === Type.Service || classType?.prototype?.TYPE === Type.Controller) Resolver.resolve(classType);
            } else if (fs.lstatSync(path.join(appFolder, file)).isDirectory()) deepReadDir(path.join(appFolder, file));
        });
    }

    deepReadDir(appFolder);

    const serve = () => {
        const app = express();

        //register all routes
        const controllers = Resolver.getInstancesByType(Type.Controller);
        controllers.forEach(controller => {
            (controller as any).ROUTE_MAP.forEach((route: RouteType, key: string) => {
                app.all(route.path, (controller[key as keyof typeof controller] as Function).bind(controller));
            })
        })

        app.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    }

    return {
        serve
    }
}