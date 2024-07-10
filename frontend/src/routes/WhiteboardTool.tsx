import { fabric } from "fabric";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import WhiteboardNav from "../components/WhiteboardNav";
import axios from "axios";
import jsPDF from "jspdf";
import {
  IconChevronDown,
  IconFileTypePng,
  IconFileTypePdf,
  IconDeviceFloppy,
  IconHomeFilled,
} from "@tabler/icons-react";

interface ProtectedProps {
  token: string | boolean | null;
}

const WhiteboardTool: React.FC<ProtectedProps> = ({ token }) => {
  const { sessionId } = useParams();
  const [canv, setCanv] = useState<fabric.Canvas | null>(null);
  const [whiteboardName, setWhiteboardName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const isDone = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDone.current) return;
    isDone.current = true;
    const initializeCanvas = () => {
      console.log("Inside Initialize Canvas");
      const canvas = new fabric.Canvas("canvas", {
        preserveObjectStacking: true,
        height: window.innerHeight - 100,
        width: window.innerWidth,
        backgroundColor: "#f0f0f0",
      });
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushSize;
      setCanv(canvas);
    };

    const setCanvas = (canvasData: string) => {
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
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [token, brushSize, selectedColor, sessionId]);

  useEffect(() => {
    if (canv) {
      canv.setWidth(windowSize[0]);
      canv.setHeight(windowSize[1]);
      canv.renderAll();
    }
  }, [windowSize, canv]);

  const handleSaveCanvas = async () => {
    const canvasJSON = canv?.toJSON();
    const canvasDataString = JSON.stringify(canvasJSON);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      await axios.post(
        `http://localhost:3000/whiteboard/${sessionId}/save`,
        JSON.stringify({
          canvasData: canvasDataString,
          canvasName: whiteboardName,
        }),
        {
          headers: headers,
        }
      );
      console.log("Canvas Saved Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWhiteboardName(e.target.value);
  };

  const handlePDFDownload = () => {
    const imgData = canv?.toDataURL({ format: "png" });
    if (imgData) {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("whiteboard.pdf");
    } else {
      console.error("No image data available to download as PDF");
    }
  };

  function handleImageDownload() {
    const dataUrl = canv?.toDataURL();
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = dataUrl as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className="menu">
        <div className="menu-item1">
          <button onClick={() => navigate("/")}>
            <IconHomeFilled size={20} />
          </button>
          <div className="line"></div>
          <div className="name">
            <p onClick={() => setIsEditing(!isEditing)} className="w-name">
              <span>{whiteboardName}</span>
              <IconChevronDown className="down-arrow" stroke={1} />
            </p>
            {isEditing && (
              <label className="name-change">
                <p className="board-name">Board Name</p>
                <input
                  type="text"
                  value={whiteboardName}
                  onChange={handleNameChange}
                  placeholder="Whiteboard Name"
                />
              </label>
            )}
          </div>
        </div>
        <div className="menu-item2">
          <button onClick={handleSaveCanvas}>
            <IconDeviceFloppy stroke={1.1} />
          </button>
          <button onClick={() => handleImageDownload()}>
            <IconFileTypePng stroke={1.1} />
          </button>
          <button onClick={() => handlePDFDownload()}>
            <IconFileTypePdf stroke={1.1} />
          </button>
        </div>
      </div>
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
