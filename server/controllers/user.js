exports.read = (req, res) => {
	req.profile.hashed_password = undefined; 		//we dont want to expose this data 
	req.profile.salt = undefined;
	return res.json(req.profile);
};

