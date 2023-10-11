import { Request, Response } from "../type"
import http from 'http';

export const wrapResponse = (res: http.ServerResponse): Response => {

    (<Response>res).sendEvent = (data: string, event?: string, id?: string) => {
        if (!res.headersSent) {
            res.setHeader('X-Accel-Buffering', 'no')
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.flushHeaders();
        }

        if(id) res.write(`id: ${id} \n`);
        if(event) res.write(`event: ${event} \n`);
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
    (<Request>req).body = "";
    (<Request>req).data = {};
    (<Request>req).url ??= '';
    (<Request>req).query = decodeURI(req.url || '')?.split('?')[1]?.split('&').reduce<Record<string, string>>((acc, curr) => {
        const split = curr.split('=')
        if (split.length >= 1) acc[split[0]] = split[1] || split[0]
        return acc
    }, {});

    new Promise((resolve) => {
        req.on('data', chunk => (<Request>req).body += chunk.toString());
        req.on('end', resolve);
    })

    return <Request>req
}