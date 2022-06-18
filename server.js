// const { request } = require("express");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { response } = require("express");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// const db = knex({
// 	client: "pg",
// 	connection: {
// 		host: "postgresql-clean-84356",
// 		port: 5433,
// 		user: "postgres",
// 		password: "",
// 		database: "smart-brain",
// 	},
// });

// db.select("*")
// 	.from("users")
// 	.then((data) => {
// 		console.log(data);
// 	});

const db = knex({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

const app = express();
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
// 	res.send("success");
// });

app.post("/signin", signin.handleSignin(db, bcrypt)); // advanced way of writing the function

app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt); // I prefer this because it is explicit
});

app.post("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.get("/", (req, res) => {
	res.send("it is working");
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
