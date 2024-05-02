import WhiteboardTool from "../routes/WhiteboardTool";
import Home from "../routes/Home";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Protected = ({ token }) => {
  return (
    <>
      <Routes>
        <Route
          element={
            <div>
              <Navbar />
              <Outlet />
            </div>
          }
        >
          <Route path="/" element={<Home token={token} />} />
          <Route
            path="/whiteboard/:sessionId"
            element={<WhiteboardTool token={token} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default Protected;
