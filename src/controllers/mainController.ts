import { Route } from '../../lib/decorators/Route';
import MainService from '../services/mainService';
import { Controller } from '../../lib/decorators/Controller';

@Controller()
export default class MainController {

  constructor(
    private mainService: MainService
  ) {}

  @Route({path: '/', method: 'get', name: 'index'})
  public index(req: any, res: any) {
    res.send('Hello World!')
  }

  @Route({path: '/home', method: 'get', name: 'index'})
  public home(req: any, res: any, mainService: MainService) {

    res.json(this.mainService.getAndAdd())

  }
}
