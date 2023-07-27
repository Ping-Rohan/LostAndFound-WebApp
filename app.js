const express = require("express");
const app = express();
const userRouter = require('./Routes/userRoute');
const lostItemRouter = require('./Routes/lostRoute');
const errorController = require('./controller/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors({origin : "*" , credentials : true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user' , userRouter);
app.use('/api/v1/lost' , lostItemRouter);
app.use(errorController);

module.exports = app;