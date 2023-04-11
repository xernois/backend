import app from "../lib";
import logger from '../lib/plugin/logger';

const server = app({
    appFolder: 'src',
});

server.use(logger());

server.listen(3000, () => {
    console.log('Server started on port 3000');
})