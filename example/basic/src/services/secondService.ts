import { Injectable } from "../../../dist"
import dataService from "./dataService";

@Injectable()
export default class SecondService {

    constructor(
        private dataService: dataService
    ) { }

    data: number[] = []

    getAndAdd() {
        return this.dataService.getAndAdd();
    }
}