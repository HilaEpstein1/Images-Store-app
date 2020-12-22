import {useState, useEffect} from 'react'
import Layout from '../components/Layout';
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios' //this is how we send requests from front to back
import {showSuccessMessage, showErrorMessage} from '../helpers/alerts'
import {API} from '../config'
import {authenticate, isAuth} from '../helpers/auth'

const Login = () => {
{/*useState hook helps using state feature without a class*/}
	 const [state, setState] = useState({
	 	email: 'react.node.aws1.test@gmail.com',
	 	password: '11111111',
	 	error: '',
	 	success: '',
	 	buttonText: 'Login'
	 })

useEffect(() => {	//runs everytime the app comes up. basically check if there are cookies which means we have loggedin
	isAuth() && Router.push('/');
}, []);

/*destructuring, helps us avoid using state.name, state.buttonText etc..*/
const {email, password, error, success, buttonText} = state;

/*This is a function that returns another function with parameter 'event'*/
	 const handleChange = (name)  => (e) => {
	 	setState({...state, [name]: e.target.value, error: '', success: '', buttonText: 'Login'})
	 };

	 const handleSubmit = async e => {
	 		 e.preventDefault()
	 		setState({...state,  buttonText: 'Logging in..'});
	 		try{
		 		const response = await axios.post('http://localhost:8000/api/login', {
			 		email: email,
			 		password: password
			 		//since the name equals the argument, we could have write: name, email,password
		 		});
			 	// console.log(response);		//prints the response returned from post to login server page (controllers/auth/line 125)
	 			authenticate(response, () => isAuth() && isAuth().role === 'admin' ? Router.push('/admin/category/create') : Router.push('/user'));
	 			//The app start by default from index.js page. since we put our user and admin pages undes /user/index.js and /admin/index.js, thats what is rendered to screen

	 		}catch (error) {
				console.log(error);
	 			setState({...state, buttonText: 'Login', error: error.response.data.error})
	 		}
	 };
	 

{/*with value field we make sure that the value presented is the one stored in the state*/}
	const LoginForm = () => 
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type Your Email" required/>
			</div>
			<div className="form-group">
				<input value={password} onChange={handleChange('password')} type="Password" className="form-control" placeholder="Type Your Password" required/>
			</div>
			<div className="form-group">
				<button className="btn btn-outline-info">{buttonText}</button>
			</div>
		</form>

{/*JSON.stringify(state) prints the current state state*/}
	return(
		<Layout>
			<div className = "col-md-6 offset-md-3">
				<h1>Login</h1>
				<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
				{LoginForm()}
			</div> 
		</Layout>
	);
};

export default Login;