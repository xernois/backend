import { Request, Response } from "../type"
import http from 'http';

export const wrapResponse = (res: http.ServerResponse): Response => {

    (<Response>res).sendEvent = (data: any, event?: string, id?: unknown) => {

        if (!res.headersSent) {
            res.setHeader('X-Accel-Buffering', 'no')
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
    (<Request>req).body = "";
    (<Request>req).data = {};
    (<Request>req).url ??= '';

    new Promise((resolve) => {
        req.on('data', chunk => (<Request>req).body += chunk.toString());
        req.on('end', resolve);
    })

    return <Request>req
}