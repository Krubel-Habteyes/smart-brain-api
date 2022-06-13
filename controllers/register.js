
const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);

	// validating if we have a email, name, and password
	if(!email || !name || !password){
		return res.status(400).json('incorrect form submission')
	}

	// setting up  a transaction to save the login email into the login table and the users table
	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into("login") // insert email and hashed password into login table
			.returning("email") // taking the same email to save in a different table
			.then((loginEmail) => {
				return trx("users") // insert new info into the users table
					.returning("*")
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit) // if successful, commit the transaction
			// if not successful, don't insert any of the data into any of the tables
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
    handleRegister: handleRegister
}