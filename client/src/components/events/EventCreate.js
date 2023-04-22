import React, { Component, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	clientGetBusinesses,
	getFreeSlots,
	sendBooking
} from '../../redux/actions/eventActions';
import classnames from 'classnames';
import moment from 'moment';
import { useParams } from "react-router-dom"
import {
	CustomInput, Container, Label, TabContent, TabPane,
	Nav, NavItem, NavLink, Button, Table, Modal, ModalHeader, ModalBody,
	Form, FormGroup, Input, Card, CardHeader, CardBody, CardTitle, CardText, CardFooter
} from 'reactstrap';
import { loadUser } from '../../redux/actions/authActions';

const EventCreate = ({ component: Component, ...rest }) => {
	const { myauth, myevent } = useSelector(state => state);
	const dispatch = useDispatch();
	const inititalState = {
		services: '',
		activeTab: '',
		ranges: [],
		modal: false,
		business_chosen: '',
		subject: '',
		message: '',
		email: '',
		time_chosen: '',
		name: ''
	}
	const { email } = useParams();
	const [event, setEvent] = useState(inititalState);

	const toggleModal = (time_chosen) => {
		setEvent({ ...event, modal: !event.modal });
		setEvent({ ...event, time_chosen: time_chosen });
	}
	const toggle = (tab) => {
		if (event.activeTab !== tab) setEvent({ ...event, activeTab: tab });
	}
	const onServiceChange = (e) => {
		setEvent({ ...event, [e.target.name]: e.target.value }, () => {

		});
		console.log({ event })
		const service_data = {
			service: event.services,
			email: email
		}
		console.log({ service_data })
		dispatch(getFreeSlots(service_data))
	}
	const onBookingSubmit = (e) => {
		e.preventDefault();
	}
	useEffect(() => {
		console.log(event);
		dispatch(loadUser())
	}, [dispatch]);

	useEffect(() => {
		dispatch(clientGetBusinesses(email));
	}, [dispatch, email]);

	useEffect(() => {
		if (myevent.doneGetFreeSlots) {
			setEvent({ ...event, activeTab: myevent.freeDays[0].formatted_day });

			// Get the start and endTime of chosen business to generate table
			const business_chosen = myevent.businesses.filter(
				business => business.name === event.services
			)[0];

			// Generate time range
			if (business_chosen) {
				const start = business_chosen.startTime;
				const end = business_chosen.endTime;
				const new_start = moment(start, 'HH:mm');
				const new_end = moment(end, 'HH:mm');

				const new_start_rounded = new_start.clone().startOf('hour');

				const ranges = [];

				while (true) {
					let time_to_add = new_start_rounded.clone();
					if (!new_start_rounded.isSameOrAfter(new_end)) {
						ranges.push(time_to_add.format());
						new_start_rounded.add(1, 'h');
					} else {
						break;
					}
				}

				//console.log(ranges);
				setEvent({ ...event, ranges: ranges, business_chosen: business_chosen });
			}

			if (myevent.bookingSuccessful) console.log('yay');
		}
	}, [myevent?.doneGetFreeSlots, myevent?.businesses, , myevent?.freeDays]);

	const onModalChange = (e) => {
		setEvent({ ...event, [e.target.name]: e.target.value });
	}
	return (
		<div>
			<Container>
				{myevent.bookingSuccessful ? (
					<Card>
						<CardHeader tag='h3'>Booking successful</CardHeader>
						<CardBody>
							<CardTitle>
								<strong>Booking confirmation</strong>
							</CardTitle>
							<CardText>
								<p>
									You have booked{' '}
									<strong>{event.business_chosen.name}</strong> from{' '}
									<strong>{event.business_chosen.owner}</strong>
								</p>
								<p>
									On{' '}
									<b>
										{moment(event.time_chosen).format('dddd D MMM YYYY')}
									</b>{' '}
									at <b>{moment(event.time_chosen).format('h:mm a')}</b>
								</p>
								<p>
									Duration:{' '}
									<strong>
										{event.business_chosen.defaultHour} hour(s){' '}
										{event.business_chosen.defaultMin} minutes
									</strong>
								</p>
								<p style={{ color: 'green' }}>
									<strong>A confirmation email will be sent shortly</strong>
								</p>
							</CardText>
						</CardBody>
						<CardFooter className='text-muted'>
							You can now close this window
						</CardFooter>
					</Card>
				) : (
					<Fragment>
						<Label for='services'>
							<h3>Choose service</h3>
						</Label>
						<CustomInput
							type='select'
							name='services'
							id='services'
							onChange={onServiceChange}
							required
							defaultValue='Choose service'
						>
							<option value='Choose service' disabled>
								Choose service
							</option>
							{myevent.businesses.map(business => {
								return (
									<option key={business._id} value={business.name}>
										{business.name}
									</option>
								);
							})}
						</CustomInput>

						{myevent.doneGetFreeSlots && (
							<div>
								<Nav tabs className='mt-5'>
									{myevent.freeDays.map(free_day => {
										return (
											<NavItem
												key={free_day.day}
												style={{ backgroundColor: 'grey', color: 'white' }}
											>
												<NavLink
													className={classnames({
														active:
															event.activeTab ===
															`${free_day.formatted_day}`
													})}
													onClick={() => {
														toggle(free_day.formatted_day);
													}}
												>
													<h6>
														<b>{free_day.formatted_day}</b>
													</h6>
												</NavLink>
											</NavItem>
										);
									})}
								</Nav>
								<TabContent activeTab={event.activeTab}>
									{myevent.freeDays.map(free_day => {
										return (
											<TabPane
												key={free_day.day}
												tabId={free_day.formatted_day}
											>
												<Table hover>
													<thead>
														<tr>
															<th>Range</th>
															<th>Times</th>
														</tr>
													</thead>
													<tbody>
														{event.ranges.map(range => {
															return (
																<tr
																	key={`${moment(free_day.day).format(
																		'YYYY-MM-DD'
																	)}T${moment(range).format('HH:mm:ss')}`}
																>
																	<th scope='row'>
																		{moment(range).format('h a')}
																	</th>
																	<td
																		id={`${moment(free_day.day).format(
																			'YYYY-MM-DD'
																		)}T${moment(range).format('HH:mm:ss')}`}
																	>
																		{free_day.free_slots
																			.filter(
																				free_slot =>
																					moment(free_slot).isBetween(
																						`${moment(free_day.day).format(
																							'YYYY-MM-DD'
																						)}T${moment(range).format(
																							'HH:mm:ss'
																						)}`,
																						moment(
																							`${moment(free_day.day).format(
																								'YYYY-MM-DD'
																							)}T${moment(range).format(
																								'HH:mm:ss'
																							)}`
																						).add(1, 'h')
																					) ||
																					moment(free_slot).isSame(
																						`${moment(free_day.day).format(
																							'YYYY-MM-DD'
																						)}T${moment(range).format(
																							'HH:mm:ss'
																						)}`
																					)
																			)
																			.map(free_slot => (
																				<Button
																					key={free_slot}
																					color='success'
																					className='mr-2'
																					onClick={toggleModal(
																						moment(free_slot).format()
																					)}
																				>
																					{moment(free_slot).format('h:mm a')}
																				</Button>
																			))}
																	</td>
																</tr>
															);
														})}
													</tbody>
												</Table>
											</TabPane>
										);
									})}
								</TabContent>
							</div>
						)}

						<Modal
							isOpen={event.modal} toggle={toggleModal}
						>
							<ModalHeader
								toggle={toggleModal}
							>
								Create Booking
							</ModalHeader>
							<ModalBody>
								<p>
									You are booking{' '}
									<strong>{event.business_chosen.name}</strong> from{' '}
									<strong>{event.business_chosen.owner}</strong>
								</p>
								<p>
									On{' '}
									<b>
										{moment(event.time_chosen).format('dddd D MMM YYYY')}
									</b>{' '}
									at <b>{moment(event.time_chosen).format('h:mm a')}</b>
								</p>
								<p>
									Duration:{' '}
									<strong>
										{event.business_chosen.defaultHour} hour(s){' '}
										{event.business_chosen.defaultMin} minutes
									</strong>
								</p>
								<Form onSubmit={onBookingSubmit}>
									<FormGroup>
										<Label for='name'>Name</Label>
										<Input
											type='text'
											name='name'
											id='name'
											onChange={onModalChange}
											placeholder='Your name'
											className='mb-3'
											required
										/>

										<Label for='subject'>Subject</Label>
										<Input
											type='text'
											name='subject'
											id='subject'
											onChange={onModalChange}
											placeholder='Subject'
											className='mb-3'
											required
										/>

										<Label for='message'>Message</Label>
										<Input
											type='textarea'
											name='message'
											id='message'
											placeholder='Message'
											onChange={onModalChange}
											className='mb-3'
										/>

										<Label for='email'>Email</Label>
										<Input
											type='email'
											name='email'
											id='email'
											placeholder='Your email'
											onChange={onModalChange}
											className='mb-3'
											required
										/>

										<Button
											color='primary'
											style={{ marginTop: '2rem' }}
											block
										>
											Create Booking
										</Button>
									</FormGroup>
								</Form>
							</ModalBody>
						</Modal>
					</Fragment>
				)}
			</Container>
		</div>
	)
}

export default EventCreate
