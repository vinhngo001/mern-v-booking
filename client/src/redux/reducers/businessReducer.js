import {
	ADD_BUSINESS,
	GET_BUSINESSES,
	GET_ONE_BUSINESS,
	DELETE_BUSINESS,
	EDIT_BUSINESS
} from '../actions/types';

const initialState = {
	success_add_business: false,
	success_edit_business: false,
	businesses: []
};

const businessReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_BUSINESS:
			return {
				...state,
				success_add_business: true
			}

		case GET_BUSINESSES:
			return {
				...state,
				businesses: [...state.businesses,  ...action.payload]
			}

		case GET_ONE_BUSINESS:
			return {
				...state
			}

		case DELETE_BUSINESS:
			return {
				...state,
			}

		case EDIT_BUSINESS:
			return { ...state }

		default:
			return state
	}
}


export default businessReducer;