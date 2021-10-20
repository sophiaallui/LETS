import React from "react";
import Sidebar from "MyComponents/sidebar/Sidebar";
import Feed from "MyComponents/feed/Feed";
import RightBar from "MyComponents/rightbar/RightBar";

const Home = () => (
  <>
    <div style={{ display : 'flex', width : "100%" }}>
      <Sidebar />
      <Feed />
      <RightBar />
    </div>
  </>
)

export default Home;