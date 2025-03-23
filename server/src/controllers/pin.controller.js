import Pin from '../models/pin.model.js';
import sharp from 'sharp';
import User from '../models/user.model.js';
import Imagekit from 'imagekit';
import jwt from 'jsonwebtoken';
import Like from '../models/like.model.js';
import Save from '../models/save.model.js';

export const getPins = async (req, res) => {
  try {
    const pageNumber = Number(req.query.cursor) || 0;
    const search = req.query.search;
    const userId = req.query.userId;
    const baordId = req.query.baordId;

    console.log(baordId);

    const LIMIT = 21;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            {
              tags: { $in: [search] },
            },
          ],
        }
      : userId
      ? { user: userId }
      : baordId
      ? { board: baordId }
      : {};

    const pins = await Pin.find(query)
      .limit(LIMIT)
      .skip(pageNumber * LIMIT);

    const hasNextPage = pins.length === LIMIT;

    res
      .status(200)
      .json({ pins, nextCursor: hasNextPage ? pageNumber + 1 : null });
  } catch (error) {
    console.log('Error in getPins', error.message);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getPin = async (req, res) => {
  const { id } = req.params;
  const pin = await Pin.findById(id).populate(
    'user',
    'username img displayName'
  );

  console.log(pin);

  res.status(200).json(pin);
};

export const createPin = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      tags,
      board,
      textOptions,
      canvasOptions,
    } = req.body;
    const user = req.userId;

    const media = req.files.media;

    if (!title || !description || !link || !tags || !board || !media) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }

    const parsedTextOptions = JSON.parse(textOptions);
    const parsedCanvasOptions = JSON.parse(canvasOptions);

    const metadata = await sharp(media.data).metadata();
    console.log(parsedCanvasOptions);

    const originalOrientation =
      metadata.width > metadata.height ? 'landscape' : 'portrait';

    const originalAspectRatio = metadata.width / metadata.height;

    let clientAspectRatio;
    let width;
    let height;

    if (parsedCanvasOptions.size !== 'Original') {
      clientAspectRatio =
        parsedCanvasOptions.size.split(':')[0] /
        parsedCanvasOptions.size.split(':')[1];
    } else {
      parsedCanvasOptions.orientation === originalAspectRatio
        ? (clientAspectRatio = originalAspectRatio)
        : (clientAspectRatio = 1 / originalAspectRatio);
    }

    width = metadata.width;
    height = metadata.height / clientAspectRatio;

    const imagekit = new Imagekit({
      publicKey: 'public_psPkVUEtpqpEnlK7Q1TWWOGeeUg=',
      privateKey: 'private_XxuKSw4LzJoxSQxkUuzc6rTPWoI=',
      urlEndpoint: 'https://ik.imagekit.io/1zd5xlacjp',
    });

    const textLeftPosition = Math.round((parsedTextOptions.left * width) / 375);
    const textTopPosition = Math.round(
      (parsedTextOptions.top * height) / parsedCanvasOptions.height
    );

    // const transformationString = `w-${width},h-${height}${
    //   originalAspectRatio > clientAspectRatio ? ",cm-pad_resize" : ""
    // },bg-${parsedCanvasOptions.backgroundColor.substring(1)}${
    //   parsedTextOptions.text
    //     ? `,l-text,i-${parsedTextOptions.text},fs-${
    //         parsedTextOptions.fontSize * 2.1
    //       },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
    //         1
    //       )},l-end`
    //     : ""
    // }`;

    // FIXED TRANSFORMATION STRING

    let croppingStrategy = '';

    if (parsedCanvasOptions.size !== 'original') {
      if (originalAspectRatio > clientAspectRatio) {
        croppingStrategy = ',cm-pad_resize';
      }
    } else {
      if (
        originalOrientation === 'landscape' &&
        parsedCanvasOptions.orientation === 'portrait'
      ) {
        croppingStrategy = ',cm-pad_resize';
      }
    }

    const transformationString = `w-${width},h-${height}${croppingStrategy},bg-${parsedCanvasOptions.backgroundColor.substring(
      1
    )}${
      parsedTextOptions.text
        ? `,l-text,i-${parsedTextOptions.text},fs-${
            parsedTextOptions.fontSize * 2.1
          },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
            1
          )},l-end`
        : ''
    }`;

    imagekit
      .upload({
        file: media.data,
        fileName: media.name,
        folder: 'test',
        transformation: {
          pre: transformationString,
        },
      })
      .then(async (response) => {
        const newPin = await Pin.create({
          user: req.userId,
          title,
          description,
          link: link || null,
          board: board || null,
          tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
          media: response.url,
          width: response.width,
          height: response.height,
        });
        console.log(newPin);
        console.log(response);
        return res.status(201).json(newPin);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          message: 'Internal server error',
        });
      });
  } catch (error) {
    console.log('Error in createPin', error.message);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const interactionCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.token;

    const likeCount = await Like.countDocuments({ pin: id });

    if (!token) {
      return res
        .status(200)
        .json({ likeCount, isLiked: false, isSaved: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res
          .status(200)
          .json({ likeCount, isLiked: false, isSaved: false });
      }

      const userId = payload.userId;

      const isLiked = await Like.findOne({
        user: userId,
        pin: id,
      });
      const isSaved = await Save.findOne({
        user: userId,
        pin: id,
      });

      console.log({
        likeCount,
        isLiked: isLiked ? true : false,
        isSaved: isSaved ? true : false,
      });

      return res.status(200).json({
        likeCount,
        isLiked: isLiked ? true : false,
        isSaved: isSaved ? true : false,
      });
    });
  } catch (error) {
    console.log('Error in interactionCheck', error.message);
    res.status(500).json({
      message: 'Internal server error in interactionCheck',
    });
  }
};

export const interact = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (type === 'like') {
    const like = await Like.findOne({ user: req.userId, pin: id });

    if (like) {
      await Like.findByIdAndDelete(like._id);
    } else {
      await Like.create({ user: req.userId, pin: id });
    }
  }

  if (type === 'save') {
    const save = await Save.findOne({ user: req.userId, pin: id });

    if (save) {
      await Save.findByIdAndDelete(save._id);
    } else {
      await Save.create({ user: req.userId, pin: id });
    }
  }

  res.status(200).json({ message: 'Success' });
};
