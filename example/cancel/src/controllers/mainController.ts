import { Controller, Method, Response, Request, Route } from '../../../../dist';

@Controller()
export default class MainController {

    @Route({ path: '/api', method: [Method.GET], name: 'index' })
    public async index(req: Request, res: Response) {

        req.on('close', () => {
            console.log('request was cancelled');
        });

        setTimeout(() => {
            res.end(JSON.stringify({ message: 'Hello world' }));
            console.log('this shouldn\'t log when the request is cancelled')
        }, 2000);

    }
}
