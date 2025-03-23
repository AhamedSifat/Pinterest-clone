import express from 'express';
import userRouter from './src/routes/user.route.js';
import pinRouter from './src/routes/pin.route.js';
import commentRouter from './src/routes/comment.route.js';
import boardRouter from './src/routes/board.route.js';
import { connectDB } from './src/utils/connectDb.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5176',
      'http://localhost:5175',
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(fileUpload());

app.use('/users', userRouter);
app.use('/pins', pinRouter);
app.use('/comments', commentRouter);
app.use('/boards', boardRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('server is running');
});
