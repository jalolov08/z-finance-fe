import { Form, Input, Button, Typography, Card, Row, Col, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext/auth.context";
import useMessage from "antd/es/message/useMessage";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export function Login() {
  const { onLogin } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    const res = await onLogin(values.username, values.password);
    setLoading(false);
    console.log(res);

    if (res.accessToken) {
      messageApi.success("Успешный вход");
      navigate("/");
    } else {
      messageApi.error(res.message || "Login failed");
    }
  };

  return (
    <>
      {contextHolder}
      <Row
        justify="center"
        align="middle"
        style={{ height: "100vh", backgroundColor: "#f0f5ff" }}
      >
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Space
              direction="vertical"
              size="large"
              style={{ display: "flex" }}
            >
              <Title level={2}>Вход</Title>
              <Form
                form={form}
                name="login_form"
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста введите имя пользователя!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Username"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Пожалуйста введите пароль!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Password"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{ borderRadius: "8px", fontWeight: "bold" }}
                    loading={loading}
                  >
                    Войти
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
