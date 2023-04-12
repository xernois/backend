import { Injectable } from "../../lib/decorators/Injectable";
import { Middleware } from "../../lib/interface";
import { Request, Response } from "../../lib/type";
import MainService from "../services/mainService";

@Injectable()
export default class LoggerMiddleware implements Middleware {

        constructor(
                private mainService: MainService
        ) { }

        execute(req: Request, res: Response) {
                // console.log(req.method, req.url, req.headers.host, req.headers['user-agent'])
                console.log(this.mainService.dataService.data);
        }
}
