import { Type, Constructor, ControllerOptions } from "../";

export function Controller <T>(otpions?: ControllerOptions) {
    return (target: Constructor<T>, _?: unknown) => {
        target.prototype.TYPE = Type.Controller;
        target.prototype.SINGLETON = true;
        target.prototype.BASE_ROUTE = otpions?.path || '';
    };
}