import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux"
import { Jumbotron, Button, Container } from 'reactstrap';
import { loadUser } from '../../redux/actions/authActions';
const Landing = () => {
	const { myauth } = useSelector(state => state);
	const dispatch = useDispatch();
	
	useEffect(() => {
		dispatch(loadUser());
	}, [dispatch]);
	
	return (
		<div>
			<Jumbotron>
				<Container>
					<h1 className='display-3'>V Booking</h1>
					<p className='lead'>Create and manage appointments is easy</p>
					<hr className='my-2' />
					{myauth.isAuthenticated && (
						<h2>Welcome {myauth.auth_info.user}</h2>
					)}
					<p className='lead'>
						{!myauth.isAuthenticated && (
							<Button color='primary' className='text-white'>
								<a
									href={myauth.auth_info.signInUrl}
									style={{ color: 'white', textDecoration: 'none' }}
								>
									<i className='fab fa-microsoft mr-2'></i>
									Login with Microsoft
								</a>
							</Button>
						)}
					</p>
				</Container>
			</Jumbotron>
		</div>
	)
}

export default Landing
