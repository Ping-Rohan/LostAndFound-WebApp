const express = require("express");
const app = express();
const userRouter = require('./Routes/userRoute');
const errorController = require('./controller/errorController')
require('dotenv').config();

app.use(express.json());

app.use('/api/v1/user' , userRouter);
app.use(errorController);

module.exports = app;