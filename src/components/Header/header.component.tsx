import {
  Layout,
  Avatar,
  Typography,
  Space,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Spin,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
  SettingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/auth.context";
import { useAuthStore } from "../../zustand/useAuthStore";
import useGetRequest from "../../hooks/useGetRequest";
import { ICurrencyRates } from "../../types/currencyRates.type";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

export function Header({
  darkTheme,
  toggleTheme,
}: {
  darkTheme: boolean;
  toggleTheme: () => void;
}) {
  const { data, loading, refresh } = useGetRequest<ICurrencyRates>(
    "/settings/currency-rates"
  );

  const { onLogout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { name, username } = user;

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    backgroundColor: darkTheme ? "#001529" : "#fff",
    color: darkTheme ? "#fff" : "#000",
    borderRadius: 8,
    boxShadow: darkTheme
      ? "0px 2px 8px rgba(0, 0, 0, 0.3)"
      : "0px 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    margin: 0,
    color: darkTheme ? "#fff" : "#000",
  };

  const textStyle = {
    color: darkTheme ? "#fff" : "#000",
    fontWeight: 500,
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Профиль",
          icon: <SettingOutlined />,
          onClick: () => navigate("/profile"),
        },
        {
          key: "logout",
          label: "Выход",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <AntHeader style={headerStyle}>
      <Space style={{ display: "flex", alignItems: "center" }}>
        <Title level={3} style={titleStyle}>
          Z-Finance
        </Title>

        {loading ? (
          <Space
            size="large"
            style={{ marginLeft: "20px", color: darkTheme ? "#fff" : "#000" }}
          >
            <Spin size="small" />
            <Text style={textStyle}>Загрузка курсов...</Text>
          </Space>
        ) : data ? (
          <Space
            size="large"
            style={{ marginLeft: "20px", color: darkTheme ? "#fff" : "#000" }}
          >
            <Tooltip title="Курс USD к RUB">
              <Text strong style={textStyle}>
                USD/RUB:{" "}
              </Text>
              <Text style={textStyle}>{data.USD_to_RUB.$numberDecimal}</Text>
            </Tooltip>
            <span style={{ marginLeft: 8 }}>|</span>
            <Tooltip title="Курс USD к CNY">
              <Text strong style={textStyle}>
                USD/CNY:{" "}
              </Text>
              <Text style={textStyle}>{data.USD_to_CNY.$numberDecimal}</Text>
            </Tooltip>

            <Button
              icon={
                <ReloadOutlined
                  style={{ color: darkTheme ? "#fff" : "#000" }}
                />
              }
              type="text"
              onClick={refresh}
              disabled={loading}
            />
          </Space>
        ) : (
          <Text style={textStyle}>Загрузка курсов...</Text>
        )}
      </Space>

      <Space size="large">
        <Button
          icon={
            darkTheme ? (
              <BulbFilled style={{ color: "#ffd700" }} />
            ) : (
              <BulbOutlined />
            )
          }
          type="text"
          onClick={toggleTheme}
        />

        <Dropdown
          overlay={userMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text style={textStyle}>
              {name} ({username})
            </Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
