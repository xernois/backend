import { Injectable } from "../../lib"

@Injectable()
export default class dataService {

    constructor(
    ) { }

    data: number[] = []

    getAndAdd() {
        this.data.push(Math.random());

        return this.data;
    }
}