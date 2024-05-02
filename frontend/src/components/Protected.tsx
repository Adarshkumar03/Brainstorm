import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import WhiteboardTool from "../routes/WhiteboardTool";
import Home from "../routes/Home";
import { Routes, Route } from "react-router-dom";

const Protected = ({ token }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home token={token}/>} />
        <Route path="/whiteboard/:sessionId" element={<WhiteboardTool token={token}/>} />
      </Routes>
    </>
  );
};

export default Protected;
