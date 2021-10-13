import React, { useState, useEffect } from 'react';
import useDebounce from 'hooks/useDebounce';
import {
	Form,
	FormGroup,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Input,
	Card,
	CardHeader,
	CardBody,
	ListGroup,
	ListGroupItem,
	Spinner,
	Row,
	Col,
} from 'reactstrap';
import Api from 'api/api';
import { Link } from 'react-router-dom';
import './searchDesign.css'

const Search = (props) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(() => {
		const handleSearch = async () => {
			try {
				setIsSearching(true);
				const res = await Api.request(
					`users?username=${debouncedSearchTerm}&firstName=${debouncedSearchTerm}&lastName=${debouncedSearchTerm}&email=${debouncedSearchTerm}`
				);
				const users = res.users;
				setResults(users);
			} catch (e) {
				console.error(e);
			}
		};

		if (debouncedSearchTerm) {
			setIsSearching(true);
			handleSearch();
		} else {
			setResults(null);
			setIsSearching(false);
		}
	}, [debouncedSearchTerm]);

	const handleChange = async (e) => {
		setSearchTerm(e.target.value);
		console.log(debouncedSearchTerm);
	};
	console.debug('results', results);
    useEffect(()=>{
        console.log(results)
    },[results])
	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				console.log(searchTerm);
			}}
		>
			<FormGroup>
				<InputGroup>
					<InputGroupAddon addonType='prepend'>
						<InputGroupText>
							<i className='fas fa-search' />
						</InputGroupText>
					</InputGroupAddon>
					<Input
						placeholder='Search'
						type='text'
						value={searchTerm}
						onChange={handleChange}
					/>
					<InputGroupAddon addonType='append'>
						<InputGroupText>
							<i
								onClick={() => {
									console.log('x clicked');
                                    setSearchTerm('');
                                    setIsSearching(false);
								}}
								className='ni ni-fat-remove'
							/>
						</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				{isSearching ? <Spinner className ='main-search'size ='sm'color='primary' /> : null}

				{results &&
					results.map((user) => (
						<ListGroupItem key={user.username}>
							<Row>
								<Col>
									<Link to={`/profile/${user.username}`}>
										<img
											alt='...'
											src={
												user.profileImage
													? user.profileImage
													: require('assets/img/placeholder.jpg')
											}
										/>
									</Link>
								</Col>
								<div>
									<h4>
										<a
											href='#'
											onClick={(e) => e.preventDefault()}
										>
											{user.firstName} {user.lastName}
										</a>
										<small>{user.username}</small>
									</h4>
								</div>
							</Row>
						</ListGroupItem>
					))}
			</FormGroup>
		</Form>
	);
};
export default Search;
