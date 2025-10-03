import mongoose from 'mongoose';

// this will initialize DB connection
export function initDatabase() {
    //mongodb://localhost:27017/blog
    // process.env.DATABASE_URL
    const DATABASE_URL = 'mongodb://localhost:27017/blog';

    // add a listener to the open event on the Mongoose connection so that we can show a log message once were connected to the database
    mongoose.connection.on('open', () => {
        console.info('successfully connected to database: ', DATABASE_URL);
    })

    const connection = mongoose.connect(DATABASE_URL);
    return connection;
}