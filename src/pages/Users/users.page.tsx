import { Button, Form, Input, Modal, Table, Typography } from "antd";
import useGetRequest from "../../hooks/useGetRequest";
import { useEffect, useState } from "react";
import useMessage from "antd/es/message/useMessage";
import { api } from "../../api/api";
import { User } from "../../types/user.type";

const { Title } = Typography;

export function Users() {
  const {
    data: users,
    loading: usersLoading,
    refresh,
    error,
  } = useGetRequest<User[]>(`/user/all`);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    if (error) {
      messageApi.error(error || "Ошибка запроса.");
    }
  }, [error]);

  const handleSubmitForm = async (values: any) => {
    setConfirmLoading(true);

    try {
      await api.post("/user/new", values);
      messageApi.success("Пользователь успешно добавлен.");

      refresh();
      setIsModalOpen(false);
      setConfirmLoading(false);
    } catch (error: any) {
      setConfirmLoading(false);
      console.error("Error saving ware house", error);
      messageApi.error(error.response.data.error);
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Пользователи</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить
        </Button>
      </div>

      <Table
        loading={usersLoading}
        columns={columns}
        dataSource={users || []}
        rowKey={(record) => record._id}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Добавить "
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form form={form} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: "Введите Имя" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Логин"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите новый пароль",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
