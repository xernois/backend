import { Request, Response, Middleware, IMiddleware } from "../../lib";

@Middleware({ singleton: false })
export default class LoggerMiddleware implements IMiddleware {

        execute(req: Request, res: Response) {
                console.log(req.method, req.url, req.headers.host, req.headers['user-agent'])
        }
}
