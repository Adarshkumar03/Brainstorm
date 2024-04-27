import { useEffect, useState } from "react";
import { fabric } from "fabric";
import Button from "react-bootstrap/Button";

function App() {
  const [canv, setCanv] = useState<fabric.Canvas | null>(null);
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 1500,
      height: 700,
      backgroundColor: "#f0f0f0",
    });
    canvas.isDrawingMode = false;
    setCanv(canvas);
  }, []);

  const addRect = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 20,
      height: 20,
      angle: 45,
      hasBorders: false,
    });
    canv?.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 20,
      fill: "green",
      left: 140,
      top: 100,
      hasBorders: false,
    });
    canv?.add(circle);
  };

  const addNote = () => {
    const note = new fabric.Rect({
      left: 80,
      top: 100,
      width: 100,
      height: 100,
    });

    canv?.add(note);
  };

  const handleImageUpload = (e) => {
    const file = e?.target.files[0];
    if(file.type.startsWith('image/')){
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result;
        fabric.Image.fromURL(data, (img) => {
          canv?.add(img).renderAll();
          setImage(data);
        })
      }
      reader.readAsDataURL(file); 
    }
  }

  return (
    <>
      <div>
        <Button variant="primary" onClick={addRect}>
          Add Rectangle
        </Button>
        <Button onClick={addCircle}>Add Circle</Button>
        <Button>Add Shapes</Button>
        <Button onClick={()=>{
          if(canv){
            setIsDrawing(!isDrawing);
            canv.isDrawingMode = isDrawing;
          }
        }}>Ink</Button>
        <label>
          <input type="file" accept="image/png,image/jpeg,image/gif" onChange={handleImageUpload}/>
        </label>

        <button onClick={addNote}>Add Note</button>
        <Button onClick={() => console.log(JSON.stringify(canv))}>
          JSON string(see console)
        </Button>
        <canvas id="canvas"></canvas>
      </div>
    </>
  );
}

export default App;
