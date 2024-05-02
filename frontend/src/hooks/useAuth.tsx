import { useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

const useAuth = () => {
  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    const client = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
    });

    client
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then((res) => {
        setLogin(res);
        setToken(client.token);
      });
  }, []);

  return [isLogin, token];
};

export default useAuth;
