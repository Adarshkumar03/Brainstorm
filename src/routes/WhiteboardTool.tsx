import { fabric } from "fabric";
import { useState, useEffect } from "react";
import WhiteboardNav from "../components/WhiteboardNav/WhiteboardNav";

const WhiteboardTool = () => {
  const [canv, setCanv] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 1500,
      height: 700,
      backgroundColor: "#f0f0f0",
      preserveObjectStacking: true
    });
    canvas.isDrawingMode = false;
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;
    setCanv(canvas);
  }, []);

  return (
    <div>
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
