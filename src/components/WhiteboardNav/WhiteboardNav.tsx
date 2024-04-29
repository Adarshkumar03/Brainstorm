import { fabric } from "fabric";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

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

  // const addNote = () => {
  //   const note = new fabric.Rect({
  //     left: 80,
  //     top: 100,
  //     width: 100,
  //     height: 100,
  //   });

  //   canv?.add(note);
  // };

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

  const handlePDFDownload = (e) => {
    const imgData = canv?.toDataURL("png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "png", 0, 0);
    pdf.save("whiteboard.pdf");
  };

  function handleImageDownload(e) {
    const dataUrl = canv?.toDataURL("png"); // Can specify 'jpg', etc.

    // Creating a download trigger mechanism
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    canv.freeDrawingBrush.color = color;
  };

  const handleBrushSizeChange = (newSize: number) => {
    setBrushSize(newSize);
    canv.freeDrawingBrush.width = newSize;
  };

  return (
    <div className="nav">
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
      <button>Add Shapes</button>
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
          style={{ backgroundColor: "red" }}
          onClick={() => handleColorChange("red")}
        ></button>
        <button
          className="color-option"
          style={{ backgroundColor: "black" }}
          onClick={() => handleColorChange("black")}
        ></button>
        <button
          className="color-option"
          style={{ backgroundColor: "green" }}
          onClick={() => handleColorChange("green")}
        ></button>
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
      <label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleImageUpload}
        />
      </label>
      {/* <button onClick={addNote}>Add Note</button> */}
      <button onClick={() => console.log(JSON.stringify(canv))}>
        JSON string(see console)
      </button>
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>
      <button onClick={(e) => handleImageDownload(e)}>Save as PNG</button>
      <button onClick={(e) => handlePDFDownload(e)}>Save as PDF</button>
    </div>
  );
};

export default WhiteboardNav;
