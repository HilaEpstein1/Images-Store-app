import {useState, useEffect} from 'react'
import Layout from '../components/Layout';
import Router from 'next/router'
import axios from 'axios' //this is how we send requests from front to back
import {showSuccessMessage, showErrorMessage} from '../helpers/alerts'
import {API} from '../config'
import {isAuth} from '../helpers/auth'

const Register = () => {
{/*useState hook helps using state feature without a class*/}
	 const [state, setState] = useState({
	 	name: 'Hila',
	 	email: 'Hila@gmail.com',
	 	password: '11111111',
	 	error: '',
	 	success: '',
	 	buttonText: 'Register'
	 })
{/*destructuring, helps us avoid using state.name, state.buttonText etc..*/}
const {name, email, password, error, success, buttonText} = state;

useEffect(() => {							//runs everytime the app 
	isAuth() && Router.push('/');
}, []);


{/*This is a function that returns another function with parameter 'event'*/}
	 const handleChange = (name)  => (e) => {
	 	setState({...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register'})
	 };

	 const handleSubmit = async e => {
	 		 e.preventDefault()
	 		setState({...state,  buttonText: 'Registering..'});
	 		try{
		 		const response = await axios.post('http://localhost:8000/api/register', {
			 		name: name,
			 		email: email,
			 		password: password
			 		//since the name equals the argument, we could have write: name, email,password
		 		});
			 	console.log(response);
		 		setState({
		 			...state,
		 			name: '',
				 	email: '',
				 	password: '',
				 	buttonText: 'Submitted',
				 	success: response.data.message 				//as we wrote in server/controllers/auth.js line 38  
		 		});
	 		}catch (error) {
				console.log(error);
	 			setState({...state, buttonText: 'Register', error: error.response.data.error})
	 		}
	 };


	const registerForm = () => 
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Type Your Name" required/>
			</div>
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
				<h1>Register</h1>
				<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
				{registerForm()}
			</div> 
		</Layout>
	);
};

export default Register;