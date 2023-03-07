import { Constructor, RouteType } from "../type";

export const Route = <T>(route: RouteType) => {
  return (target: T, propertyKey: string) => {
    if (!(target as Constructor<T>).constructor.prototype.ROUTE_MAP) (target as Constructor<T>).constructor.prototype.ROUTE_MAP = new Map();

    (target as Constructor<T>).constructor.prototype.ROUTE_MAP.set(propertyKey, route);
  }
}
