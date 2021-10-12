import React, { useState, useEffect } from "react";
import useDebounce from "hooks/useDebounce";
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
  Row,
  Col,
} from "reactstrap";
import Api from "api/api";
import { Link } from "react-router-dom";



const Search = props => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      const handleSearch = async () => {
        try {
          setIsSearching(true)
          const res = await Api.request(
            `users?username=${debouncedSearchTerm}&firstName=${debouncedSearchTerm}&lastName=${debouncedSearchTerm}&email=${debouncedSearchTerm}`
          );
          const users = res.users;
          setResults(users)
        }
        catch (e) {
          console.error(e);
        }
      }

      if (debouncedSearchTerm) {
        setIsSearching(true);
        handleSearch()
      }
      else {
        setResults(null);
        setIsSearching(false)
      }
    }, [debouncedSearchTerm]
  );



  const handleChange = async e => {
    setSearchTerm(e.target.value);
    console.log(debouncedSearchTerm)
  }
  console.debug("results", results)

  return (
    <Form onSubmit={e => {
      e.preventDefault();
      console.log(searchTerm)
    }}>
      <FormGroup className="mb-0">
        <InputGroup className="input-group-alternative input-group-merge">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-search" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={handleChange}
          />
          {
            isSearching && (
              <Card>
                <CardHeader>Loading..</CardHeader>
              </Card>
            )
          }
          {results && results.map(user => (
            <ListGroupItem className="px-0" key={user.username}>
              <Row className="align-items-center">
                <Col className="col-auto">
                  <Link
                    className="avatar rounded-circle"
                    to={`/profile/${user.username}`}
                  >
                    <img
                      alt="..."
                      src={
                        user.profileImage ? 
                        user.profileImage : 
                        require("assets/img/placeholder.jpg")
                      }
                    />
                  </Link>
                </Col>
                <div className="col ml--2">
                  <h4 className="mb-0">
                    <a href="#" onClick={e => e.preventDefault()}>
                      {user.firstName} {user.lastName}
                    </a>
                    <small>{user.username}</small>
                  </h4>
                </div>
              </Row>
            </ListGroupItem>
          ))}
        </InputGroup>
      </FormGroup>
    </Form>
  )
};
export default Search