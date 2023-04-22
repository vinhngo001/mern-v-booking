import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Card, CardBody, CardHeader, CardTitle, Container } from "reactstrap";
import { loadUser } from "../../redux/actions/authActions";

const BusinessPublish = ()=>{
    const {myauth} = useSelector(state=>state);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(loadUser())
    },[dispatch]);

    return(
        <div>
        <Container>
          {myauth.isAuthenticated ? (
            <Card className='text-center'>
              <CardHeader
                color='primary'
                style={{ backgroundColor: 'darkgreen', color: 'white' }}
              >
                <b>Your Business Booking</b>
              </CardHeader>
              <CardBody>
                <CardTitle>
                  <h4 className='mb-4'>
                    Copy the following URL and send it to your customers
                  </h4>
                  <span className='border rounded-lg p-2'>
                    http://localhost:5002/events/create/
                    {myauth.auth_info.email}
                  </span>
                </CardTitle>
              </CardBody>
            </Card>
          ) : (
            <Alert color='info'>
              Not authorised. Please{' '}
              <a href={myauth.auth_info.signInUrl} className='alert-link'>
                Login
              </a>{' '}
              to manage businesses
            </Alert>
          )}
        </Container>
      </div>
    )
}

export default BusinessPublish;