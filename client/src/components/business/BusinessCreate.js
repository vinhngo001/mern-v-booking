import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
    Card, CardBody, Container, Button, Form, FormGroup, Label,
    Input, InputGroup, InputGroupAddon, InputGroupText, CustomInput, Col, Alert
} from 'reactstrap';

import { loadUser } from '../../redux/actions/authActions';
import { addBusiness } from '../../redux/actions/businessActions';

const BusinessCreate = () => {
    const { myauth, mybusiness } = useSelector(state => state);
    const dispatch = useDispatch();
    const initialState = {
        name: '',
        address: '',
        phone: '',
        desc: '',
        website: '',
        startTime: '',
        endTime: '',
        defaultHour: '',
        defaultMin: '',
        minlead: '',
        maxlead: '',
        redirectToListBusiness: false
    }
    const [data, setData] = useState(initialState);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const handleChangeInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        const business_data = {
            ...data,
            owner: myauth.auth_info.user,
            email: myauth.auth_info.email
        }
        dispatch(addBusiness(business_data))
    }
    return (
        <div>
            {mybusiness.success_add_business && <Redirect to='/business/list' />}
            <Container>
                {
                    myauth.isAuthenticated ? (
                        <Card className='mb-4'>
                            <CardBody>
                                <h3>Business Information</h3>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label for='name'>Business name</Label>
                                        <Input
                                            type='text'
                                            name='name'
                                            id='name'
                                            placeholder='What is it?'
                                            required
                                            onChange={handleChangeInput}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='address'>Location</Label>
                                        <Input
                                            type='text'
                                            name='address'
                                            id='address'
                                            placeholder='Where is it?'
                                            required
                                            onChange={handleChangeInput}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for='phone'>Phone number</Label>
                                        <Input
                                            type='text'
                                            name='phone'
                                            id='phone'
                                            placeholder='Clients can call you at...'
                                            required
                                            onChange={handleChangeInput}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='desc'>Description</Label>
                                        <Input
                                            type='text'
                                            name='desc'
                                            id='desc'
                                            placeholder='What does your service do?'
                                            onChange={handleChangeInput}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for='website'>Website</Label>
                                        <Input
                                            type='url'
                                            name='website'
                                            id='website'
                                            placeholder='Where can clients find you on the Internet?'
                                            onChange={handleChangeInput}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for='businessHours'>
                                            Business Hours (12-hour format)
                                        </Label>

                                        <InputGroup className='mb-3' inline='true'>
                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText>From</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type='time'
                                                name='startTime'
                                                id='startTime'
                                                placeholder='time placeholder'
                                                className='mr-3'
                                                onChange={handleChangeInput}
                                                required
                                            />

                                            <InputGroupAddon addonType='prepend'>
                                                <InputGroupText>To</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type='time'
                                                name='endTime'
                                                id='endTime'
                                                placeholder='time placeholder'
                                                onChange={handleChangeInput}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for='duration'>Default Duration</Label>

                                        <InputGroup className='mb-3' inline='true'>
                                            <CustomInput
                                                type='select'
                                                name='defaultHour'
                                                id='durationHour'
                                                onChange={handleChangeInput}
                                            >
                                                <option value='0'>0</option>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                                <option value='4'>4</option>
                                            </CustomInput>

                                            <InputGroupAddon addonType='append' className='mr-3'>
                                                <InputGroupText>Hours</InputGroupText>
                                            </InputGroupAddon>

                                            <CustomInput
                                                type='select'
                                                name='defaultMin'
                                                id='durationMinute'
                                                onChange={handleChangeInput}
                                            >
                                                <option value='0'>0</option>
                                                <option value='15'>15</option>
                                                <option value='30'>30</option>
                                                <option value='45'>45</option>
                                            </CustomInput>

                                            <InputGroupAddon addonType='append'>
                                                <InputGroupText>Minutes</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Label for='minlead' sm={6}>
                                            Minimum lead time for bookings (in hours)
                                        </Label>
                                        <Col sm={6}>
                                            <Input
                                                type='number'
                                                name='minlead'
                                                id='minlead'
                                                placeholder='...hours'
                                                min='1'
                                                required
                                                onChange={handleChangeInput}
                                            />
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Label for='maxlead' sm={6}>
                                            Maximum number of business days in advance that a booking
                                            can be made
                                        </Label>
                                        <Col sm={6}>
                                            <Input
                                                type='number'
                                                name='maxlead'
                                                id='maxlead'
                                                placeholder='...days'
                                                min='1'
                                                max='10'
                                                required
                                                onChange={handleChangeInput}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <Button color='primary'>Submit</Button>
                                </Form>
                            </CardBody>
                        </Card>
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
                    )
                }
            </Container>
        </div>
    )
}

export default BusinessCreate