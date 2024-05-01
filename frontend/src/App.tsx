import WhiteboardTool from "./routes/WhiteboardTool";
import Home from "./routes/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/whiteboard/:sessionId" element={<WhiteboardTool />} />
    </Routes>
  );
}

export default App;
