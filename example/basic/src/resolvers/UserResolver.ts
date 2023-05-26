import { Resolver, IResolver } from "../../../../dist";
import MainService from "../services/mainService";

@Resolver({singleton: false})
export default class UserResolver implements IResolver<string> {

    constructor(
        private mainService: MainService
    ) { }

    resolve(param?: string): string {
        return (param?.toUpperCase() || '') + this.mainService.getAndAdd();
    }
}
