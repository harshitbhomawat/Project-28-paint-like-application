const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();
require('dotenv').config();


const app = express();
const PORT = process.env.PORT||5000;

// Complete details in watch later playlist.
// http://fabricjs.com/freedrawing   <-- code for drawing using fabric.



mongoose
 .connect(process.env.DATABASE,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})
 .then(() => console.log('DB Connected'));


app.use(upload.array());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.use('/', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});