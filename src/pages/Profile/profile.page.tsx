import { useState } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Space,
  Typography,
} from "antd";
import { User } from "../../types/user.type";
import useMessage from "antd/es/message/useMessage";
import { api } from "../../api/api";

const { Title } = Typography;

export function Profile() {
  const { user, setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = useMessage();
  const [form] = Form.useForm();

  const handleOpenModal = () => {
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (values: Partial<User>) => {
    const { name, username, password } = values;

    const updatedValues: Partial<User> = {};
    if (name && name !== user.name) updatedValues.name = name;
    if (username && username !== user.username)
      updatedValues.username = username;
    if (password) updatedValues.password = password;

    if (Object.keys(updatedValues).length === 0) {
      messageApi.info("Нет изменений для обновления.");
      return;
    }

    setConfirmLoading(true);
    try {
      const response = await api.put("/user/", updatedValues);
      messageApi.success("Профиль успешно обновлён.");

      setUser(response.data.user);
      setIsModalOpen(false);
      setConfirmLoading(false);
    } catch (error: any) {
      setConfirmLoading(false);
      messageApi.error(error.response?.data.error);
    }
  };
  return (
    <Card style={{ maxWidth: 600, margin: "auto", marginTop: 32, padding: 24 }}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Профиль
        </Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Имя">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Логин">{user.username}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" block onClick={handleOpenModal}>
          Изменить профиль
        </Button>
      </Space>

      <Modal
        title="Изменить профиль"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form form={form} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input placeholder="Введите ваше имя" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Логин"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="Введите ваш логин" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            tooltip="Оставьте пустым, если не хотите менять пароль"
          >
            <Input.Password placeholder="Новый пароль" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
