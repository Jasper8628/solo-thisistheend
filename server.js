const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const dbConnection = require('./database') ;
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport');
const mongoose = require('mongoose');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require("path");



// Route requires
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes.js')

const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)

//Express-fileupload default options
app.use(fileUpload());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname, "./client/build"));
} else {
	app.use(express.static(path.join(__dirname, "./client")));
}


// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/solo-thisistheend");


// Sessions
app.use(
	session({
		secret: process.env.SECRET || 'cherry-blackie-blossoms', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
)


// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser


// Routes
app.use("/api/users", userRoutes);
app.use("/api", fileRoutes);

app.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });

// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on http://localhost:${PORT}/`)
})