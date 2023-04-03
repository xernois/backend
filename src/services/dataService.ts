import { Injectable } from "../../lib/decorators/Injectable"

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