import { Request, Response } from "../../type"

export default function (req: Request, res: Response) {
        console.log(req.method, req.url, req.headers.host, req.headers['user-agent'])
        if(req.url === '/main/') res.end('Hello World');
}
