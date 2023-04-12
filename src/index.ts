import app from "../lib";
import LoggerMiddleware from "./middlewares/loggerMiddleware";

const server = app({
    appFolder: 'src',
    trailingSlashRedirect: true
});

server.use(LoggerMiddleware);

server.listen(3000, () => {
    console.log('Server started on port 3000');
})