import { useEffect, useState } from "react";
import API from "../../api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";

const THRESHOLD = 10000;


//below onLogout prop added
const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [warning, setWarning] = useState("");
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stackedData, setStackedData] = useState([]);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data);

      // ---- Threshold check for current month ----
      let currentMonthTotal = 0;
      const currentMonth = new Date().toLocaleString("default", { month: "short" });

      data.forEach((t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        if (month === currentMonth && t.type === "expense") {
          currentMonthTotal += t.amount;
        }
      });

      setWarning(
        currentMonthTotal > THRESHOLD
          ? `⚠️ Warning: Your spending this month (${currentMonthTotal}) has crossed the limit of ${THRESHOLD}.`
          : ""
      );

      // ---- Prepare Pie Data (Expenses by Category) ----
      const categoryMap = {};
      data.forEach((t) => {
        if (t.type === "expense") {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        }
      });
      setPieData(
        Object.keys(categoryMap).map((cat) => ({ name: cat, value: categoryMap[cat] }))
      );

      // ---- Prepare Bar Data (Monthly Spending) ----
      const monthMap = {};
      data.forEach((t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        monthMap[month] = (monthMap[month] || 0) + t.amount;
      });
      setBarData(
        Object.keys(monthMap).map((m) => ({ month: m, amount: monthMap[m] }))
      );

      // ---- Prepare Stacked Bar Data (Income vs Expense per Month) ----
      const monthlyIncomeExpense = {};
      data.forEach((t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        if (!monthlyIncomeExpense[month]) {
          monthlyIncomeExpense[month] = { income: 0, expense: 0 };
        }
        if (t.type === "income") monthlyIncomeExpense[month].income += t.amount;
        else if (t.type === "expense") monthlyIncomeExpense[month].expense += t.amount;
      });
      setStackedData(
        Object.keys(monthlyIncomeExpense).map((m) => ({
          month: m,
          income: monthlyIncomeExpense[m].income,
          expense: monthlyIncomeExpense[m].expense,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl">Welcome, {user.name}</h2>

      {warning && <p className="mt-2 text-red-600">{warning}</p>}

      <TransactionForm fetchTransactions={fetchTransactions} />
      <TransactionList transactions={transactions} fetchTransactions={fetchTransactions}/>
      <Charts pieData={pieData} barData={barData} stackedData={stackedData} />
    </div>
  );
};

export default Dashboard;