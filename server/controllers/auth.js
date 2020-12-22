const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const {registerEmailParams} = require('../helpers/email');
const shortId = require('shortid')

AWS.config.update({
	accessKeyId:process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
	region:process.env.AWS_REGION
});

const ses = new AWS.SES({apiVersion: '2010-12-01'}); //copied from the official docs


//this method is the callback we use for each register request
exports.register = (req, res) => {
	//console.log('REGISTER CONTROLLER', req.body);
	const {name, email, password} = req.body

	//check if user exists in our database
	User.findOne({email}).exec((err,user)=> { //findOne stops as soon as it finds the specific one based on email. since field name is equal then the long version is User.findOne({email:email})
		if(user) {
			console.log(err)
			return res.status(400).json({
				error: 'Email is taken'
			})
		}
		//generate token with user name email and password
		const token = jwt.sign({name, email, password},  process.env.JWT_ACCOUNT_ACTIVATION, {
			expiresIn: '10m'
		});

		//send email
		const params = registerEmailParams(email,token);	

		const sendEmailOnRegister = ses.sendEmail(params). promise()
		
		sendEmailOnRegister
		.then(data => {
			console.log('email submitted to SES', data);
			res.json({
				message: `Email has been sent to ${email}. Follow the instructions to complere your registration`
			});
		})
		.catch( error => {
			console.log('ses email on register', error);
			res.json({
				message: `we could not verify your email, please try again!`
			});
		});


	});		


};



exports.registerActivate = (req,res) => {
	const {token} = req.body;
	// console.log(token);
	
	//check expiry
	jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){ //we need to pass verify the secret token
		if(err){
			return res.status(401).json({
				error: 'Expired link. Try again'
			})
		}

		//check if this user is already in use
		const {name, email, password} = jwt.decode(token)

		//generate unique username for our database
		const username = shortId.generate();

		User.findOne({email}).exec((err,user)=>{
			if(user){
				return res.status(401).json({
					error: 'Email is taken'
				})
			}
			// register new user
			const newUser = new User({username, name, email, password})
			newUser.save((err, result) => {
				if( err) {
					return res.status(401).json({
						error: 'Error saving use in data base. try later'
					})	
				}
				return res.json ({
					message: 'Registration succes. please login.'
				});
			});

		});
	});		

};


exports.login = (req, res) => {
	const {email, password} = req.body;
	// console.table({email,password});

	//lets try to find a user with that email in our DB
	User.findOne({email}).exec((err,user)=> {
		if(err || !user){
			return res.status(400). json ({
				error: 'User with that email does not exist. Please register'
			})
		}
		//authenticate is pard of User scehma under models/user
		if(!user.authenticate(password)){		//checks if the given password is the password saved in the User database
			return res.status(400). json ({
					error: 'Email and password do not match'
				})
		}
		//generate token and send to client
		const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
		const {_id, name, email, role} = user

		return res.json({
			token,
			user: {_id, name, email, role}
		})
	})
};



exports.requireSignin = expressJwt({secret: process.env.JWT_SECRET, algorithms: ['sha1', 'RS256', 'HS256']});

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({_id: authUserId}).exec((err, user) => {
		if(err || !user){
			console.log(err)
			return res.status(400).json({
				error: "User not found"
			})
		}
		req.profile = user
		next()
	})
}

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id
	User.findOne({_id: adminUserId}).exec((err, user) => {
		if(err || !user){
			console.log(err)
			return res.status(400).json({
				error: "User not found"
			})
		}
		if(user.role !== 'admin')
		{
			return res.status(400).json({
				error: "Admin resource. Access denied"
			})
		}
		req.profile = user
		next()
	})
}