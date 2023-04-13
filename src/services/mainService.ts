import { Injectable } from "../../lib/decorators/Injectable"
import dataService from "./dataService";

@Injectable()
export default class MainService {

    constructor(
        public dataService: dataService
    ) { }

    data: number[] = []

    getAndAdd() {
        return this.dataService.getAndAdd();
    }
}