import app, { staticFolder } from "../../dist";

const server = app({
    appFolder: undefined,
    trailingSlashRedirect: true
});

server.use(staticFolder('public'));

server.listen(3000, () => {
    console.log('Server started on port 3000, access it at http://localhost:3000');
})