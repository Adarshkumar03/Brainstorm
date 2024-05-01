import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [whiteboards, setWhiteboards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWhiteboards = async () => {
      try {
        const response = await fetch("http://localhost:3000/whiteboard/all");
        const data = await response.json();
        setWhiteboards(data);
      } catch (err) {
        console.error("Error fetching whiteboards: ", err);
      }
    };
    fetchWhiteboards();
  }, []);

  const handleCreateNewSession = async () => {
    try {
      const response = await fetch("http://localhost:3000/whiteboard/new", {
        method: "GET",
      });
      const { sessionId } = await response.json();
      navigate(`/whiteboard/${sessionId}`);
    } catch (err) {
      console.error("Error creating new session: ", err);
    }
  };

  return (
    <div>
      <h1>Welcome User!!</h1>
      <button onClick={handleCreateNewSession}>New Whiteboard</button>
      <div>
        {whiteboards.map((wb) => (
          <div>
            <Link to={`/whiteboard/${wb?.sessionId}`}>
              {wb?.canvasName || "Untitled Whiteboard"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
