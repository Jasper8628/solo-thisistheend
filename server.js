const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const dbConnection = require('./database') ;
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport');
const mongoose = require('mongoose');
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');

// Get configuration from .env
require('dotenv').config()

// Route required
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes.js')
const nomineeRoutes = require('./routes/nomineeRoutes')

//Specify ports
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(morgan('dev'))
app.engine('html', require('ejs').renderFile);
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)


// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
} else {
	app.use(express.static(path.join(__dirname, "./client/build")));
}


// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/solo-thisistheend");


// Sessions
app.use(
	session({
		secret: process.env.SECRET || 'cherry-blackie-blossoms', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ 
			mongooseConnection: dbConnection,
			// collection: 'session',
			// ttl: parseInt(1000 * 60 * 60 * 2) / 1000
		 }),
		resave: false, //required
		saveUninitialized: false, //required
		// cookie: {
		// 	sameSite: true,
		// 	secure: process.env.NODE_ENV === 'production',
		// 	maxAge: parseInt(1000 * 60 * 60 * 2)
		//   }
	})
)


// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser


// Define routes
app.use("/api/users", userRoutes);
app.use("/api", fileRoutes);
app.use("/api/nominees", nomineeRoutes);

app.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });


// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on http://localhost:${PORT}/`)
})