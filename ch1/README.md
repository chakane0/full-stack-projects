# Introduction

We will build and deploy a fullstack application with a REST API. Our backend service will use Express and Mongoose ODM. Unit tests will be created with Jest. The frontend will use React (with typescript). And finally the application will be deployed using Docker. 

## Implementing a Backend Using Express, Mongoose ODM and Jest
We will start off with a backend service using Express to provide a REST API, Mongoose object data modeling (ODM) to interface with MongoDB, and Jest to test our code. The main take-aways should be: 
* Designing a backend service
* Creating a DB schema using Mongoose
* Developing and testing service functions

### Designing a backend service
We typically use MVC pattern which consists of
* Model: Handles data and basic logic
* Controller: Controls how data is processed and displayed
* View: Displays the current state

In modern applications, the frontend is rendered through server-side rendering. SSR is where requests will reach the server which runs your react code; React will convert components into HTML and the server sends HTML back to the frontend.

The idea is that the backend service only deals with processing and serving requests and data. With that idea we can think of applications in 3 layers:
* Route Layer: Defines routes that consumers can access and handles user input by processing the request parameters and body, and then calling the service functions
* Service layer: Provides service functions such as CRUD functions, which access the DB through the service layer.
* Data Layer: Only deals with accessing the database and does basic validation to ensure that the database is consistent


This application will be a blog application which will do the following:
* Get a list of posts
* Get a single post
* Create a new post
* Update an existing post
* Delete an existing post

For this to work we will first need to make a database schema which defines what a blog post object is, then the service layer will handle CRUD functions and our REST API can query, create, update, and delete blog posts. 


#### Creating DB schemas using Mongoose
Mongoose is a library which makes MongoDB object modeling easier

This needs to be installed into the project: ```npm install mongoose@8.0.2``` and then add a new db file which will initialize the DB connection.



<details>
<summary>init.js</summary>

```js
import mongoose from 'mongoose';

// this will initialize DB connection
export function initDataBase() {
    const DATABASE_URL = 'mongodb://localhost:27017/blog';

    // add a listener to the open event on the Mongoose connection so that we can show a log message once were connected to the database
    mongoose.connection.on('open', () => {
        console.info('successfully connected to database: ', DATABASE_URL);
    })

    // connect toi the DB
    const connection = mongoose.connect(DATABASE_URL);
    return connection;
}
```
</details>


Now to test this real quick, we have an ```example.js``` file under /src which has this:


<details>
<summary>example.js</summary>

```js
import { initDatabase } from './db/init.js';
initDatabase();
```
</details>

At this point you should be successfully connected to the database.

#### Defining a model for blog posts
Once we can connect to the DB, now we can think about how to define the data structure

We can create a new folder under /src/db called ```models``` and place this file in there:
<details>
<summary>post.js</summary>

```js
import mongoose,  { Schema } from 'mongoose';


// specifies all properties of a blog post
const postSchema = new Schema({
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
})

// create a Mongoose model based off our schema
export const Post = mongoose.model('post', postSchema);

```
</details>

#### Using the blog post model
 First we need to input the Post model we just created into our example.js file and update it to create and list posts:

 <details>
<summary>example.js</summary>

```js
import { initDatabase } from './db/init.js';
import { Post } from './db/models/post.js';

// await is added so that it would not try to access the DB before were connected to it
await initDatabase();

// create a blog post
const post = new Post({
    title: 'Hello Mongoose',
    author: 'Chakane Shegog',
    contents: 'This post is stored in MongoDB using Mongoose',
    tags: ['mongoose', 'mongodb']
})

await post.save();

// use a .find() function to list and log the results
const posts = await Post.find();
console.log(posts);

```
 </details>


Now when you run ```node src/example.js``` you should see a list of blog objects.


#### Defining creation and last update dates in the blog posts
Essentially we are just placing ```{timestamps: true}``` in our post.js setup

#### Developing and testing service functions
Lets start writing some tests using Jest. These will be testing the function we have created until this point.

#### Setting up the test environment

Install jest and mongodb-memory-server in your project:

```
npm install --save-dev jest@29.7.0 \mongodb-memory-server@9.1.1
```

Jest is a test runner used to define and execute unit tests. The mongodb-memory-server allows us to spin a fresh instance of a MongoDB database, storing data only in memory so that we can run our tests on a fresh database instance.

To set this up we will create a folder: ```sec/test``` and place a file called ```globalSetup.js``` which is responsible for the setup our our memory DB

<details>
<summary>globalSetup.js</summary>

```js
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
```
</details>


Then update ```init.js``` to adjust the DB URL for the memory DB

<details>
<summary>init.js</summary>

```js
import mongoose from 'mongoose';

// this will initialize DB connection
export function initDatabase() {
    const DATABASE_URL = 'process.env.DATABASE_URL';

    // add a listener to the open event on the Mongoose connection so that we can show a log message once were connected to the database
    mongoose.connection.on('open', () => {
        console.info('successfully connected to database: ', DATABASE_URL);
    })

    const connection = mongoose.connect(DATABASE_URL);
    return connection;
}
```
</details>

Now create a ```setupFileAfterEnv.js``` in our test folder

<details>
<summary>setupFileAfterEnv.js</summary>

```js
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
```
</details>

Then create a ```jest.config.json``` in the root of the project

<details>
<summary>jest.config.json</summary>

```js
{
    "testEnvironment": "node",
    "globalSetup": "<rootDir>/src/test/globalSetup.js",
    "globalTeardown": "<rootDir>/src/test/globalTeardown.js",
    "setupFileAfterEnv": ["<rootDir>/src/test/setupFileAfterEnv.js"]
}
```
</details>

Then finally edit the ```package.json``` file and add a test script: ```"test": "NODE_OPTIONS=--experimental-vm-modules jest"```

Now if we try executing ```npm test``` we can see Jest is working properly.


#### Writing our first service function: createPost
create a new file ```src/services/posts.js``` 

<details>
<summary>posts.js</summary>

```js
import { Post } from '../db/models/post.js';

// define a createPost function which takes an object with title, author, contents, and tags as arguments and returns a new post
export async function createPost({ title, author, contents, tags }) {
    const post = new Post({ title, author, contents, tags });
    return await post.save();
}
```
</details>

#### Defining test cases for the createPost service function
Create a new ```__tests___``` folder under src. In that new folder create a ```posts.test.js```

<details>
<summary>posts.test.js</summary>

```javascript
import mongoose from 'mongoose';
import { describe, expect, test } from '@jest/globals';
import { createPost } from '../services/posts.js';
import { Post } from '../db/models/post.js'

// defines a new test, it can test many functions
describe('creating posts', () => {
    test('with all parameters should succeed', async () => {
        const post = {
            title: 'Hello Mongoose!',
            author: 'Daniel Bugl',
            contents: 'This post is stored in MongoDB using mongoose memory server',
            tags: ['mongoose', 'mongodb'],
        }

        // verify a post is returned with an ID
        const createdPost = await createPost(post);
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);

        // use mongoose to find the post given the ID and check if the post has the properties we defined and timestamps
        const foundPost = await Post.findById(createdPost._id);
        expect(foundPost).toEqual(expect.objectContaining(post));
        expect(foundPost.createdAt).toBeInstanceOf(Date);
        expect(foundPost.updatedAt).toBeInstanceOf(Date);
    })

    // this second test is to check if this test fails with a post without a title
    test('without title should fail', async () => {
        const post = {
            author: 'Chakane Shegog',
            contents: 'Post with no title',
            tags: ['empty'],
        }

        try {
            await createPost(post);
        } catch (err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
            expect(err.message).toContain('`title` is required');
        }
    })

    // this test should succeed with only a title
    test('with minimal parameters should succeed', async () => {
        const post = {
            title: 'Only a title',
        }
        const createdPost = await createPost(post);
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);
    })
})
```
</details>

#### Defining a function to list posts
Now that we have defined a function to create posts, we are now going to define an internal ```listPosts``` function. This will allow us to query posts and define a sort order. The function will then be used to define ```listAllPosts```, ```listPostByAuthor```, and ```listPostsByTag```.

We will need to update the posts.js file to create the `listPosts` function

<details>
<summary>posts.js</summary>

```
import { Post } from '../db/models/post.js';

// define a createPost function which takes an object with title, author, contents, and tags as arguments and returns a new post
export async function createPost({ title, author, contents, tags }) {
    const post = new Post({ title, author, contents, tags });
    return await post.save();
}

async function listPosts(
    query = {},
    { sortBy = 'createdAt', sortOrder = 'descending' } = {},
){
    return await Post.find(query).sort({ [sortBy]: sortOrder });
}
//* The { [variable]: ... } operator resolves the string sotred in the variable to a key name for the created object

export async function listAllPosts(options) {
    return await listPosts({}, options);
}

export async function listPostByAuthor(author, options) {
    return await listPosts({author}, options);
}

export async function listPostsByTag(tags, options) {
    return await listPosts({tags}, options);
}

```
</details>

##### Defining Testcases for list posts
This will be similar to what we did for creating posts. But in this case we would need to create an initial state where we already have some posts in the DB to be able to test the list functions. This is done by using `beforeEach()`, which executes some code before each test case. `beforeEach()` is used for a whole test file OR it can be ran for each test; we will use it for our whole test file. 

Here is the updated posts.test.js file

<details>
<summary>posts.test.js</summary>

```
import mongoose from 'mongoose';
import { describe, expect, test, beforeEach } from '@jest/globals';
import { createPost, listAllPosts, listPostByAuthor, listPostsByTag } from '../services/posts.js';
import { Post } from '../db/models/post.js'

// defines a new test, it can test many functions
describe('creating posts', () => {
    test('with all parameters should succeed', async () => {
        const post = {
            title: 'Hello Mongoose!',
            author: 'Daniel Bugl',
            contents: 'This post is stored in MongoDB using mongoose memory server',
            tags: ['mongoose', 'mongodb'],
        }

        // verify a post is returned with an ID
        const createdPost = await createPost(post);
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);

        // use mongoose to find the post given the ID and check if the post has the properties we defined and timestamps
        const foundPost = await Post.findById(createdPost._id);
        expect(foundPost).toEqual(expect.objectContaining(post));
        expect(foundPost.createdAt).toBeInstanceOf(Date);
        expect(foundPost.updatedAt).toBeInstanceOf(Date);
    })

    // this second test is to check if this test fails with a post without a title
    test('without title should fail', async () => {
        const post = {
            author: 'Chakane Shegog',
            contents: 'Post with no title',
            tags: ['empty'],
        }

        try {
            await createPost(post);
        } catch (err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
            expect(err.message).toContain('`title` is required');
        }
    })

    // this test should succeed with only a title
    test('with minimal parameters should succeed', async () => {
        const post = {
            title: 'Only a title',
        }
        const createdPost = await createPost(post);
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);
    })
})


// mock data
const samplePosts = [
    {
        title: "Learning Redux", author: "Chakane", tags: ["redux"]

    },
    {
        title: "Learning React Native", author: "also Chakane", tags: ["react"]
    }, 
    {
        title: "Learning Calculus", author: "Issac Newton", tags: ["Calculus"]
    }, 
    {
        title: "Learning Redux"
    }
]

let createdSamplePosts = []

beforeEach(async () => {
    await Post.deleteMany({})
    createdSamplePosts = []
    for (const post of samplePosts) {
        const createdPost = new Post(post);
        createdSamplePosts.push(await createdPost.save());
    }
})

describe('listing posts', () => {
    test('should return all posts', async () => {
        const posts = await listAllPosts();
        expect(posts.length).toEqual(createdSamplePosts.length);
    })

    test('should return posts sorted by creation date descending by default', async () => {
        const posts = await listAllPosts();
        const sortedSamplePosts = createdSamplePosts.sort(
            (a, b) => b.createdAt - a.createdAt,
        )
        expect(posts.map(posts.map((post) => post.createdAt)).roEqual(
            sortedSamplePosts.map((post) => post.createdAt),
        ))
    })

    test('should take into account provided sorting options', async () => {
        const posts = await listAllPosts({
            sortBy: 'updatedAt',
            sortOrder: 'ascending',
        })
        const sortedSamplePosts = createdSamplePosts.sort(
            (a, b) => a.updatedAt - b.updatedAt,
        )
        expect(posts.map((post) => post.updatedAt)).toEqual(
            sortedSamplePosts.map((post) => post.updatedAt),
        )
    })

    test('should be able to filter posts by author', async () => {
        const posts = await listPostByAuthor('Chakane Shegog');
        expect(posts.length).toBe(3);
    })

    //TODO: Create a test for filtering by tag
})


```
</details>


