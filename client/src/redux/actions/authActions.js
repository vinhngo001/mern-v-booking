import axios from 'axios'
// import setAuthToken from '../utils/setAuthToken'
import { AUTH_USER, SIGN_OUT } from './types';
//axios.defaults.withCredentials = true;
// import { getDataAPI } from "../../utils/fetchData"
// Check user and load user
export const loadUser = () => {
	const dispatchLoadUser = async dispatch => {
		var config = {
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:5002',
				'Access-Control-Allow-Credentials': true
			}
		};

		try {
			//console.log(document.cookie);
			// const response = await getDataAPI('auth/authorize');
			const response = await axios.get('http://localhost:3000/', {
				withCredentials: true,
				config
			}); // Add config o cuoi neu uncomment dong ben tren
			// console.log(response.data);
			dispatch({
				type: AUTH_USER,
				payload: response.data
			});
		} catch (error) {
			console.log(error);
			alert(error?.response?.data || error);
		}
	};

	return dispatchLoadUser;
};

// Sign user out
export const signOut = () => {
	console.log('sign out action received');
	const dispatchSignOut = dispatch => {
		axios.get('http://localhost:3000/authorize/signout');
		dispatch({
			type: SIGN_OUT
		});
	};

	return dispatchSignOut;
};
