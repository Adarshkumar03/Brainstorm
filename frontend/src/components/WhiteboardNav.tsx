import { fabric } from "fabric";
import { useEffect, useState } from "react";
import {
  IconSquare,
  IconCircle,
  IconWriting,
  IconTriangleSquareCircle,
  IconFileExport,
  IconPhotoUp
} from "@tabler/icons-react";

interface WhiteboardNavProps {
  canv: fabric.Canvas | null;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setBrushSize: React.Dispatch<React.SetStateAction<number>>;
  isDrawing: boolean;
  brushSize: number;
}

const WhiteboardNav = ({
  canv,
  setIsDrawing,
  setBrushSize,
  setSelectedColor,
  isDrawing,
  brushSize,
}: WhiteboardNavProps) => {
  useEffect(() => {
    canv?.on("object:added", function () {
      if (!isRedo) {
        setHistory([]);
      }
      setIsRedo(false);
    });
  }, []);

  const [isRedo, setIsRedo] = useState(false);
  const [history, setHistory] = useState<fabric.Object[]>([]);
  const [shapesDisplay, setShapesDisplay] = useState(false);
  const [redoDisp, setRedoDisp] = useState(false);

  const undo = () => {
    if (canv?._objects?.length > 0) {
      setHistory([...history, canv?._objects.pop() as fabric.Object]); // Type assertion
      canv?.renderAll();
    }
  };

  const redo = () => {
    if (history.length > 0) {
      setIsRedo(true);
      const newHist = [...history];
      const curr = newHist.pop() as fabric.Object; // Type assertion
      canv?.add(curr);
      setHistory(newHist);
    }
  };

  const addRect = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 50,
      height: 50,
      hasBorders: false,
    });
    canv?.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 40,
      fill: "green",
      left: 140,
      top: 100,
      hasBorders: false,
    });
    canv?.add(circle);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result;
        if (data) {
          // Check for existence
          fabric.Image.fromURL(data as string, (img) => {
            canv?.add(img).renderAll();
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    canv.freeDrawingBrush.color = color;
  };

  const handleBrushSizeChange = (newSize: number) => {
    setBrushSize(newSize);
    canv.freeDrawingBrush.width = newSize;
  };

  return (
    <div className="tool">
      <div className="undo-redo">
        {redoDisp && <button onClick={() => redo()}>Redo</button>}
        <button
          onClick={() => {
            undo();
            setRedoDisp(!redoDisp);
          }}
        >
          Undo
        </button>
      </div>
      <div className="shapes">
        <button onClick={() => setShapesDisplay(!shapesDisplay)}>
          <IconTriangleSquareCircle />
        </button>
        {shapesDisplay && (
          <div>
            <button onClick={addRect}>
              <IconSquare />
            </button>
            <button onClick={addCircle}>
              <IconCircle />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (canv) {
            setIsDrawing(!isDrawing);
            canv.isDrawingMode = isDrawing;
          }
        }}
      >
        Ink
      </button>
      <div className="color-picker">
        <button
          className="color-option"
          onClick={() => handleColorChange("red")}
        >
          <IconWriting color="red" />
        </button>
        <button
          className="color-option"
          onClick={() => handleColorChange("black")}
        >
          <IconWriting color="black" />
        </button>
        <button
          className="color-option"
          onClick={() => handleColorChange("green")}
        >
          <IconWriting color="green" />
        </button>
      </div>
      <div className="brush-size">
        <label htmlFor="brush-size-input">Brush Size:</label>
        <input
          type="range"
          id="brush-size-input"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value, 10))}
        />
      </div>
      <label className="file">
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleImageUpload}
        />
        <IconPhotoUp/>
      </label>
    </div>
  );
};

export default WhiteboardNav;
