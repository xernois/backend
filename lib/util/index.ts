import { Request, Response } from "../type"
import http from 'http';

export const wrapResponse = (res: http.ServerResponse): Response => {

    (<Response>res).sendEvent = (event: string, data: any, id: unknown) => {

        if (!res.headersSent) {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.flushHeaders();
        }

        res.write(`id: ${id} \n`);
        res.write(`event: ${event} \n`);
        res.write(`data: ${data} \n\n`);
    }

    return <Response>res;
}

export const wrapRequest = (req: http.IncomingMessage): Request => {

    (<Request>req).params = {};
    (<Request>req).data = {};
    (<Request>req).url ??= '';

    return <Request>req
}