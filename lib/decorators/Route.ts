import { Constructor, RouteType } from "../";

/**
 * Represents a route decorator factory
 * @param {RouteType} route - The route object
 * @returns {Function} - The route decorator
 * 
 * @see {@link RouteType}
 */
export const Route = <T>(route: RouteType): Function => {
  return (target: T, propertyKey: string) => {
    const controller = (target as Constructor<T>).constructor.prototype;

    if (!controller.ROUTE_MAP) controller.ROUTE_MAP = new Map();

    controller.ROUTE_MAP.set(propertyKey, route);
  }
}