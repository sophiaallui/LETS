import React, { useState } from "react";
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from "reactstrap";

const ProfileTabs = props => {
  const [hTabsIcons, setHTabsIcons] = React.useState("hTabsIcons-1");
  return (
    <>
      <Row className="justify-content-center">
        <Col lg="12">
          <div className="mb-3">
          </div>
          <div className="nav-wrapper">
            <Nav pills roles="tablist" className="nav-fill flex-column flex-md-row">
              <NavItem>
                <NavLink
                  className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-1" ? "active" : "")}
                  onClick={e => {
                    e.preventDefault();
                    setHTabsIcons("hTabsIcons-1")
                  }}>
                  <i className="ni ni-cloud-upload-96 mr-2"></i>
                  Progress
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={
                    "mb-sm-3 mb-md-0 " +
                    (hTabsIcons === "hTabsIcons-2" ? "active" : "")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setHTabsIcons("hTabsIcons-2");
                  }}>
                  <i className="ni ni-bell-55 mr-2"></i>
                  Posts
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={
                    "mb-sm-3 mb-md-0 " +
                    (hTabsIcons === "hTabsIcons-3" ? "active" : "")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setHTabsIcons("hTabsIcons-3");
                  }}
                >
                  <i className="ni ni-calendar-grid-58 mr-2"></i>
                  Messages
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <Card className="shadow">
            <CardBody>
              <TabContent id="myTabContent" activeTab={hTabsIcons}>
                <TabPane tabId="hTabsIcons-1" role="tabpanel">
                  <p className="description">
                    Raw denim you probably haven't heard of them jean shorts
                    Austin. Nesciunt tofu stumptown aliqua, retro synth master
                    cleanse. Mustache cliche tempor, williamsburg carles vegan
                    helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher
                    synth.
                  </p>
                  <p className="description">
                    Raw denim you probably haven't heard of them jean shorts
                    Austin. Nesciunt tofu stumptown aliqua, retro synth master
                    cleanse.
                  </p>
                </TabPane>
                <TabPane tabId="hTabsIcons-2" role="tabpanel">
                  <p className="description">
                    Cosby sweater eu banh mi, qui irure terry richardson ex
                    squid. Aliquip placeat salvia cillum iphone. Seitan aliquip
                    quis cardigan american apparel, butcher voluptate nisi qui.
                  </p>
                </TabPane>
                <TabPane tabId="hTabsIcons-3" role="tabpanel">
                  <p className="description">
                    Raw denim you probably haven't heard of them jean shorts
                    Austin. Nesciunt tofu stumptown aliqua, retro synth master
                    cleanse. Mustache cliche tempor, williamsburg carles vegan
                    helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher
                    synth.
                  </p>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
};

export default ProfileTabs;