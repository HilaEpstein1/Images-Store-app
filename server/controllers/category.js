const Category = require('../models/category')
const slugify = require('slugify')
const formidable = require('formidable')
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
const fs = require('fs')

//s3
const s3 = new AWS.S3({
	accessKeyId:process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
	region:process.env.AWS_REGION
})



// exports.create = (req,res) => {
// 	const {name, content} = req.body
// 	const slug = slugify(name);
// 	const image = {
// 		url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
// 		key: '123'
// 	};


// 	const category = new Category({name, slug, image})
// 	category.postedBy = req.user._id 			//we can use user since in the validator we validated that the user is signed in

// 	category.save((err,data) => {
// 		if(err){
// 			console.log('category create ERR', err)
// 			return res.status(400).json({
// 				error:'category create FAILED'
// 			})
// 		}
// 		res.json(data);
// 	})
// }

exports.create = (req, res) => {
	let form = new formidable.IncomingForm()
	form.parse(req, (err, fields, files) => {
		if(err){
			return res.status(400).json({
				error: "Image could not upload"
			})
		}
		// console.table({err, fields, files});
		const {name, content} = fields
		const {image} = files
		const slug = slugify(name)

		let category = new Category({name, content, slug})
		if (image.size > 2000000){
			return res.status(400).json({
				error: "Image cshould be less than 2MB"
			})
		}

		//upload image to s3
		const params = {
			Bucket: 'hila-ep-app',
			Key: `category/${uuidv4()}`,
			Body: fs.readFileSync(image.path),			//make sure the file opens and gets read before uploading it
			ACL: 'public-read',
			contentType: `image/jpg`
		}

		s3.upload(params, (err, data) => {
			if(err) {
				console.log(err);
				res.status(400).json({error: 'Upload to s3 failed'})
			}
			console.log('AWS UPLOAD RES DATA', data)
			category.image.url = data.Location
			category.image.key = data.Key


			//save to DB
			category.save((err, success) => {
				if(err) 
				{
					console.log(err);
					res.status(400).json({error: 'Duplicate category'})
				}
				return res.json(success)
			});
		});


	})
}


exports.list = (req,res) => {
	Category.find({}).exec((err, data) =>{
		if(err) {
			return res.status(400).json({
				error: 'Categories could not load'
			});
		}
		res.json(data);
	});
};

exports.read = (req,res) => {
	
}

exports.update = (req,res) => {
	
}

exports.remove = (req,res) => {
	
}