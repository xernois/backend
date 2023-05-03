import { Controller, Method, Response, Request, Route } from '../../../../dist';

@Controller()
export default class MainController {

    @Route({ path: '/', method: [Method.GET], name: 'dynamic' })
    public async  dynamic(req: Request, res: Response) {



        for (let index = 0; index < 10; index++) {

            res.sendEvent('new server event', 'server', index)

            await new Promise(r => setTimeout(r, 1000))
        }

        res.end();
    }
}
