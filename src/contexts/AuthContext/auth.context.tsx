import { createContext, ReactNode, useContext, useEffect } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import { api } from "../../api/api";

interface AuthContextProps {
  onLogin: (username: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
}

const defaultAuthContext: AuthContextProps = {
  onLogin: async () => Promise.resolve(),
  onLogout: async () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setUser, user, clearUser } = useAuthStore();

  useEffect(() => {
    const getUser = async () => {
      if (user.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

        try {
          const response = await api.get("/user/me");

          const { _id, name, username } = response.data;

          setUser({
            token: user.token,
            refreshToken: user.refreshToken,
            authenticated: true,
            _id,
            name,
            username,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          return null;
        }
      }
    };

    getUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/user/login", {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      const { _id, name } = response.data.user;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser({
        token: accessToken,
        refreshToken: refreshToken,
        authenticated: true,
        _id,
        name,
        username,
      });

      return response.data;
    } catch (error) {
      return { error: true, message: (error as any).response.data.error };
    }
  };
  const logout = async () => {
    try {
      const response = await api.post("/user/logout");

      api.defaults.headers.common["Authorization"] = "";
      clearUser();
      localStorage.multiRemove(["token", "refreshToken", "auth-storage"]);

      return response;
    } catch (error) {
      return (error as any).response;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        onLogin: login,
        onLogout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
