import React, { useState, useContext, useEffect } from "react";
import UserContext from "UserContext";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  FormGroup,
  Form,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from "reactstrap";

import ImageUpload from "MyComponents/common/ImageUpload";
import GeneralTab from "./GeneralTab";

function AccountSettings(props) {
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = React.useState("tab1");
  useEffect(() => {
    if(!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus("Locating")
      navigator.geolocation.getCurrentPosition(position => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      }, () => {
        setStatus("Unable to retrieve location")
      })
    }
  }, [])
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  console.log(lng, lat)

  
  return (
    <>
      <div className="wrapper">
        <div className="section-shaped my-0 skew-separator skew-mini">
          <div className="page-header page-header-small header-filter">
            <div
              className="page-header-image"
              style={{
                backgroundImage:
                  "url(" + require("assets/img/pages/georgie.jpg") + ")",
              }}
            ></div>
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col className="px-5" lg="6" md="8" xl="5">
                    <h1 className="text-white">Your account</h1>
                    <p className="text-lead text-white">
                      That’s the main thing people are controlled by! Thoughts -
                      their perception of themselves!
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        </div>
        <div className="bg-secondary">
          <Card className="container bg-white mb-0">
            <Row>
              <Col md="3">
                <div className="section">
                  <section className="text-center">
                    <ImageUpload
                      avatar
                      changeBtnColor="primary"
                      changeBtnClasses="btn-sm btn-round mt-3"
                      addBtnColor="primary"
                      addBtnClasses="btn-sm btn-round mt-3"
                      removeBtnClasses="btn-sm btn-round mt-1"
                    />
                    <h3 className="title mt-4">{currentUser.firstName} {currentUser.lastName}</h3>
                  </section>
                  <section>
                    <br></br>
                    <Nav className="flex-column" role="tablist">
                      <NavItem>
                        <NavLink
                          className={activeTab === "tab1" ? "active" : ""}
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("tab1");
                          }}
                        >
                          <i className="tim-icons icon-single-02"></i>
                          General
                        </NavLink>
                      </NavItem>
                      <hr className="line-primary"></hr>
                      <NavItem>
                        <NavLink
                          className={activeTab === "tab3" ? "active" : ""}
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("tab3");
                          }}
                        >
                          <i className="tim-icons icon-lock-circle"></i>
                          Security
                        </NavLink>
                      </NavItem>
                      <hr className="line-primary"></hr>
                      <NavItem>
                        <NavLink
                          className={activeTab === "tab4" ? "active" : ""}
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("tab4");
                          }}
                        >
                          <i className="tim-icons icon-volume-98"></i>
                          Notifications
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </section>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              </Col>
              <Col className="ml-auto" md="8">
                <div className="section">
                  <TabContent activeTab={activeTab}>
                    <GeneralTab />
               
                    <TabPane tabId="tab3">
                      <div className="g-pos-rel h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-30--md">
                        <header>
                          <h2 className="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">
                            Security Questions
                          </h2>
                        </header>
                        <hr className="line-primary"></hr>
                        <Form>
                          <Row>
                            <Col md="6">
                              <label>Security Question</label>
                              <FormGroup>
                                <Input
                                  data-trigger=""
                                  id="choices-single-default-6"
                                  name="choices-single-default-6"
                                  type="select"
                                >
                                  <option disabled>Your Question</option>
                                  <option defaultValue="2">Question 1</option>
                                  <option defaultValue="3">Question 2</option>
                                  <option defaultValue="4">Question 3</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <label>Your Answer</label>
                              <FormGroup>
                                <Input
                                  placeholder="Enter your answer"
                                  type="text"
                                ></Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <br></br>
                          <br></br>
                          <header>
                            <h2 className="text-uppercase">
                              Security Settings
                            </h2>
                          </header>
                          <hr className="line-primary"></hr>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>Notify me via email when logging in</span>
                            <label className="custom-toggle">
                              <input type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>
                              Send SMS confirmation for all online payments
                            </span>
                            <label className="custom-toggle">
                              <input defaultChecked type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>
                              Check which devices accessed your account
                            </span>
                            <label className="custom-toggle">
                              <input type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>
                              Find My Device, make sure your device can be found
                              if it gets lost
                            </span>
                            <label className="custom-toggle">
                              <input defaultChecked type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>
                              Lock your device with a PIN, pattern, or password
                            </span>
                            <label className="custom-toggle">
                              <input defaultChecked type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <FormGroup className="d-flex align-items-center justify-content-between">
                            <span>
                              Manage what apps have access to app-usage data on
                              your device
                            </span>
                            <label className="custom-toggle">
                              <input type="checkbox"></input>
                              <span
                                className="custom-toggle-slider rounded-circle"
                                data-label-off="OFF"
                                data-label-on="ON"
                              ></span>
                            </label>
                          </FormGroup>
                          <Row className="mt-5 justify-content-end">
                            <Col className="actions" md="4">
                              <Button
                                color="primary"
                                outline
                                size="sm"
                                type="reset"
                              >
                                Cancel
                              </Button>
                              <Button color="primary" size="sm" type="button">
                                Save Changes
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </TabPane>
                    <TabPane tabId="tab4">
                      <Container>
                        <Row>
                          <Col xs="12">
                            <Alert className="text-small" color="primary">
                              <i className="icon-shield"></i>
                              <span>
                                We will never distribute your email address to
                                third parties. Read about email communication in
                                our privacy policy.
                              </span>
                            </Alert>
                          </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                          <Col xs="12">
                            <Form>
                              <h5 className="mb-4">Notification Preferences</h5>
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  className="custom-control-input"
                                  defaultChecked
                                  id="notification1"
                                  type="checkbox"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="notification1"
                                >
                                  <span>Someone mentions me</span>
                                </label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  className="custom-control-input"
                                  defaultChecked
                                  id="notification2"
                                  type="checkbox"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="notification2"
                                >
                                  <span>Someone follows me</span>
                                </label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  className="custom-control-input"
                                  id="notification3"
                                  type="checkbox"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="notification3"
                                >
                                  <span>Someone shares my activty</span>
                                </label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  className="custom-control-input"
                                  id="notification4"
                                  type="checkbox"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="notification4"
                                >
                                  <span>Someone messages me</span>
                                </label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  className="custom-control-input"
                                  id="notification6"
                                  type="checkbox"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="notification6"
                                >
                                  <span>Sales and promotions</span>
                                </label>
                              </div>
                              <Button
                                className="mt-3 mb-5"
                                color="primary"
                                size="sm"
                                type="submit"
                              >
                                Update preferences
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                          <Col xs="12">
                            <Form>
                              <h5>Notification Frequency</h5>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  id="freq1"
                                  name="custom-radio-1"
                                  type="radio"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="freq1"
                                >
                                  <span>Daily</span>
                                </label>
                              </div>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  id="freq2"
                                  name="custom-radio-1"
                                  type="radio"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="freq2"
                                >
                                  <span>Weekly</span>
                                </label>
                              </div>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  id="freq3"
                                  name="custom-radio-1"
                                  type="radio"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="freq3"
                                >
                                  <span>Monthly</span>
                                </label>
                              </div>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  defaultChecked
                                  id="freq4"
                                  name="custom-radio-1"
                                  type="radio"
                                ></input>
                                <label
                                  className="custom-control-label"
                                  htmlFor="freq4"
                                >
                                  <span>Never</span>
                                </label>
                              </div>
                              <Button
                                className="mt-3"
                                color="primary"
                                size="sm"
                                type="submit"
                              >
                                Update
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                      </Container>
                    </TabPane>
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
