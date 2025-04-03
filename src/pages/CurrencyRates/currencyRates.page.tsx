import { useEffect, useState } from "react";
import useGetRequest from "../../hooks/useGetRequest";
import { ICurrencyRates } from "../../types/currencyRates.type";
import { api } from "../../api/api";
import useMessage from "antd/es/message/useMessage";
import { Button, Card, Form, InputNumber, Modal, Spin, Typography } from "antd";

const { Title } = Typography;

export function CurrencyRates() {
  const { data, loading, refresh } = useGetRequest<ICurrencyRates>(
    "/settings/currency-rates"
  );
  const [currencyRates, setCurrencyRates] = useState<ICurrencyRates | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    if (data) {
      console.log(data);
      setCurrencyRates(data);
    }
  }, [data]);

  const handleSaveRates = async (values: Partial<ICurrencyRates>) => {
    setConfirmLoading(true);

    try {
      await api.post("/settings/currency-rates", values);

      messageApi.success("Курсы успешно обновлены.");
      refresh();
      setIsModalVisible(false);
    } catch (error) {
      messageApi.error("Ошибка при обновление курсов.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const openModal = () => {
    setIsEditing(!!currencyRates);
    setIsModalVisible(true);
    if (currencyRates) {
      form.setFieldsValue({
        USD_to_RUB: parseFloat(currencyRates.USD_to_RUB.$numberDecimal),
        USD_to_TJS: parseFloat(currencyRates.USD_to_TJS.$numberDecimal),
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Title level={2}>Курсы</Title>
      {loading ? (
        <Spin />
      ) : currencyRates ? (
        <Card style={{ width: 500 }}>
          <p>
            <strong>Курс USD к RUB:</strong>{" "}
            {currencyRates.USD_to_RUB.$numberDecimal}
          </p>
          <p>
            <strong>Курс USD к TJS:</strong>{" "}
            {currencyRates.USD_to_TJS.$numberDecimal}
          </p>
          <p>
            <strong>Обновлено:</strong> {currencyRates.lastUpdate}
          </p>
          <Button type="primary" onClick={openModal} style={{ marginTop: 16 }}>
            Изменить
          </Button>
        </Card>
      ) : (
        <Card title="Курсы не найдены" style={{ width: 500 }}>
          <Button type="primary" onClick={openModal}>
            Добавить
          </Button>
        </Card>
      )}

      <Modal
        title={isEditing ? "Редактировать" : "Добавить"}
        onCancel={() => setIsModalVisible(false)}
        open={isModalVisible}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form onFinish={handleSaveRates} form={form} layout="vertical">
          <Form.Item
            label="Курс USD к RUB"
            name="USD_to_RUB"
            rules={[{ required: true, message: "Пожалуйста, введите курс!" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Курс USD к TJS"
            name="USD_to_TJS"
            rules={[{ required: true, message: "Пожалуйста, введите курс!" }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
