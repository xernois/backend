import fs from 'fs';
import path from 'path';
import { Request, Response } from "../type";
import mime from 'mime-types';

export const staticFolder = (folderPath: string = 'public') => {
  return async (req: Request, res: Response) => {

    return new Promise<void>((resolve) => {

      const root = path.normalize(path.resolve(path.join(process.cwd(), folderPath)));
      const extension = path.extname(req.url).slice(1);

      let fileName = req.url

      if (fileName === '/') fileName = '/index.html';
      else if (!extension) {
        try {
          fs.accessSync(path.join(root, fileName + '.html'), fs.constants.F_OK);
          fileName = fileName + '.html';
        } catch (e) {
          fileName = path.join(fileName, 'index.html');
        }
      }

      const filePath = path.normalize(path.join(process.cwd(), folderPath, fileName));

      if (!path.normalize(path.resolve(filePath)).startsWith(root)) return resolve();

      fs.readFile(filePath, (err, data) => {
        if (!err && data) {
          res.writeHead(200, { 'Content-Type': mime.lookup(filePath) || 'text/plain' }).end(data);
        }
        resolve();
      });
    })
  }
}