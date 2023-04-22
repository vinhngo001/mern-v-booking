import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import learnItLogo from "../../assets/logo.svg";

const NavbarMenu = () => {
	const { myauth } = useSelector(state => state);
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Navbar color='dark' dark expand='sm' className='mb-3'>
				<NavbarBrand href='/'>
					<img
						src={learnItLogo}
						style={{ width: '40px' }}
						className='mr-2'
						alt='logo'
					/>
					V Booking
				</NavbarBrand>

				<NavbarToggler onClick={() => setIsOpen(!isOpen)} />
				<Collapse isOpen={isOpen} navbar>
					{myauth.isAuthenticated && (
						<Fragment>
							<Nav className='mr-auto' navbar>
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle nav caret>
										Service
									</DropdownToggle>
									<DropdownMenu right>
										<DropdownItem href='/business/create'>
											New Service
										</DropdownItem>
										<DropdownItem href='/business/list'>
											Manage Services
										</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>

								<NavItem>
									<NavLink href='/business/publish'>
										<strong>PUBLISH</strong>
									</NavLink>
								</NavItem>
							</Nav>

							<Nav className='ml-auto' navbar>
								<NavItem>
									<NavLink href='http://localhost:3000/authorize/signout'>
										<strong>Sign Out</strong>
									</NavLink>
								</NavItem>
							</Nav>
						</Fragment>
					)}
				</Collapse>
			</Navbar>
		</div>
	)
}

export default NavbarMenu
