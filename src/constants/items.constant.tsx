import { BsCash, BsCurrencyExchange } from "react-icons/bs";
import { FiHome } from "react-icons/fi";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { HiUser, HiUsers } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";

export const items = [
  {
    key: "/",
    icon: <FiHome />,
    label: "Главная",
  },
  {
    key: "/cashboxes",
    icon: <BsCash />,
    label: "Кассы",
  },
  {
    key: "/transactions",
    icon: <GrTransaction />,
    label: "Транзакции",
  },
  {
    key: "/incomes",
    icon: <GiReceiveMoney />,
    label: "Приходы",
  },
  {
    key: "/expenses",
    icon: <GiPayMoney />,
    label: "Расходы",
  },
  {
    key: "/users",
    icon: <HiUsers />,
    label: "Пользователи",
  },
  {
    key: "/profile",
    icon: <HiUser />,
    label: "Профиль",
  },
  {
    key: "/settings",
    icon: <IoSettings />,
    label: "Настройки",
    children: [
      {
        key: "/settings/currency-rates",
        label: "Курсы валют",
        icon: <BsCurrencyExchange />,
      },
    ],
  },
];
