const Clarifai = require("clarifai");
const { response } = require("express");

// moving our API Key to the backend for better security
const app = new Clarifai.App({
	apiKey: "97096f877c394cdcb36eb1bc6401dd29",
});

//
const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		// if successful reply with the data in JSON format
		.then((data) => res.json(data))
		// if there is an error send this
		.catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db("users")
		.where("id", "=", id) // given id needs to match id in the database
		.increment("entries", 1) // updating entries by 1 
		.returning("entries")
		//putting our data in JSON format to send to the front end
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
	handleImage,
	handleApiCall,
};
