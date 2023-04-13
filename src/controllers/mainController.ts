import { Route } from '../../lib/decorators/Route';
import MainService from '../services/mainService';
import { Controller } from '../../lib/decorators/Controller';
import SecondService from '../services/secondService';
import { Method } from '../../lib/enum';
import { Response, Request } from '../../lib/type';
import UserResolver from '../resolvers/UserResolver';

@Controller({ path: '/main' })
export default class MainController {

  constructor(
    private mainService: MainService,
    private secondService: SecondService
  ) { }

  @Route({ path: '/', method: Method.GET, name: 'index' })
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
