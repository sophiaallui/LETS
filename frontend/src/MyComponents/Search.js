import React, { useState, useEffect } from "react";
import useDebounce from "hooks/useDebounce";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
import Api from "api/api";

const Search = props => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);

      }
      else {
        setResults(null);
        setIsSearching(false)
      }
    }, [debouncedSearchTerm]
  );

  const handleSearch = async () => {
    try {
      const res = await Api.request(`users/`)
    }
    catch(e) {
      console.error(e);
    }
  }

  const handleChange = async e => {
    setSearchTerm(e.target.value);

  }
  
  return (
    <Form onSubmit={e => e.preventDefault()}>
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
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </InputGroup>
      </FormGroup>
    </Form>
  )
};
export default Search