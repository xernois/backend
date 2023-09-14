import { Request, Response } from "../type"
import http from 'http';

export const wrapResponse = (res: http.ServerResponse): Response => {

    (<Response>res).sendEvent = (data: string, event?: string, id?: string) => {

        if (!res.headersSent) {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.flushHeaders();
        }

        res.write(`id: ${id} \n`);
        res.write(`event: ${event} \n`);
        res.write(`data: ${data} \n\n`);
    };


    (<Response>res).sendJson = (data: Object) => {

        if (!res.headersSent) {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'application/json');
            res.flushHeaders();
        }

        res.end(JSON.stringify(data))
    };

    return <Response>res;
}

export const wrapRequest = (req: http.IncomingMessage): Request => {

    (<Request>req).params = {};
    (<Request>req).data = {};
    (<Request>req).url ??= '';

    return <Request>req
}