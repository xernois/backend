import { Constructor, RouteType } from "../";

export const Route = <T>(route: RouteType) => {
  return (target: T, propertyKey: string) => {
    const controller = (target as Constructor<T>).constructor.prototype;

    if (!controller.ROUTE_MAP) controller.ROUTE_MAP = new Map();

    controller.ROUTE_MAP.set(propertyKey, route);
  }
}
