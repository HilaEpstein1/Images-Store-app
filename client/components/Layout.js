import * as React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import {isAuth, logout} from '../helpers/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 
{/*By default it imports from node_modules. we also need a module to handle the css*/}

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()


const Layout = ({children}) =>{
    const head = () => (
		<React.Fragment>
			<link 
				rel="stylesheet"
			 	href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
			 	integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
			 	crossOrigin="anonymous"
			 />
{/*static folder(inside public folder) has the ability to be seen from any file in our project. means we do not need the full path*/}
		<link rel="stylesheet" href="/static/css/styles.css" />
		</React.Fragment>
	  );
{/*we use the Link to avoid the page from loading itself in any href link*/}
    const nav = () => (
        <ul className="nav nav-tabs bg-info">
            <li className="nav-item">
		        <Link  href="/">						
		            <a className="nav-link text-dark">
		                Home
		            </a>            
		        </Link>
            </li>
            
            {!isAuth() &&
            	<React.Fragment>
		            <li className="nav-item">
				        <Link  href="/login">
				            <a className="nav-link text-dark">
				                Login
				            </a>            
				        </Link>
		            </li>
		            <li className="nav-item">
				        <Link  href="/register">
				            <a className="nav-link text-dark">
				                Register
				            </a>            
				        </Link>
		            </li>
		        </React.Fragment>
            }


            {
            	isAuth() && isAuth().role ==='admin' && (
		            <li className="nav-item ml-auto">
				        <Link  href="/admin">
				            <a className="nav-link text-dark">
				                {isAuth().name}
				            </a>            
				        </Link>
		            </li>
            	)
            }
            {
            	isAuth() && isAuth().role ==='subscriber' && (
		            <li className="nav-item ml-auto">
				        <Link  href="/user">
				            <a className="nav-link text-dark">
				                {isAuth().name}
				            </a>            
				        </Link>
		            </li>
            	)
            }

            {isAuth() && (
            	<li className="nav-item">
		            <a onClick={logout} className="nav-link text-dark">
		                Logout
		            </a>            
            	</li>
            )}
        </ul>
    );



	return (
		<React.Fragment>
			{head()}{nav()}<div className="container pt-5 pb-5">{children}</div>
		</React.Fragment>
	);

};

export default Layout;