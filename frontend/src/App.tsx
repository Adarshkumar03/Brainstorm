import WhiteboardTool from "./routes/WhiteboardTool";
import { Routes, Router, Route } from "react-router-dom";


function App() {
  return (
    <Routes>
        <Route path="/whiteboard" element={<WhiteboardTool />} />
    </Routes>
  );
}

export default App;
