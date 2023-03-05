import { Route } from '../../lib/decorators/Route';
import { AbstractController } from '../../lib/class/AbstractController';

export default class MainController extends AbstractController {
  @Route({path: '/', method: 'get', name: 'index'})
  public index(req: any, res: any) {
    res.send('Hello World!')
  }

  @Route({path: '/', method: 'get', name: 'index'})
  public home(req: any, res: any) {
    res.send('Hello World!')
  }
}
