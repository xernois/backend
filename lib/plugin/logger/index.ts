import { Request, Response } from "../../type"

export default function () {

        return (req: Request, res: Response) => {
                console.log(req.method, req.url, req.headers.host, req.headers['user-agent'])
        }
}
