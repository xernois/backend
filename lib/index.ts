import * as path from 'path';
import * as fs from 'fs';
import express from 'express';
import { AbstractController } from './class/AbstractController';

interface Route {
  path: string;
  method: string;
  name: string;
}

interface RouteMap {
  [key: string]: Route;
}

export default function () {

  const config = {
    appFolder: 'src',
    controllersFolder: 'controllers',
  }
  const appFolder = path.join(process.cwd(), config.appFolder);
  const controllersFolder = path.join(appFolder, config.controllersFolder);

  const controllers: (AbstractController)[] = [];
  const routes: RouteMap = {};

  //import all controllers from controllers folder
  fs.readdirSync(controllersFolder).forEach(file => {
    if (file.endsWith('.ts')) {
      const controller = require(path.join(controllersFolder, file)).default;
      if (controller.TYPE === 'controller') controllers.push(new controller);
    }
  });

  const serve = () => {
    const app = express();

    //register all routes
    controllers.forEach(controller => {
      controller.getRoutes().forEach((route, key) => {
        app.all(route.path, controller[key as keyof typeof controller]);
      })
    });

    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });

  }

  return {
    serve
  }
}
















