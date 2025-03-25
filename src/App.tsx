import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuthStore } from "./zustand/useAuthStore";
import { Login } from "./pages/Login/login.page";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import Home from "./pages/Home/home.page";
import { Root } from "./components/Root/root.component";
import { Users } from "./pages/Users/users.page";
import { Profile } from "./pages/Profile/profile.page";

function App() {
  const { user } = useAuthStore();

  return (
    <>
      <Routes>
        {!user.authenticated && <Route path="login" element={<Login />} />}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
