import mongoose,  { Schema } from 'mongoose';


// specifies all properties of a blog post
const postSchema = new Schema({
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
},
    { timestamps: true}
)

// create a Mongoose model based off our schema
export const Post = mongoose.model('post', postSchema);