import React from "react";
import axios from "axios";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroup,
  Row,
  Col,
} from "reactstrap";

import Message from "MyComponents/messenger/Message";
import UserContext from "UserContext";
import Api from "api/api";
import Conversation from "MyComponents/messenger/Conversation";
import ChatHeader from "MyComponents/messenger/ChatHeader";
/**
 * data : [
 *  { 
 *     createdAt : date,
 *     updatedAt : date
 *     members : [ usernames, usernames ] 
 *   },
 *   {
 *     createdAt : date,
 *     updatedAt : date,
 *     members : [usernames, usernames ]
 *   }
 * ]
 * 
 */

function Messenger() {
  const [searchFocus, setSearchFocus] = React.useState("");
  const [messageFocus, setMessageFocus] = React.useState("");
  const { currentUser } = React.useContext(UserContext);
  const { username } = currentUser;

  const [conversations, setConversations] = React.useState([]);
  const [currentChat, setCurrentChat] = React.useState(null);
  const [messages, setMessages] = React.useState(null);

  React.useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await Api.getConversations(username);
        setConversations(res);
      }
      catch(e) {
        console.error(e);
      }
    }
    getConversations();
  }, [username]);
  
  console.debug(
    "Messenger conversations=", conversations,
    "Messenger currentChat=", currentChat  
  );
  return (
    <>
      <Row className="flex-row chat">
        <Col lg="4">
          <Card className="bg-secondary">
            <CardHeader className={"mb-3 " + searchFocus}>
              <InputGroup className="input-group-alternative">
                <Input
                  placeholder="Search contact"
                  type="text"
                  onFocus={() => setSearchFocus("focused")}
                  onBlur={() => setSearchFocus("")}
                ></Input>
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <i className="ni ni-zoom-split-in"></i>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </CardHeader>

            <ListGroup className="list-group-chat" flush tag="div">
              {conversations.map(c => ( 
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} />
                </div>
              ))}
            </ListGroup>
          </Card>

        </Col>


        <Col lg="8">
          <Card>
            <CardHeader className="d-inline-block">
              {
                currentChat ? <ChatHeader /> : null
              }
            </CardHeader>
            <CardBody>
              {
                currentChat ? 
                (
                  <>
                    <Message />
                    <Message mine />
                  </>
                ) :
                <span>Open a conversation to start a chat</span>
              }
              


            </CardBody>
            <CardFooter className="d-block">
              <FormGroup className={messageFocus}>
                <InputGroup className="mb-4">
                  <Input
                    placeholder="Your message"
                    type="text"
                    onFocus={() => setMessageFocus("focused")}
                    onBlur={() => setMessageFocus("")}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="ni ni-send"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Messenger;
