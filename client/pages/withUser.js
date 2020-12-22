import axios from 'axios'
import {API} from '../config'
import {getCookie} from '../helpers/auth'


const withUser = Page => {
	const WithAuthUser = props => <Page {...props} />
	WithAuthUser.getInitialProps = async context => { //getInitialProps runs in both server and client sides!
		const token = getCookie('token', context.req);
		let user = null;

		if(token) {
			try{
				const response = await axios.get('http://localhost:8000/api/user', {
					headers: {
						authorization: `Bearer ${token}`,
						contentType: 'application/json'
					}
				})
				user = response.data // this is what returns from the user controller (//controllers/user)
			} catch(error){
				if(error.response.status === 401)
				{
					user = null 
				}
			}
		}

		if(user === null){
			context.res.writeHead(302, {
				Location: '/'
			})
			context.res.end()
		} else{
			return {
				...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
				user,
				token
			}
		}
	}
	return WithAuthUser;
};

export default withUser;