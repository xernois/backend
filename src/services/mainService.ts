import { Injectable } from "../../lib/decorators/Injectable"
import SecondService from "./secondService"


@Injectable()
export default class MainService {

    data: number[] = []

    getAndAdd() {
        this.data.push(Math.random());

        return this.data;
    }
}