import cookie from 'js-cookie'
import Router from 'next/router'

//set in cookie
export const setCokkie = (key, value) => {
	if(process.browser){ //checks if im client side since next.js runs in both client and server side
		cookie.set(key,value, {
			expires: 1
		})
	}		
}

//remove from cookie
export const removeCokkie = (key) => {
	if(process.browser){ //checks if im client side since next.js runs in both client and server side
		cookie.remove(key);
	}		
}

//get from cookie such as stored token
//will be usful when we need to make request to server with auth token
export const getCookie = (key, req) => {
	// if(process.browser){ //checks if im client side since next.js runs in both client and server side
	// 	return cookie.get(key)
	// }	
		return process.browser? getCookieFromBrowser(key): getCookieFromServer(key, req);
}


export const getCookieFromBrowser = (key) => {
	return cookie.get(key);
}

export const getCookieFromServer = (key, req) => {
	if(!req.headers.cookie){
		return undefined
	}
	console.log('req.headers.cookie', req.headers.cookie);
	let token = req.headers.cookie.split(';').find(c=> c.trim().startsWith(`${key}=`));
	if(!token){
		return undefined;
	}
	let tokenValue = token.split('=')[1]
	//console.log('getCookieFromServer', tokenValue);
	return tokenValue;
}


//set in local storage
export const setLocalStorage  = (key, value) => {
	if(process.browser){ //checks if im client side since next.js runs in both client and server side
		localStorage.setItem(key, JSON.stringify(value))
	}	
}
//remove from local storage
export const RemoveLocalStorage  = (key) => {
	if(process.browser){ //checks if im client side since next.js runs in both client and server side
		localStorage.removeItem(key)
	}	
}

//authenticate use by passing data tocookie and localStorage during signin
/*we expect to receive the response for login from /pages/login line 32
next callback used to redirect the user to next page directly after saving its parameters*/
export const authenticate = (response, next) => {
	setCokkie('token', response.data.token)
	setLocalStorage('user', response.data.user)
	next()
}			


//access user info from localstorage
export const isAuth = () => {
	if(process.browser) {
		const cookieChecked = getCookie('token')
		if(cookieChecked){
			if(localStorage.getItem('user')){
				return JSON.parse(localStorage.getItem('user')) //convert again to javascript object 
			}
			else 
				return false;

		}
	}
}

export const logout = () => {
	removeCokkie('token');
	RemoveLocalStorage('user');
	Router.push('/login');
};


