import { useEffect, useState } from "react";
import useGetRequest from "../../hooks/useGetRequest";
import { ICashbox } from "../../types/cashbox.type";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Table,
  Typography,
} from "antd";
import useMessage from "antd/es/message/useMessage";
import { api } from "../../api/api";
import { DownOutlined } from "@ant-design/icons";
import { Currency } from "../../types/currency.type";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function Cashbox() {
  const navigate = useNavigate();
  const {
    data: cashboxes,
    loading,
    refresh,
    error,
  } = useGetRequest<ICashbox[]>("/cashbox");
  const [selectedCashbox, setSelectedCashbox] = useState<ICashbox | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    if (error) {
      messageApi.error(error || "Ошибка запроса.");
    }
  }, [error]);

  const handleSubmitForm = async (values: Partial<ICashbox>) => {
    setConfirmLoading(true);

    try {
      if (selectedCashbox) {
        await api.put(`/cashbox/${selectedCashbox._id}`, values);
        messageApi.success("Касса успешно обновлена.");
      } else {
        await api.post("/cashbox", values);
        messageApi.success("Касса успешно добавлена.");
      }

      refresh();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving cashbox", error);
      messageApi.error(error.response.data.error);
    } finally {
      setConfirmLoading(false);
      setSelectedCashbox(null);
    }
  };

  const handleOpenModal = (cashbox?: ICashbox) => {
    if (cashbox) {
      setSelectedCashbox(cashbox);
      form.setFieldsValue(cashbox);
    } else {
      form.resetFields();
    }

    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Валюта",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Баланс",
      dataIndex: "balance",
      key: "balance",
      render: (text: { $numberDecimal: string }) => {
        if (text && text.$numberDecimal) {
          return parseFloat(text.$numberDecimal);
        }
        return 0;
      },
    },
    {
      title: "Создал",
      dataIndex: "ownerName",
      key: "ownerName",
    },

    {
      title: "",
      key: "actions",
      render: (_: any, cashbox: ICashbox) => {
        const menu = (
          <Menu>
            <Menu.Item onClick={() => handleOpenModal(cashbox)}>
              Изменить
            </Menu.Item>

            <Menu.Item
              onClick={() =>
                navigate(`/transactions/${cashbox._id}/${cashbox.name}`)
              }
            >
              Смотреть транзакции
            </Menu.Item>
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
        {" "}
        <Title level={2}>Кассы</Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={cashboxes || []}
        rowKey={(record) => record._id}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={selectedCashbox ? "Изменить" : "Добавить "}
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

          {!selectedCashbox && (
            <Form.Item
              name="currency"
              label="Валюта"
              rules={[{ required: true, message: "Выберите валюту" }]}
            >
              <Select placeholder="Выберите валюту">
                {Object.values(Currency).map((currency) => (
                  <Select.Option key={currency} value={currency}>
                    {currency}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
