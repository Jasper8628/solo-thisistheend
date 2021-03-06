const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
const passport = require('../passport');
var bcrypt = require('bcryptjs');
const auth = require('../service/auth');
const cors = require('cors');
require('dotenv').config();

router.use(cors());


// signup api route. check for existence of username, if not proceed to create user
router.post('/signup', (req, res) => {
  console.log('user signup');

  const { username, email, password } = req.body

  // ADD VALIDATION
  if (!username || !email || !password) {
    res.status(400).json({
      message: 'Please enter all fields.'
    })
  } else {
    User.findOne({
      email: email
    }, (err, user) => {
      if (err) {
        console.log('userRoutes.js post error: ', err)
      } else if (user) {
        console.log(`Sorry, an account with email: ${email} already exists`)
        res.status(400).json({
          message: `Sorry, an account with email: ${email} already exists`
        })
      } else {
        const newUser = new User({
          username: username,
          email: email,
          password: password
        })
        newUser.save((err, user) => {
          if (err) return res.json({err: err, msg: 'signup is not working' })
          console.log('user account created')
          //jwt payload
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 2592000 },
            (err, token) => {
              if (err) throw err;
              console.log(token)
              res.send({
                token,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  success: true,
                  mes: 'user account created'
                }
              })
            }
          )

        })
      }
    })
  }

})

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the gameover page.
router.post(
  '/login',
  passport.authenticate('local'),

  (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
      console.log('Please enter all fields.')
      res.status(400).json({
        message: 'Please enter all fields.'
      })

    } else {

      console.log('logged in', req.user);
      // var userInfo = {
      //   id: req.user._id,
      //   email: req.user.email,
      //   username: req.user.username,
      //   success: true,
      //   mes: 'user successfully logged in'
      // };

      //jwt payload
      jwt.sign(
        { id: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: 2592000 },
        (err, token) => {
          if (err) throw err;
          console.log(token)
          res.send({
            token,
            user: {
              id: req.user.id,
              username: req.user.username,
              email: req.user.email,
              success: true,
              mes: 'user successfully logged in'
            }
          })
        }
      )
    }
  }
)

router.get('/account/:id', auth, (req, res) => {
  
  console.log(req.token)
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
      return;
    } else {
      User.findById(req.params.id)
        .select('-password')
        .then(user => {
          res.send({
            user: user,
            authData: authData,
            message: 'user found',
            success: true
          })
        })
    }
  })
})

// Route for editing myAccount username and password - to be set up later

// router.post('/account', function (req, res) {

//   var hashedpassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
//   email = req.body.email.toLowerCase();
//   User.update({
//     email: email,
//     password: hashedpassword
//   },
//     {
//       where: {
//         username: req.user.username
//       }
//     })
//     .then(function (data) {
//       // var object = {
//       //   users: data
//       // }
//       res.json({ user: data })
//     })
//     .catch(function (err) {
//       console.log(err)
//     })
// });



router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    console.log('logout successful')
    res.send({
      success: true,
      msg: 'logging out'
    })
  } else {
    res.send({ msg: 'no user to log out' })
  }
})



module.exports = router