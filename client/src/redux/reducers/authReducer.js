import { AUTH_USER, SIGN_OUT } from '../actions/types';

const initialState = {
	isAuthenticated: null,
	auth_info: {},
	isSignedOut: null
};


const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case AUTH_USER:
			if (action.payload.signInUrl) {
				return {
					...state,
					isAuthenticated: false,
					auth_info: action.payload
				}
			}
			else {
				return {
					...state,
					isAuthenticated: true,
					auth_info: action.payload
				}
			}
		case SIGN_OUT:
			return {
				...state,
				isAuthenticated: false,
				isSignedOut: true
			}

		default:
			return state;
	}
}

export default authReducer;