import { fabric } from "fabric";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import WhiteboardNav from "../components/WhiteboardNav";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const WhiteboardTool = ({ token }) => {
  const { sessionId } = useParams();
  const [canv, setCanv] = useState<fabric.Canvas | null>(null);
  const [whiteboardName, setWhiteboardName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const initializeCanvas = () => {
      console.log("Inside Initialize Canvas");
      const canvas = new fabric.Canvas("canvas", {
        preserveObjectStacking: true,
        height: window.innerHeight - 100,
        width: window.innerWidth,
        backgroundColor: "grey",
      });
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushSize;
      canvas.on("object:moving", (event) => {
        handleCursorMove({ x: event.pointer.x, y: event.pointer.y });
      });
      setCanv(canvas);
    };

    const setCanvas = (canvasData) => {
      console.log("Inside Set Canvas");
      const canvas = new fabric.Canvas("canvas");
      const canvasJSON = JSON.parse(canvasData);

      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);

      canvas.loadFromJSON(canvasJSON, canvas.renderAll.bind(canvas));

      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushSize;
      canvas.on("object:moving", (event) => {
        handleCursorMove({ x: event.pointer.x, y: event.pointer.y });
      });
      setCanv(canvas);
    };

    const fetchData = async () => {
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      axios.get(`/whiteboard/${sessionId}`, config).then((res) => {
        if (Object.keys(res.data.canvasData).length == 0) {
          initializeCanvas();
          setWhiteboardName("Untitled Whiteboard");
        } else {
          setCanvas(res.data.canvasData);
          setWhiteboardName(res.data.canvasName);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (canv) {
      canv.setWidth(windowSize[0]);
      canv.setHeight(windowSize[1]);
      canv.renderAll();
    }
  }, [windowSize, canv]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("otherUserCursor", (data) => {
      // Update display of other users' cursors based on data
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Cleanup function
    return () => socket.disconnect();
  }, []);

  const handleCursorMove = (position) => {
    socket.emit("cursorPosition", position);
  };

  const handleSaveCanvas = async () => {
    const canvasJSON = canv?.toJSON();
    const canvasDataString = JSON.stringify(canvasJSON);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(
        `http://localhost:3000/whiteboard/${sessionId}/save`,
        JSON.stringify({
          canvasData: canvasDataString,
          canvasName: whiteboardName,
        }),
        {
          headers: headers,
        }
      )
      .then((res) => {
        console.log("Canvas Saved Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNameChange = (e) => {
    setWhiteboardName(e.target.value);
  };
  return (
    <div>
      <input
        type="text"
        value={whiteboardName}
        onChange={handleNameChange}
        placeholder="Whiteboard Name"
      />
      <button onClick={handleSaveCanvas}>Save Whiteboard</button>
      <WhiteboardNav
        canv={canv}
        setIsDrawing={setIsDrawing}
        isDrawing={isDrawing}
        setSelectedColor={setSelectedColor}
        setBrushSize={setBrushSize}
        brushSize={brushSize}
      />
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default WhiteboardTool;
