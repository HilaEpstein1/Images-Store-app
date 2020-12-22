import {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../../config'
import {showSuccessMessage, showErrorMessage} from '../../../helpers/alerts'
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Create = ({user, token}) =>{
	const [state, setState] = useState({
		name: '',
		content: '',
		error: '',
		success: '',
		formData: process.browser && new FormData(),			//this is a browser API 
		buttonText: 'Create',
		imageUploadText: 'Upload image'
	})

	const {name, content, error, success, formData, buttonText, imageUploadText} = state;
	
	const handleChange = (name)  => (e) => {
		const value = name === 'image' ? e.target.files[0] : e.target.value
		const imageName = name === 'image' ? e.target.files[0].name : 'Upload image'
		formData.set(name, value)
	 	setState({...state, [name]: value, error: '', success: '', imageUploadText: imageName})
	 };

	 const handleSubmit = async e => {
	 	e.preventDefault()
	 	setState({...state, buttonText: 'Creating'})
	 	// console.log(...formData);
	 	try{
	 		const response = await axios.post('http://localhost:8000/api/category', formData, {
	 			headers: {
	 				Authorization: `Bearer ${token}`
	 			}
	 		});

	 		console.log('category create rsponse', response)
	 		setState({...state, name: '', content: '', formData:'', buttonText:'Created', imageUploadText:'Upload image', success: `${response.data.name} is created`})
	 	}catch (error){
	 		console.log('category create ERROR', error)
	 		setState({...state, name: '', buttonText:'Create', error:error.response.data.error})

	 	}
	 }


	 const createCategoryform = () => (
	 	<form onSubmit={handleSubmit}>
	 		<div className= "form-group">
	 			<lable className="text-muted">Title</lable>
	 			<input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
	 		</div>
	 		<div className= "form-group">
	 			<lable className="text-muted">Description</lable>
	 			<textarea onChange={handleChange('content')} value={content}  className="form-control" required />
	 		</div>
		 	<div className= "form-group">
	 			<label className="btn btn-outline-secondary">
	 				{imageUploadText}
	 				<input onChange={handleChange('image')} type="file" accept="image/*" className="form-control" hidden />
	 			</label>	 			
	 		</div>
	 		<div>
	 			<button className="btn btn-outline-info">
	 				{buttonText}
	 			</button>
	 		</div>
	 	</form>
	 )


	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h1>Upload a Photo</h1>
					<br/>
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{createCategoryform()}
				</div>
			</div>
		</Layout>
	);

};

export default withAdmin(Create);