import axios from "axios";
import { CLIENT_GET_BUSINESSES, CLIENT_GET_FREE_SLOTS } from "./types";

export const clientGetBusinesses = (email) => async (dispatch) => {
    try {
        const res = await axios.get(
            `http://localhost:3000/events/${email}`
        );
        console.log(res.data.event)
        dispatch({
            type: CLIENT_GET_BUSINESSES,
            payload: {businesses: res.data.event.businesses}
        });
    } catch (error) {
        console.log(error.response);
    }
}
export const getFreeSlots = (services_data) => async (dispatch) => {
    try {
        const response = await axios.post(
            'http://localhost:3000/events/getdays',
            services_data
        );

        dispatch({
            type: CLIENT_GET_FREE_SLOTS,
            payload: response.data.days
        });
    } catch (error) {
        console.log(error.response);
    }
}
export const sendBooking = () => {
    try {

    } catch (error) {
        console.log(error.response);
    }
}
