import Layout from '../components/Layout';
import axios from 'axios'
import {API} from '../config'
import Link from 'next/link'

const Home = ({categories}) => {
	
	const listCategories = () => categories.map((c, i) => {
		return 	(
			<Link href={c.image.url}>
					<a style={{border: '2px solid grey'}} className="bg-light p-4 col-md-4">
						<div>
								<div className="row">
									<div className="row-md-4">
										
										<img src={c.image && c.image.url} alt={c.name} style={{width: '100%', height: '100%'}}  className="pr-3" class="center"/>
									</div>
									<div className="row-md-8">
										<h7>Clink to download {c.name}</h7>
									</div>
								</div>
						</div>
					</a>
			</Link>
		)
	})

	return (
		<Layout> 
		<div className="row">
			<div className="col-md-12">
				<h1 className="font-weight-bold">List of photos</h1>
				<br/>	
			</div>
		</div> 

		<div className="row">{listCategories()}</div> 
	</Layout>
	);
};


Home.getInitialProps = async() => {
	const response = await axios.get('http://localhost:8000/api/categories');
	return {
		categories:response.data
	};
}

export default Home;