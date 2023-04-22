import axios from "axios";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";
import {
	ADD_BUSINESS,
	GET_BUSINESSES,
	DELETE_BUSINESS,
	GET_ONE_BUSINESS,
	EDIT_BUSINESS
} from './types';

export const addBusiness = (business_data) => async (dispatch) => {
	try {
		const res = await axios.post('http://localhost:3000/business/create', business_data);
		dispatch({ type: ADD_BUSINESS, payload: res.data.business });
	} catch (error) {
		console.log(error);
	}
}
export const getBusinesses = (email) => async (dispatch) => {
	try {
		const res = await axios.post('http://localhost:3000/business', { email: email });
		dispatch({
			type: GET_BUSINESSES,
			payload: res.data.businesses
		});
	} catch (error) {
		console.log(error);
	}
}

export const getOneBusiness = id => async (dispatch) => {
	try {
		const one_business = await getDataAPI(
			`business/edit/${id}`
		);

		dispatch({
			type: GET_ONE_BUSINESS,
			payload: one_business.data
		});
	} catch (error) {
		console.log(error.message);
	}
}

export const editBusiness = (business_data) => async (dispatch) => {
	try {

	} catch (error) {
		console.log(error);
	}
}