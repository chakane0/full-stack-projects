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

