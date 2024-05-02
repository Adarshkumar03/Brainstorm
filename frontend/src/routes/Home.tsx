import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { IconCirclePlus } from "@tabler/icons-react";

const Home = ({ token }) => {
  const [whiteboards, setWhiteboards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWhiteboards = async () => {
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      axios
        .get("/whiteboard/all", config)
        .then((res) => setWhiteboards(res.data))
        .catch((err) => console.error(err));
    };
    fetchWhiteboards();
  }, []);

  const handleCreateNewSession = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    axios
      .get("/whiteboard/new", config)
      .then((res) => {
        const { sessionId } = res.data;
        navigate(`/whiteboard/${sessionId}`);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="whiteboard-container">
      <button onClick={handleCreateNewSession} className="add-btn">
        <IconCirclePlus size={70} color="#000" stroke={1.5} />
        <p style={{ fontSize: "15px", marginTop: "5px" }}>New Whiteboard</p>
      </button>
      {whiteboards.map((wb) => (
        <Link to={`/whiteboard/${wb?.sessionId}`} className="add-btn whiteboard">
          <div className="top"></div>
          <p style={{borderTop:"1px solid black"}}>{wb?.canvasName || "Untitled Whiteboard"}</p>
        </Link>
      ))}
    </div>
  );
};

export default Home;
