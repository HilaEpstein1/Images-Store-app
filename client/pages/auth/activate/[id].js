import {useState, useEffect} from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {showSuccessMessage, showErrorMessage} from '../../../helpers/alerts'
import {withRouter} from 'next/router'
import {API} from '../../../config'
import Layout from '../../../components/Layout'

const ActivateAccount = ({router}) =>{
	const [state, setState] = useState({
		name: '',
		token: '',
		buttonText: 'Activate account',
		success: '',
		error: ''
	})

	const {name, token, buttonText, success, error} = state

	useEffect (() => {							//this function runs by default when component mounts
		let token = router.query.id
		if(token) {
			const {name} = jwt.decode(token)
			setState({...state, name, token}) //same as serState({...state, name:name, token:token})
		}
	}, [router]);									//now this function runs when the router changes

	const clickSubmit = async e => {
		e.preventDefault();
		// console.log('activate accout');
		setState({...state, buttonText:'Activating'});

		try{
			const response = await axios.post('http://localhost:8000/api/register/activate', {token});
			// console.log('account activate response', response)
			setState({...state, name: '', token: '', buttonText:'Activating', success: response.data.message});
		}catch(error){
			setState({...state, buttonText:'Activate account', error: error.response.data.message});


		}
	}

	return <Layout>
		<div className="row">
			<div className="col-md-6 offset-md-3">
				<h1>Hi {name}! Ready to activate your account?</h1>
				<br/>
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				<button className="btn btn-outline-warning btn-block" onClick={clickSubmit}> {buttonText}</button> 
			</div>
		</div>
	</Layout>
};


export default withRouter(ActivateAccount);