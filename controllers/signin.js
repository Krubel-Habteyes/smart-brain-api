const handleSignin = (db, bcrypt) => (req, res) => {

	const {email, password} = req.body;

	// validating if we have a email, name, and password
	if (!email || !password) {
		return res.status(400).json("incorrect form submission");
	}

	db.select("email", "hash")
		.from("login")
		.where("email", "=", email) // check email first
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash); // check if the password is correct
			if (isValid) {
				return (
					db
						.select("*")
						.from("users")
						.where("email", "=", email)
						.then((user) => {
							res.json(user[0]);
						})
						// send an error due to a technical issue
						// user had the right credentials
						.catch((err) => res.status(400).json("unable to get user"))
				);
			} else {
				res.status(400).json("wrong credentials"); // send error if the password is wrong
			}
		})
		.catch((err) => res.status(400).json("wrong credentials")); // send error if the email is wrong
};

module.exports = {
	handleSignin: handleSignin,
};
