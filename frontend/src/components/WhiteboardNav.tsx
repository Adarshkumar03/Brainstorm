import { fabric } from "fabric";
import { useEffect, useState } from "react";
import {
  IconSquare,
  IconCircle,
  IconWriting,
  IconTriangleSquareCircle,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconPhotoUp,
  IconBrush,
  IconBallpen,
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
  const [inkDisp, setInkDisp] = useState(false);
  const [brushInputDisp, setBrishInputDisp] = useState(false);

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
        {redoDisp && (
          <button onClick={() => redo()} className="redo">
            <IconArrowForwardUp stroke={1} />
          </button>
        )}
        <button
          onClick={() => {
            undo();
            setRedoDisp(!redoDisp);
          }}
        >
          <IconArrowBackUp stroke={1} />
        </button>
      </div>
      <div className="shapes-container">
        <button onClick={() => setShapesDisplay(!shapesDisplay)}>
          <IconTriangleSquareCircle stroke={1} />
        </button>
        {shapesDisplay && (
          <div className="shapes">
            <button onClick={addRect}>
              <IconSquare stroke={1} />
            </button>
            <button onClick={addCircle}>
              <IconCircle stroke={1} />
            </button>
          </div>
        )}
      </div>

      <div className="ink-container">
        <button
          onClick={() => {
            setRedoDisp(false);
            setBrishInputDisp(false);
            setShapesDisplay(false);
            if (canv) {
              setIsDrawing(!isDrawing);
              setInkDisp(!inkDisp);
              canv.isDrawingMode = isDrawing;
            }
          }}
        >
          <IconBallpen stroke={1} />
        </button>
        {inkDisp && (
          <div className="color-picker">
            <button
              className="color-option"
              onClick={() => {
                handleColorChange("red");
                setRedoDisp(false);
                setShapesDisplay(false);
                setBrishInputDisp(false);
                if (canv) {
                  setIsDrawing(true);
                  setInkDisp(false);
                  canv.isDrawingMode = true;
                }
              }}
            >
              <IconWriting color="red" stroke={1} />
            </button>
            <button
              className="color-option"
              onClick={() => {
                handleColorChange("black");
                setRedoDisp(false);
                setShapesDisplay(false);
                setBrishInputDisp(false);
                if (canv) {
                  setIsDrawing(true);
                  setInkDisp(false);
                  canv.isDrawingMode = true;
                }
              }}
            >
              <IconWriting color="black" stroke={1} />
            </button>
            <button
              className="color-option"
              onClick={() => {
                handleColorChange("green");
                setRedoDisp(false);
                setShapesDisplay(false);
                setBrishInputDisp(false);
                if (canv) {
                  setIsDrawing(true);
                  setInkDisp(false);
                  canv.isDrawingMode = true;
                }
              }}
            >
              <IconWriting color="green" stroke={1} />
            </button>
          </div>
        )}
      </div>

      <div className="brush-size">
        <button
          onClick={() => {
            setBrishInputDisp(!brushInputDisp);
            setShapesDisplay(false);
            setInkDisp(false);
            setRedoDisp(false);
          }}
        >
          <IconBrush stroke={1} />
        </button>
        {brushInputDisp && (
          <input
            type="range"
            id="brush-size-input"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) =>
              handleBrushSizeChange(parseInt(e.target.value, 10))
            }
            className="brush-input"
          />
        )}
      </div>
      <label className="file">
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleImageUpload}
        />
        <IconPhotoUp stroke={1} color="red"/>
      </label>
    </div>
  );
};

export default WhiteboardNav;
