import Post from '../models/Posts.model.js';
import User from '../models/User.model.js';

/* CREATE */

export const createPost = async (req, res, next) => {
  try {
    const { userId, description, imgUrl } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.imgUrl,
      imgUrl,
      likes: {},
      comments: []
    });
    await newPost.save();

    const post = await Post.find();

    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
    next(error);
  }
};

/* READ */

export const getFeedPosts = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
    next(error);
  }
};

/* UPDATE */

export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log('An error occurred liking the post:', error);
    res.status(404).json({ message: error.message });
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const { id } = req.params; // Post ID from the URL params
    const { userId, commentText } = req.body; // Comment data from the request body

    // Check if the required data exists
    if (!userId || !commentText) {
      return res
        .status(400)
        .json({ message: 'userId and commentText are required fields.' });
    }

    // Find the post by its ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create the comment object with the required data
    const newComment = {
      userId,
      comment: commentText
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post to the database
    const updatedPost = await post.save();

    // Return the updated post as a response
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log('Error adding the comment:', error);
    res.status(500).json({ message: 'Error adding the comment.' });
  }
};

/* UPLOAD */
export const UploadImg = async (req, res, next) => {
  try {
    res.json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the image' });
    next(error);
  }
};
