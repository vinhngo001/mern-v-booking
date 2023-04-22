import React from 'react';
import { signOut } from '../../redux/actions/authActions';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SignOut = () => {
	const { myauth } = useSelector(state => state);
	
	return (<div>{myauth.isSignedOut && <Redirect to='/' />}</div>)
}

export default SignOut;