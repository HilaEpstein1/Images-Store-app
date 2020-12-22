import Layout from '../../components/Layout';
import withUser from '../withUser'

const User = ({user}) => <Layout> {JSON.stringify(user)} </Layout>; 		//withUser returns user & token



export default withUser(User);