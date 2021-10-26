import React, { useState, useEffect, useContext } from "react";
import UserContext from "UserContext";
import { TabPane, Row, Col, FormGroup, Input, Button } from "reactstrap";
import Choices from "choices.js";

const GeneralTab = ({ tabId }) => {
   const { currentUser } = useContext(UserContext);

   const [generalSectionForm, setGeneralSectionForm] = useState({
      firstName : currentUser.firstName || "",
      lastName  : currentUser.lastName || "",
      email : currentUser.email || "",
      confirmEmail : currentUser.email || "",
   });
   const handleGeneralSectionChange = e => {
      const { name, value } = e.target;
      setGeneralSectionForm(data => ({ ...data, [name] : value }))
   }
   useEffect(() => {
      new Choices("#choices-single-default-1", {
        searchEnabled: false,
      });
      new Choices("#choices-single-default-2", {
        searchEnabled: false,
      });
      new Choices("#choices-single-default-3", {
        searchEnabled: false,
      });
      new Choices("#choices-single-default-4", {
        searchEnabled: false,
      });
      new Choices("#choices-single-default-6", {
        searchEnabled: false,
      });
      new Choices("#badges", {
        delimiter: ",",
        editItems: true,
        maxItemCount: 5,
        removeItemButton: true,
        placeholder: true,
        placeholderValue: "+ Add",
      });
  
      document.body.classList.add("account-settings");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      return function cleanup() {
        document.body.classList.remove("account-settings");
      };
    }, []);
   return (
      <TabPane tabId="tab1">
      <div>
        <header>
          <h2 className="text-uppercase">
            General information
          </h2>
        </header>
        <hr className="line-primary"></hr>
        <br></br>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#firstName">
              First Name
            </label>
          </Col>
          <Col className="align-self-center" md="9">
            <FormGroup>
              <Input
                id="firstName"
                name="firstName"
                value={generalSectionForm.firstName}
                onChange={handleGeneralSectionChange}
                required="required"
                type="text"
              ></Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#lastName">
              Last Name
            </label>
          </Col>
          <Col className="align-self-center" md="9">
            <FormGroup>
              <Input
                id="lastName"
                name="lastName"
                value={generalSectionForm.lastName}
                onChange={handleGeneralSectionChange}
                required="required"
                type="text"
              ></Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels">I’m</label>
          </Col>
          <Col className="align-self-center" md="4">
            <FormGroup>
              <Input
                data-trigger=""
                id="choices-single-default-1"
                name="choices-single-default-1"
                type="select"
              >
                <option defaultValue="2">Male</option>
                <option defaultValue="3">Female</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels">Birth Date</label>
          </Col>
          <Col className="align-self-center" md="9">
            <Row>
              <Col className="align-self-center" md="4">
                <FormGroup>
                  <Input
                    data-trigger=""
                    id="choices-single-default-2"
                    name="choices-single-default-2"
                    type="select"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Input
                    data-trigger=""
                    id="choices-single-default-3"
                    name="choices-single-default-3"
                    type="select"
                  >
                     {Array(31).fill(0).map((ele, idx) => (
                        <option key={idx}>{idx}</option>
                     ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Input
                    data-trigger=""
                    id="choices-single-default-4"
                    name="choices-single-default-4"
                    type="select"
                  >
                    {Array(100).fill(0).map((ele, index) => (
                      <option key={index}>{1920 + index}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#email">
              Email
            </label>
          </Col>
          <Col className="align-self-center" md="9">
            <FormGroup>
              <Input
                id="email"
                name="email"
                value={generalSectionForm.email}
                onChange={handleGeneralSectionChange}
                required="required"
                type="email"
              ></Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#confirmEmail">
              Confirm Email
            </label>
          </Col>
          <Col className="align-self-center" md="9">
            <FormGroup>
              <Input
                id="confirmEmail"
                name="confirmEmail"
                value={generalSectionForm.confirmEmail}
                onChange={handleGeneralSectionChange}
                required="required"
                type="email"
              ></Input>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#location">
              Your Location
            </label>
          </Col>
          <Col className="align-self-center" md="9">
            <FormGroup>
              <Input
                defaultValue="Sydney, A"
                id="location"
                name="location"
                required="required"
                type="text"
              ></Input>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels" htmlFor="#phone">
              Phone Number
            </label>
          </Col>
          <Col className="align-self-center" md="4">
            <FormGroup>
              <Input
                defaultValue="+745 031 200"
                id="phone"
                name="phone"
                required="required"
                type="tel"
              ></Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="align-self-center" md="3">
            <label className="labels">My Tags</label>
          </Col>
          <Col className="align-self-center" md="9">
            <input
              defaultValue="VueJs,Angular,Laravel,React"
              id="badges"
              placeholder="+ Add"
              type="text"
            ></input>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md="6">
            <Button color="primary" type="submit">
              Save Changes
            </Button>
            <Button color="primary" outline type="reset">
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </TabPane>
   )
};

export default GeneralTab;