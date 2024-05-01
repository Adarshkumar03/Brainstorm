import { fabric } from "fabric";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import WhiteboardNav from "../components/WhiteboardNav";

const WhiteboardTool = () => {
  const { sessionId } = useParams();
  const [canv, setCanv] = useState<fabric.Canvas | null>(null);
  const [whiteboardName, setWhiteboardName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  console.log(viewportHeight, viewportWidth);
  useEffect(() => {
    const initializeCanvas = () => {
      console.log("Inside Initialize Canvas");
      const canvas = new fabric.Canvas("canvas", {
        preserveObjectStacking: true,
        height: viewportHeight - 100,
        width: viewportWidth,
        backgroundColor: "grey",
      });
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushSize;
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
      setCanv(canvas);
    };

    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3000/whiteboard/${sessionId}`
      );
      const data = await response.json();
      if (Object.keys(data.canvasData).length == 0) {
        initializeCanvas();
        setWhiteboardName("Untitled Whiteboard");
      } else {
        setCanvas(data.canvasData);
        setWhiteboardName(data.canvasName);
      }
    };
    fetchData();
  }, []);

  const handleSaveCanvas = async () => {
    try {
      const canvasJSON = canv?.toJSON();
      const canvasDataString = JSON.stringify(canvasJSON);
      const response = await fetch(
        `http://localhost:3000/whiteboard/${sessionId}/save`,
        {
          method: "POST",
          body: JSON.stringify({
            canvasData: canvasDataString,
            canvasName: whiteboardName,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Error saving canvas data");
      }
      console.log("Canvas data saved successfully!");
    } catch (error) {
      console.error("Error saving canvas:", error);
    }
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
