import React, { useState } from "react";
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col,
  Button
} from "reactstrap";
import Charts from "MyComponents/Charts";
import NewPostFormModal from "./NewPostFormModal";
import Post from "MyComponents/Posts"

const ProfileTabs = ({ progress, posts, goals }) => {
  const [hTabsIcons, setHTabsIcons] = useState("hTabsIcons-1");
  return (
    <>
      <Row className="justify-content-center">
        <Col lg="10">
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
                  Goals
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
                  Progress
                </NavLink>
              </NavItem>


              <NavItem>
                <NavLink
                  className={
                    "mb-sm-3 mb-md-0 " +
                    (hTabsIcons === "hTabsIcons-4" ? "active" : "")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setHTabsIcons("hTabsIcons-4");
                  }}
                >
                  <i className="ni ni-calendar-grid-58 mr-2"></i>
                  Activity Feed
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <Card className="shadow">
            <CardBody>
              <TabContent id="myTabContent" activeTab={hTabsIcons}>
                <TabPane tabId="hTabsIcons-1" role="tabpanel">
                  {
                    goals?.length === 0 ?
                      <div className="description">
                        <h2>You have no goals</h2>
                        <Button>Post One</Button>
                      </div> :
                      // Do the Goals HERE
                      null
                  }
                </TabPane>

                <TabPane tabId="hTabsIcons-2" role="tabpanel">
                  {
                    posts?.length === 0 ?
                      (<div className="description">
                        <h2>You have no posts</h2>
                        <NewPostFormModal buttonText="Post one" />
                      </div>) : (
                        <div className="description">
                          <NewPostFormModal buttonText="New post" />
                          {posts?.map(p => (
                            <Post type="Posts" post={p} key={p.id} />
                          ))}
                        </div>
                      )
                  }
                </TabPane>

                <TabPane tabId="hTabsIcons-3" role="tabpanel">
                  <div className="description">
                    <Charts />
                  </div>
                </TabPane>

                <TabPane tabId="hTabsIcons-4" role="tabpanel">
                  <div className="description">

                  </div>
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