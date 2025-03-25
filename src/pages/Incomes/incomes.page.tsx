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
import { IIncome } from "../../types/income.type";

const { Title } = Typography;

export default function Incomes() {
  const {
    data: incomes,
    loading,
    refresh,
    error,
  } = useGetRequest<IIncome[]>("/income");
  const [selectedIncome, setSelectedIncome] = useState<IIncome | null>(null);
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
      if (selectedIncome) {
        await api.put(`/income/${selectedIncome._id}`, values);
        messageApi.success("Приход успешно обновлен.");
      } else {
        await api.post("/income", values);
        messageApi.success("Приход успешно добавлен.");
      }

      refresh();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving income", error);
      messageApi.error(error.response.data.error);
    } finally {
      setSelectedIncome(null);
      setConfirmLoading(false);
    }
  };

  const handleOpenModal = (income?: IIncome) => {
    if (income) {
      setSelectedIncome(income);
      form.setFieldsValue(income);
    } else {
      form.resetFields();
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/income/${id}`);
      messageApi.success("Приход успешно удалён.");
      refresh();
    } catch (error: any) {
      messageApi.error("Ошибка при удалении прихода.");
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
      render: (_: any, income: IIncome) => {
        const menu = (
          <Menu>
            <Menu.Item onClick={() => handleOpenModal(income)}>
              Изменить
            </Menu.Item>
            <Popconfirm
              title="Вы уверены, что хотите удалить этот приход?"
              onConfirm={() => handleDelete(income._id)}
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
        <Title level={2}>Приходы</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={incomes || []}
        rowKey={(record) => record._id}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={selectedIncome ? "Изменить" : "Добавить "}
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
