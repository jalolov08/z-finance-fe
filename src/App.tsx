import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuthStore } from "./zustand/useAuthStore";
import { Login } from "./pages/Login/login.page";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import Home from "./pages/Home/home.page";
import { Root } from "./components/Root/root.component";
import { Users } from "./pages/Users/users.page";
import { Profile } from "./pages/Profile/profile.page";
import Cashbox from "./pages/Cashbox/cashbox.page";
import { CurrencyRates } from "./pages/CurrencyRates/currencyRates.page";
import Incomes from "./pages/Incomes/incomes.page";
import Expenses from "./pages/Expenses/expenses.page";
import Transactions from "./pages/Transactions/transactions.page";

function App() {
  const { user } = useAuthStore();

  return (
    <>
      <Routes>
        {!user.authenticated && <Route path="login" element={<Login />} />}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cashboxes" element={<Cashbox />} />
            <Route
              path="/settings/currency-rates"
              element={<CurrencyRates />}
            />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route
              path="/transactions/:cashboxId/:name"
              element={<Transactions />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
