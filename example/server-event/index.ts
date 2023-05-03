import app from "../../dist";

const server = app({
    appFolder: 'src',
    trailingSlashRedirect: true
});

server.listen(3000, () => {
    console.log('Server started on port 3000, access it at http://localhost:3000');
})