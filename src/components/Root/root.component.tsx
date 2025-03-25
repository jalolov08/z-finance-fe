import { useState, useEffect } from "react";
import { Layout } from "antd";
import { Sidebar } from "../Sidebar/sidebar.component";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/header.component";

const { Sider, Content } = Layout;

export function Root() {
  const getStoredTheme = () => localStorage.getItem("darkTheme") === "true";
  const [darkTheme, setDarkTheme] = useState(getStoredTheme());

  useEffect(() => {
    localStorage.setItem("darkTheme", darkTheme.toString());
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((prev) => !prev);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme={darkTheme ? "dark" : "light"}
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
          background: darkTheme ? "#001529" : "#fff",
          color: darkTheme ? "#fff" : "#000",
        }}
      >
        <Sidebar darkTheme={darkTheme} />
      </Sider>
      <Layout style={{ padding: 24, minHeight: "100vh" }}>
        <Header darkTheme={darkTheme} toggleTheme={toggleTheme} />
        <Content style={{ paddingTop: 80 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
