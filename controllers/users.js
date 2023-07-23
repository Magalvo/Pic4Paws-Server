import User from '../models/User.model.js';
import mongoose from 'mongoose';

/* READ */
export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
    next(error);
  }
};

export const findByEmail = async (req, res, next) => {
  const { userEmail } = req.body;

  const user = await User.findOne({ userEmail });

  res.json({
    email: user.email,
    firstName: user.firstName,
    _id: user._id
  });
};

export const getUserFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    const friends = await Promise.all(
      user.friends.map(id => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, imgUrl }) => {
        return { _id, firstName, lastName, occupation, location, imgUrl };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
    next(error);
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter(id => id !== friendId);
      friend.friends = user.friends.filter(id => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map(id => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, imgUrl }) => {
        return { _id, firstName, lastName, occupation, location, imgUrl };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
    next(error);
  }
};
