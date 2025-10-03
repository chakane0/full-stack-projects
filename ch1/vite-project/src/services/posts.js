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
