import { createServer } from 'node:http';
import { MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'ch2';
const client = new MongoClient(url);


/*
Try to connect to a database
*/
try {
    await client.connect();
    console.log('connected to client :)');
} catch (err) {
    console.error('Error connecting to db :(');
}

/*

*/
const server = createServer(async (requestAnimationFrame, res) => {
    const db = client.db(dbName);
    const users = db.collection('users');
    const usersList = await users.find().toArray();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(usersList));
})

const host = 'localhost';
const port = 3000;
server.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
})