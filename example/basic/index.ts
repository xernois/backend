import app from "../../dist";

const server = app({
    appFolder: 'src',
    trailingSlashRedirect: true
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
})