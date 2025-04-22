import { useEffect, useState } from "react";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "../../types/transaction.type";
import useGetRequest from "../../hooks/useGetRequest";
import { IExpense } from "../../types/expense.type";
import { IIncome } from "../../types/income.type";
import { ICashbox } from "../../types/cashbox.type";
import { api } from "../../api/api";
import { Currency } from "../../types/currency.type";
import useMessage from "antd/es/message/useMessage";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Transactions() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency | undefined>(undefined);
  const [type, setType] = useState<TransactionType | undefined>(undefined);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined
  );
  const [expenseId, setExpenseId] = useState<string | undefined>(undefined);
  const [cashboxId, setCashboxId] = useState<string | undefined>(undefined);
  const [incomeId, setIncomeId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = useMessage();
  const [form] = Form.useForm();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | undefined
  >([dayjs().startOf("month"), dayjs().endOf("month")]);
  const { data: expenseList, loading: expenseListLoading } =
    useGetRequest<IExpense[]>("/expense");
  const { data: incomeList, loading: incomeListLoading } =
    useGetRequest<IIncome[]>("/income");
  const { data: cashboxList, loading: casxhboxListLoading } =
    useGetRequest<ICashbox[]>("/cashbox");

  const handleRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(undefined);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get<{
        transactions: ITransaction[];
        total: number;
      }>("/transaction", {
        params: {
          page,
          pageSize,
          type,
          expenseId,
          incomeId,
          cashboxId,
          currency,
          search: searchTerm,
          startDate: dateRange ? dateRange[0] : undefined,
          endDate: dateRange ? dateRange[1] : undefined,
          status,
        },
      });

      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Ошибка получение транзакций", error);
      messageApi.error("Ошибка получение транзакций");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (values: Partial<ITransaction>) => {
    setConfirmLoading(true);

    try {
      await api.post("/transaction", values);
      messageApi.success("Транзакция успешно создана.");

      fetchTransactions();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving transaction", error);
      messageApi.error(error.response.data.error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCompleteTransactions = async () => {
    setConfirmLoading(true);

    try {
      await api.post("/transaction/complete", {
        transactionIds: selectedTransactions,
      });
      messageApi.success("Транзакции успешно завершены.");

      fetchTransactions();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving transaction", error);
      messageApi.error(error.response.data.error);
    } finally {
      setConfirmLoading(false);
      setSelectedTransactions([]);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transaction/${id}`);

      messageApi.success("Транзакция успешно удалена.");
      fetchTransactions();
    } catch (error: any) {
      messageApi.error(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    page,
    pageSize,
    type,
    incomeId,
    expenseId,
    cashboxId,
    currency,
    searchTerm,
    dateRange,
    status,
  ]);

  const columns = [
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Касса",
      dataIndex: "cashboxName",
      key: "cashboxName",
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Валюта",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      render: (text: any) => {
        return `
        USD: ${parseFloat(text.USD.$numberDecimal).toFixed(2)}
        | RUB: ${parseFloat(text.RUB.$numberDecimal).toFixed(2)} 
       | TJS: ${parseFloat(text.TJS.$numberDecimal).toFixed(2)} 
          `;
      },
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Курс USD/RUB",
      dataIndex: "USD_to_RUB",
      key: "USD_to_RUB",
      render: (text: { $numberDecimal: string }) =>
        parseFloat(text.$numberDecimal),
    },
    {
      title: "Курс USD/TJS",
      dataIndex: "USD_to_TJS",
      key: "USD_to_TJS",
      render: (text: { $numberDecimal: string }) =>
        parseFloat(text.$numberDecimal),
    },
    {
      title: "Имя расхода",
      dataIndex: "expenseName",
      key: "expenseName",
    },
    {
      title: "Имя прихода",
      dataIndex: "incomeName",
      key: "incomeName",
    },
    {
      title: "Баланс до",
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      render: (text: { $numberDecimal: string }) =>
        parseFloat(text.$numberDecimal).toFixed(2),
    },
    {
      title: "Баланс после",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (text: { $numberDecimal: string }) =>
        parseFloat(text.$numberDecimal).toFixed(2),
    },
    {
      title: "Создал",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Завершено в ",
      dataIndex: "completedAt",
      key: "completedAt",
    },
    {
      title: "Завершил ",
      dataIndex: "completedByName",
      key: "completedByName",
    },
    {
      title: "",
      key: "actions",
      render: (_: any, transaction: ITransaction) => {
        const menu = (
          <Menu>
            <Popconfirm
              title="Вы уверены, что хотите удалить эту транзакцию?"
              onConfirm={() => handleDeleteTransaction(transaction._id)}
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const rowClassName = (record: ITransaction) => {
    if (record.status === TransactionStatus.COMPLETED) {
      return "row-green";
    } else if (record.status === TransactionStatus.PENDING) {
      return "row-yellow";
    }
    return "";
  };

  const rowSelection = {
    selectedRowKeys: selectedTransactions,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedTransactions(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Title level={2}>Транзакции </Title>

      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={handleRangeChange}
          placeholder={["Начало", "Конец"]}
          format="DD.MM.YY"
          value={dateRange}
        />

        <Search
          placeholder="Поиск по названию"
          onSearch={handleSearch}
          allowClear
        />
        <Select
          placeholder="Фильтр по статусу"
          onChange={(value) => setStatus(value)}
          allowClear
          style={{ width: 200 }}
        >
          {Object.values(TransactionStatus).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Фильтр по типу транзакции"
          onChange={(value) => setType(value)}
          allowClear
          style={{ width: 200 }}
        >
          {Object.values(TransactionType).map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Фильтр по валюте"
          onChange={(value) => setCurrency(value)}
          allowClear
          style={{ width: 200 }}
        >
          {Object.values(Currency).map((currency) => (
            <Option key={currency} value={currency}>
              {currency}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Фильтр по кассе"
          onChange={(value) => setCashboxId(value)}
          allowClear
          style={{ width: 200 }}
          loading={casxhboxListLoading}
        >
          {cashboxList?.map((cashbox) => (
            <Option key={cashbox._id} value={cashbox._id}>
              {cashbox.name} | {cashbox.currency}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Фильтр по расходу"
          onChange={(value) => setExpenseId(value)}
          allowClear
          style={{ width: 200 }}
          loading={expenseListLoading}
        >
          {expenseList?.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Фильтр по приходу"
          onChange={(value) => setIncomeId(value)}
          allowClear
          style={{ width: 200 }}
          loading={incomeListLoading}
        >
          {incomeList?.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Добавить
        </Button>

        <Button
          type="primary"
          onClick={handleCompleteTransactions}
          disabled={selectedTransactions.length === 0}
          loading={confirmLoading}
        >
          Завершить
        </Button>
      </Space>

      <Table
        rowSelection={rowSelection}
        rowClassName={rowClassName}
        columns={columns}
        dataSource={transactions}
        rowKey={(record) => record._id}
        pagination={{
          current: page,
          total,
          pageSize,
          onChange: (page, size) => {
            setPage(page);
            if (size !== pageSize) setPageSize(size!);
          },
          showSizeChanger: true,
        }}
        scroll={{ x: "max-content" }}
        loading={loading}
      />

      <Modal
        title="Добавить транзакцию"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form form={form} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            name="type"
            label="Тип транзакции"
            rules={[{ required: true, message: "Выберете тип транзакции" }]}
          >
            <Select
              onChange={(type) => setType(type)}
              placeholder="Выберете тип транзакции"
            >
              {Object.values(TransactionType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {type === TransactionType.EXPENSE ? (
            <Form.Item
              name="expenseId"
              label="Расход"
              rules={[{ required: true, message: "Выберите расход" }]}
            >
              <Select
                placeholder="Выберите расход"
                loading={expenseListLoading}
              >
                {expenseList?.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            type === TransactionType.INCOME && (
              <Form.Item
                name="incomeId"
                label="Приход"
                rules={[{ required: true, message: "Выберите приход" }]}
              >
                <Select
                  placeholder="Выберите приход"
                  loading={incomeListLoading}
                >
                  {incomeList?.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )
          )}

          <Form.Item
            name="cashboxId"
            label="Касса"
            rules={[{ required: true, message: "Выберите кассу" }]}
          >
            <Select placeholder="Выберите кассу" loading={casxhboxListLoading}>
              {cashboxList?.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name} | {item.currency}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="currency"
            label="Валюта"
            rules={[{ required: true, message: "Выберите валюту" }]}
          >
            <Select placeholder="Выберите валюту">
              {Object.values(Currency).map((currency) => (
                <Option key={currency} value={currency}>
                  {currency}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Сумма"
            rules={[{ required: true, message: "Введите сумму" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: "Введите описание." }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
