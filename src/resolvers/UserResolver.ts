import { Injectable } from "../../lib/decorators/Injectable";
import { Resolver } from "../../lib/interface";
import MainService from "../services/mainService";

@Injectable()
export default class UserResolver implements Resolver<string> {

    constructor(
        private mainService: MainService
    ) { }

    resolve(param?: string): string {
        return (param?.toUpperCase() || '') + this.mainService.getAndAdd();
    }
}
