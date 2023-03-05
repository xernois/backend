import { AbstractController } from "../class/AbstractController";
import { RouteType } from "../type/Route";
export const Route = (route: RouteType) => {
  const Route = (target: AbstractController, propertyKey: string) => {
    (target.constructor as typeof AbstractController).ROUTE_MAP.set(propertyKey, route);
  }
  return Route;
}
