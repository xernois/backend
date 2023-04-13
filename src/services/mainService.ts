import { Injectable } from "../../lib"
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