import WhiteboardTool from "../routes/WhiteboardTool";
import Home from "../routes/Home";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface ProtectedProps {
  token: string | boolean | null;
  logout: () => void
}

const Protected:React.FC<ProtectedProps> = ({ token, logout }) => {
  return (
    <>
      <Routes>
        <Route
          element={
            <div className="container">
              <Navbar logout={logout}/>
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
