import 'reflect-metadata';
import { Constructor, Type } from '../';

/**
 * Dependency Injector class
 * @class
 * @classdesc - The dependency injector class to resolve dependencies and store instances of services, controllers, etc.
 */
class DependencyInjector {

    /**
     * Map of instances
     * @private
     * @type {Map<string, unknown>}
     * 
     * @see {@link Map}
     * @see {@link DependencyInjector}
     */
    private depInstances: Map<string, unknown> = new Map<string, Constructor<unknown>>();

    /**
     * method to resolve a dependency
     * @param {Constructor<unknown>} target - The target class to be resolved
     * @returns {unknown} - The instance of the target class
     * 
     * @see {@link DependencyInjector}
     */
    public resolve(target: Constructor<unknown>) {
        // check if the target is already instanciated based on its name
        if (this.depInstances && this.depInstances.has(target.name)) {
            // if it is, return the instance
            return this.depInstances.get(target.name);
        }

        // otherwise, get the tokens of the constructor parameters and resolve them
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => this.resolve(token));

        // create a new instance of the target class and store it if it is a singleton
        const instance = new target(...injections);
        if (target.prototype.SINGLETON) {
            this.depInstances.set(target.name, instance);
        }

        
        return instance;
    }

    /**
     * method to get all instances of a specific type
     * @param {Type} type - The type of the instances to get
     * @returns {Array<unknown>} - The array of instances
     * 
     * @see {@link Type}
     * @see {@link DependencyInjector}
     * @see {@link Array}
     */
    getInstancesByType(type: Type) {
        return Array.from(this.depInstances.values()).filter((instance) => (instance as any).TYPE === type);
    }
}

/**
 * The dependency injector instance
 * @type {DependencyInjector}
 *  
 * @see {@link DependencyInjector}
 */ 
export const Injector = new DependencyInjector();