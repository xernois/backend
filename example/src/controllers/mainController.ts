import MainService from '../services/mainService';
import { Controller, Method, Response, Request, Route } from '../../../dist';
import SecondService from '../services/secondService';
import UserResolver from '../resolvers/UserResolver';
import LoggerMiddleware from '../middlewares/loggerMiddleware';

@Controller({ path: '/main', middlewares: [LoggerMiddleware] })
export default class MainController {

  constructor(
    private mainService: MainService,
    private secondService: SecondService
  ) { }

  @Route({ path: '/', method: Method.GET, name: 'index'})
  public index(req: Request, res: Response) {

    res.end(JSON.stringify(this.secondService.getAndAdd()))

  }

  @Route({ path: '/home', method: [Method.GET, Method.POST], name: 'home' })
  public home(req: Request, res: Response) {

    res.end(JSON.stringify(this.mainService.getAndAdd()))

  }

  @Route({ path: '/user/:user', method: [Method.GET], name: 'dynamic', resolvers: { 'user': UserResolver } })
  public dynamic(req: Request, res: Response) {

    res.end(req.data?.['user'])

  }
}
