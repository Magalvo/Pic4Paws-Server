import Pet from '../models/Pet.model.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

/* CREATE */

export const createPet = async (req, res, next) => {
  const {
    userId,
    petDescription,
    primaryBreed,
    secondaryBreed,
    photos,
    petName,
    petType,
    tags,
    gender,
    age,
    adoptable,
    location
  } = req.body;

  console.log(photos);

  const { lat, lng } = location;

  try {
    const user = await User.findById(userId);
    const newPet = await Pet.create({
      userId,
      petName,
      petType,
      breeds: {
        primary: primaryBreed.name,
        secondary: secondaryBreed.name || null
      },
      userName: user.firstName,
      location: {
        lat,
        lng
      },
      petDescription,
      userPicturePath: user.imgUrl,
      photos: photos || [],
      profilePicture:
        photos[0] ||
        'https://res.cloudinary.com/djeainpxh/image/upload/v1689413285/Pic4Paws/rqw6md6s19u4bnccmt84.png',
      tags: tags || [],
      gender,
      age,
      adoptable: Boolean(adoptable),
      likes: {},
      comments: []
    });

    res.json({
      petName: newPet.petName,
      firstName: newPet.petType,
      profilePicture: newPet.profilePhoto,
      _id: newPet._id
    });
  } catch (error) {
    console.log('An error ocurred creating a new project', next(error));
  }
};

/* EDIT */

export const updatePet = async (req, res, next) => {
  const { id } = req.params;
  const {
    petDescription,
    photos,
    petName,
    petType,
    breeds,
    tags,
    gender,
    age
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const updatedPet = await Project.findByIdAndUpdate(
      id,
      {
        petDescription,
        photos: photos,
        petName,
        petType,
        breeds,
        tags: tags || [],
        gender,
        age
      },
      {
        new: true // We need to pass this to receive the updated values
      }
    );

    if (!updatedPet) {
      return res
        .status(404)
        .json({ message: 'No project found with specified id' });
    }

    res.json(updatedPet);
  } catch (e) {
    console.log('An error occurred when updating the project', e);
    next(e);
  }
};

/* READ */

export const getPets = async (req, res, next) => {
  try {
    const allPets = await Pet.find();
    res.json(allPets);
  } catch (e) {
    console.log('An error ocurred', e);
    next(e);
  }
};

export const getPet = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'No Pet Found with that ID' });
    }

    res.json(pet);
  } catch (e) {
    console.log('An error occurred retrieving your specific pet', e);
    next(e);
  }
};

export const likePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const pet = await Pet.findById(id);
    const isLiked = pet.likes.get(userId);

    if (isLiked) {
      pet.likes.delete(userId);
    } else {
      pet.likes.set(userId, true);
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      { likes: pet.likes },
      { new: true }
    );

    res.status(200).json(updatedPet);
  } catch (error) {
    console.log('An error occurred liking the post:', error);
    res.status(404).json({ message: err.message });
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'specified id is not valid' });
    }

    await Pet.findByIdAndDelete(id);
    res.json({ message: `Project with id ${id} was deleted successfully ` });
  } catch (e) {
    console.log('An error occurred deleting the project', e);
    next(e);
  }
};

/* UPLOAD */
export const UploadImg = (req, res, next) => {
  try {
    res.json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the image' });
    next(error);
  }
};
