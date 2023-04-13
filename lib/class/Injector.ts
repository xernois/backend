import 'reflect-metadata';
import { Constructor, Type } from '../';

class DependencyInjector {

    private depInstances: Map<string, unknown> = new Map<string, Constructor<unknown>>();
    
    // Storing Instances map so a service will only have one instance
    resolve(target: Constructor<unknown>) {
        if (this.depInstances && this.depInstances.has(target.name)) {
            return this.depInstances.get(target.name);
        }
        
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => this.resolve(token));
        
        const instance = new target(...injections);
        if(target.prototype.SINGLETON) {
            this.depInstances.set(target.name, instance);
        }
        
        return instance;
    }

    getInstancesByType(type: Type) {
        return Array.from(this.depInstances.values()).filter((instance) => (instance as any).TYPE === type);
    }
}

export const Injector = new DependencyInjector();