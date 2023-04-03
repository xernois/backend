import { Injectable } from "../../lib/decorators/Injectable"
import dataService from "./dataService";

@Injectable()
export default class MainService {

    constructor(
        private dataService: dataService
    ) { }

    data: number[] = []

    getAndAdd() {
        return this.dataService.getAndAdd();
    }
}