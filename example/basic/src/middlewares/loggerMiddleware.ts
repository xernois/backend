import { Request, Response, } from "../../../../dist";

export const logger = (req: Request, res: Response) => {
        console.log(req.method, req.url, req.headers.host, req.headers['user-agent'])
}