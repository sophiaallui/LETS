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
  Form
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

  const [conversations, setConversations] = React.useState([]);
  const [currentChat, setCurrentChat] = React.useState(null);
  const [messages, setMessages] = React.useState(null);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await Api.getConversations(currentUser.username);
        setConversations(res);
      }
      catch (e) {
        console.error(e);
      }
    }
    getConversations();
  }, [currentUser.username]);

  React.useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await Api.getMessages(currentChat?.id);
        setMessages(res)
      } catch (e) {
        console.error(e);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async e => {
    e.preventDefault();
    const messageBody = {
      text : message,
      roomId : currentChat.id
    }
    
    try {
      const message = await Api.sendMessage(messageBody, currentUser.username);
      setMessages(messages => [ ...messages, message]);
      setMessage("")
    }
    catch (e) {
      console.error(e);
    }
  }

  console.debug(
    "Messengerconversations=", conversations,
    "MessengercurrentChat=", currentChat,
    "Messengermessages=", messages,
    "Messengermessage=", message
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
                />

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
                currentChat ? <ChatHeader members={currentChat?.members} /> : null
              }
            </CardHeader>
            <CardBody>
              {
                currentChat ?
                  (
                    messages?.map(m => (
                      <Message message={m} mine={m.sentBy === currentUser.username} />
                    ))
                  ) :
                  <span>Open a conversation to start a chat</span>
              }
            </CardBody>

            <CardFooter className="d-block">
              
              <Form onSubmit={handleSubmit} role="form">
                <FormGroup className={messageFocus}>
                  <InputGroup className="mb-4">
                    <Input
                      placeholder="Your message"
                      type="text"
                      onFocus={() => setMessageFocus("focused")}
                      onBlur={() => setMessageFocus("")}
                      onChange={e => setMessage(e.target.value)}
                      value={message}
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <i className="ni ni-send"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Form>

            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Messenger;
