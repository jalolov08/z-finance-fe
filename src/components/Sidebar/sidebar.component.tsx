import { Menu } from "antd";
import { items } from "../../constants/items.constant";
import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar({ darkTheme }: { darkTheme: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Menu
      onClick={(item) => {
        navigate(item.key);
      }}
      selectedKeys={[currentPath]}
      items={items}
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      style={{
        fontSize: "1rem",
        marginTop: 80,
      }}
    />
  );
}
