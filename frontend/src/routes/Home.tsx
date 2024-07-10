import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { IconHexagonPlusFilled, IconTrash } from "@tabler/icons-react";

interface ProtectedProps {
  token: string | boolean | null;
}

interface Whiteboard {
  sessionId: string;
  canvasName: string;
}

const Home:React.FC<ProtectedProps> = ({ token }) => {
  const isDone = useRef(false);
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const navigate = useNavigate();

  const fetchWhiteboards = useCallback(async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get("/whiteboard/all", config);
      setWhiteboards(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (isDone.current) return;
    isDone.current = true;
    fetchWhiteboards();
  }, [fetchWhiteboards]);

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

  const handleDelete = async (sessionId: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`/whiteboard/${sessionId}`, config);
      console.log(`Whiteboard deleted with id: ${sessionId}`);
      fetchWhiteboards();
      navigate("/");
    } catch (err) {
      console.log("Failed to delete whiteboard");
    }
  };

  return (
    <div className="whiteboard-container">
      <button onClick={handleCreateNewSession} className="add-btn new">
        <IconHexagonPlusFilled size={70} color="#fff" stroke={1.5} />
        <p style={{ fontSize: "15px", marginTop: "5px" }}>New Whiteboard</p>
      </button>
      {whiteboards.map((wb) => (
        <Link
          to={`/whiteboard/${wb?.sessionId}`}
          className="add-btn whiteboard"
        >
          <div className="top"></div>
          <div className="bottom">
            <p>{wb?.canvasName || "Untitled Whiteboard"}</p>
            <button onClick={() => handleDelete(wb?.sessionId)}>
              <IconTrash color="#ea0606"/>
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
