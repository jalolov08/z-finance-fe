import { Card, Typography, Spin, Alert, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { exceptedCashboxes } from "../../config/config";
import useGetRequest from "../../hooks/useGetRequest";

const { Title, Text } = Typography;

export default function Home() {
  const query = exceptedCashboxes.join(",");
  const { data, loading, error, refresh } = useGetRequest<number>(
    `/cashbox/total-amount?exceptedCashboxes=${query}`
  );

  return (
    <div style={{ padding: 24, margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Title level={2}>🏠 Главная</Title>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Spin tip="Загрузка..." size="large" />
          </div>
        ) : error ? (
          <Alert message="Ошибка" description={error} type="error" showIcon />
        ) : (
          <div style={{ marginTop: 24 }}>
            <Text strong style={{ fontSize: 18 }}>
              💰 Общая сумма касс (TJS):
            </Text>
            <div style={{ fontSize: 32, marginTop: 10 }}>
              <Title type="success">
                {data?.toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "TJS",
                })}
              </Title>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={refresh}
                loading={loading}
              >
                Обновить
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
