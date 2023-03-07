import 'reflect-metadata';
import { Type } from '../enum';
import { Constructor } from '../type';

export class Injector {

    private depInstances: Map<string, Constructor<any>> = new Map<string, Constructor<any>>();

    // Not storing an instances map
    static resolve<T>(target: Constructor<any>): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => Injector.resolve<any>(token));
        return new target(...injections);
    }

    // Storing Instances map so a service will only have one instance
    resolve (target: Constructor<any>): any {

        if (this.depInstances && this.depInstances.has(target.name)) {
            console.log(target.name, 'instance exists');
            return this.depInstances.get(target.name);
        }

        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => Injector.resolve<any>(token));

        const instance = new target(...injections);
        this.depInstances.set(target.name, instance);

        return instance;
    }

    getInstancesByType(type: Type) {
        return Array.from(this.depInstances.values()).filter((instance) => (instance as any).TYPE === type);
    }
}

export const Resolver = new Injector();