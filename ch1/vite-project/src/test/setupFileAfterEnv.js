// this file defines a beforeAll to initialize to our DB before tests run
// and also a function afterAll which disconnects the db after all tests finish running.

import mongoose from 'mongoose';
import { beforeAll, afterAll } from '@jest/globals';
import { initDatabase } from '../db/init.js';

beforeAll(async () => {
    await initDatabase();
})

afterAll(async () => {
    await mongoose.disconnect();
})