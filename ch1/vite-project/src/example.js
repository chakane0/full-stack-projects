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

const createdPost = await post.save();
await Post.findByIdAndUpdate(createdPost._id, {
    $set: { title: 'Hello, again!!!!!!' },
})

