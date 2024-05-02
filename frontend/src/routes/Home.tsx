import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
