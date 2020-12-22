exports.registerEmailParams = (email,token) => {
		return {
		Source: process.env.EMAIL_FROM, //the admin email
		Destination:{
			ToAddresses: [email]		//array since it could be many addresses
		},
		ReplyToAddresses: [process.env.EMAIL_TO],			//if we want the use to be able to reply
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data:`
						<html>
							<h1>Verify your email address</h1>
							<p>Please use the following link to complete your registration: </p>
							<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
						</html>
					`
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Complete your registration'
			}
		}
	};
}

