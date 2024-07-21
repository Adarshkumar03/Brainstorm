import { useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

type AuthTuple = [boolean, string | null, () => void];

const useAuth = (): AuthTuple => {
  const [isLogin, setLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const isRun = useRef(false);
  const clientRef = useRef<Keycloak | null>(null);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const client = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
    });

    clientRef.current = client;

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

  const logout = () => {
    const client = clientRef.current;
    if (client) {
      client.logout();
    }
  };

  return [isLogin, token, logout];
};

export default useAuth;
