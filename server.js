const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK.replace("<PASSWORD>" , process.env.DB_PASSWORD)).then((url) => {
    console.log('Database connected successfully');
})


app.listen(process.env.PORT , () => {
    console.log(`server is running on port ${process.env.PORT} `);
})