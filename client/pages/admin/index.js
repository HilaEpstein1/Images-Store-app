import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({user}) => <Layout> 

	<h1>Admin Dashboard</h1>
	<br/>
	<div className="row">
		<div className="col-md-4">
			<ul className="nav-flex-column">
				<li className="nav-item">
					<Link href="/admin/category/create">
						<a className="nav-link">Upload Image</a>
					</Link>
				</li>
			</ul>
		</div>
	</div>
 </Layout>;

export default withAdmin(Admin);