import { createServer } from 'node:http';

/* 
the createServer function is an asynchonous function. 
it requires us to pass a callback function to it, which will then be executed when a request comes from the server
*/
const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello HTTP World');
})

const host = 'localhost';
const port = 3000;

server.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
})