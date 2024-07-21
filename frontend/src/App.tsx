
import Protected from "./components/Protected";
import Public from "./components/Public";
import useAuth from "./hooks/useAuth";
import "./styles.css";

function App() {
  const [isLogin, token, logout] = useAuth();
  return (
    isLogin?<Protected token={token} logout={logout}/>:<Public/>
  );
}

export default App;
