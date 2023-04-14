import { Type, Constructor, ControllerOptions } from "../";

/**
 * Controller decorator factory
 * @param {{path: string, middlewares: Function[]}} options - The controller options
 * @returns {Function} - The controller decorator
 * 
 * @see {@link ControllerOptions}
 */
export function Controller <T>(otpions?: ControllerOptions) {
    return (target: Constructor<T>, _?: unknown) => {
        target.prototype.MIDDLEWARES = otpions?.middlewares || [];
        target.prototype.TYPE = Type.Controller;
        target.prototype.SINGLETON = true;
        target.prototype.BASE_ROUTE = otpions?.path || '';
    };
}