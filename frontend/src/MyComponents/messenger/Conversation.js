import React, { useEffect, useContext, useState } from "react";
import { ListGroupItem, Media, Col } from "reactstrap";
import UserContext from "UserContext";
import Api from "api/api";

// conversation : { name, members : [ username, username ] }
const Conversation = ({ conversation, active }) => {

  const { currentUser } = useContext(UserContext);
  const [users, setUsers] = useState(null);
  const friendsUsername = conversation?.members?.filter((m) => m !== currentUser.username);
  
  console.debug("Conversations Component users=", users);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const allPromise = Promise.all(friendsUsername.map(uName => Api.getCurrentUser(uName)))
        const usersArray = await allPromise;
        setUsers(usersArray);
      } catch (e) {
        console.error(e);
      }
    };

    getUsers();
  }, [currentUser, conversation]);

  return (
    <>
      <ListGroupItem className={active ? 'active bg-gradient-primary' : ''}>
        <Media>
          <img
            alt="..."
            className="avatar shadow"
            src={require("assets/img/placeholder.jpg")}
          />
          <Media body className="ml-2">
            <div className="justify-content-between align-items-center">
              {friendsUsername.map(uName => <h6 className="mb-0">{uName}</h6> )}
            </div>
            <Col
              className="text-muted text-small p-0 text-truncate d-block"
              tag="span"
              xs="10"
            >
            {/* Be sure to check it out if your dev pro... */}
            </Col>
          </Media>
        </Media>
      </ListGroupItem>
    </>
  );
};

export default Conversation;
