import { useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

const useAuth = () => {
  const [isLogin, setLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
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
        if(client.token)
          setToken(client.token);
      });
  }, []);

  return [isLogin, token];
};

export default useAuth;
