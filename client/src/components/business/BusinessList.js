import React, { useEffect } from "react";
import { getBusinesses, deleteBusiness } from '../../redux/actions/businessActions';
import { loadUser } from '../../redux/actions/authActions';
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Container, Table } from "reactstrap";
const BusinessList = () => {
    const { myauth, mybusiness } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    // const onDeleteClick = () => {

    // }
    useEffect(() => {
        dispatch(getBusinesses(myauth.auth_info.email))
    }, [myauth.auth_info.email, dispatch])
    return (
        <div>
            <Container>
                {myauth.isAuthenticated ? (
                    <Table hover>
                        <thead
                            style={{
                                backgroundColor: 'black',
                                color: 'white'
                            }}
                        >
                            <tr>
                                <th>Service</th>
                                <th>Duration</th>
                                <th>Minimum lead time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mybusiness &&
                                mybusiness.businesses.map(business => {
                                    return (
                                        <tr key={business._id}>
                                            <td>{business.name}</td>
                                            <td>
                                                {business.defaultHour} hour(s) {business.defaultMin}{' '}
                                                minutes
                                            </td>
                                            <td>{business.minLead} hour(s)</td>
                                            <td>
                                                <Button color='info' className='text-white mr-1'>
                                                    <a
                                                        href={`/business/edit/${business._id}`}
                                                        style={{ color: 'white', textDecoration: 'none' }}
                                                    >
                                                        <i className='fas fa-pen mr-1'></i>
                                                        Edit
                                                    </a>
                                                </Button>

                                                <Button
                                                    color='danger'
                                                    className='text-white'
                                                // onClick={this.onDeleteClick.bind(
                                                //   this,
                                                //   business._id
                                                // )}
                                                >
                                                    <i className='fas fa-trash-alt mr-1'></i>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                ) : (
                    <Alert color='info'>
                        Not authorised. Please{' '}
                        <Button color='primary' className='text-white mr-2'>
                            <a
                                href={myauth.auth_info.signInUrl}
                                style={{ color: 'white', textDecoration: 'none' }}
                            >
                                <i className='fab fa-microsoft mr-2'></i>
                                Login with Microsoft
                            </a>
                        </Button>
                        to manage businesses
                    </Alert>
                )}
            </Container>
        </div>
    )
}

export default BusinessList