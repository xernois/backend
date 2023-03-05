import { RouteType } from "../type/Route";

export abstract class AbstractController {
  
  static TYPE: string = 'controller';

  static ROUTE_MAP: Map<string, RouteType> = new Map();

  getRoutes() {
    return (this.constructor as typeof AbstractController).ROUTE_MAP;
  }
}