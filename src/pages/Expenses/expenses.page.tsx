import useMessage from "antd/es/message/useMessage";
import { api } from "../../api/api";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import useGetRequest from "../../hooks/useGetRequest";
import { useEffect, useState } from "react";
import { IExpense } from "../../types/expense.type";

const { Title } = Typography;

export default function Expenses() {
  const {
    data: expenses,
    loading,
    refresh,
    error,
  } = useGetRequest<IExpense[]>("/expense");
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    if (error) {
      messageApi.error(error || "Ошибка запроса.");
    }
  }, [error]);

  const handleSubmitForm = async (values: { name: string }) => {
    setConfirmLoading(true);

    try {
      if (selectedExpense) {
        await api.put(`/expense/${selectedExpense._id}`, values);
        messageApi.success("Расход успешно обновлен.");
      } else {
        await api.post("/expense", values);
        messageApi.success("Расход успешно добавлен.");
      }

      refresh();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving expense", error);
      messageApi.error(error.response.data.error);
    } finally {
      setSelectedExpense(null);
      setConfirmLoading(false);
    }
  };

  const handleOpenModal = (expense?: IExpense) => {
    if (expense) {
      setSelectedExpense(expense);
      form.setFieldsValue(expense);
    } else {
      form.resetFields();
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expense/${id}`);
      messageApi.success("Расход успешно удалён.");
      refresh();
    } catch (error: any) {
      messageApi.error("Ошибка при удалении расхода.");
    }
  };

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Создал",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "",
      key: "actions",
      render: (_: any, expense: IExpense) => {
        const menu = (
          <Menu>
            <Menu.Item onClick={() => handleOpenModal(expense)}>
              Изменить
            </Menu.Item>
            <Popconfirm
              title="Вы уверены, что хотите удалить этот расход?"
              onConfirm={() => handleDelete(expense._id)}
              okText="Да"
              cancelText="Нет"
            >
              <Menu.Item>Удалить</Menu.Item>
            </Popconfirm>
          </Menu>
        );

        return (
          <Dropdown overlay={menu}>
            <Button type="link">
              Действия <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
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
        <Title level={2}>Расходы</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={expenses || []}
        rowKey={(record) => record._id}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={selectedExpense ? "Изменить" : "Добавить "}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form form={form} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: "Введите Имя категории" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
