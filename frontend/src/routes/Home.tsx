import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { IconHexagonPlusFilled } from "@tabler/icons-react";

const Home = ({ token }) => {
  const isDone = useRef(false);
  const [whiteboards, setWhiteboards] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isDone.current) return;
    isDone.current = true;
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

  const handleDelete = (sessionId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`/whiteboard/${sessionId}`, config)
      .then((res) => {
        console.log(`Whiteboard deleted with id:${sessionId}`);
        fetchWhiteboards();
        navigate("/");
      })
      .catch((err) => console.log("Failed to delete whiteboard"));
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
            <p style={{ borderTop: "1px solid black" }}>
              {wb?.canvasName || "Untitled Whiteboard"}
            </p>
            <button onClick={() => handleDelete(wb?.sessionId)}>Delete</button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
