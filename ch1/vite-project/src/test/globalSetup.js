import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
    // createv a memory server
    const instance = await MongoMemoryServer.create({
        binary: {

            // this version has to match with the version he have in our Docker container
            version: '6.0.4',
        }
    })

    global.__MONGOINSTANCE = instance;
    process.env.DATABASE_URL = instance.getUri();

}