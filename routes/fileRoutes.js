const express = require('express')
const router = express.Router()
// const User = require('../database/models/user')
// const passport = require('../passport')
// var bcrypt = require('bcryptjs')
const cors = require('cors')

router.use(cors());

// file upload route for gameover page
// router.post('/upload', function(req, res) {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }
  
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     let sampleFile = req.files.sampleFile;
  
//     // Use the mv() method to place the file somewhere on your server
//     sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
//       if (err)
//         return res.status(500).send(err);
  
//       res.send('File uploaded!');
//     });
//   });


module.exports = router