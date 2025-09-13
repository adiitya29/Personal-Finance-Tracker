import { useEffect, useState } from "react";
import API from "../../api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";

const THRESHOLD = 10000;


//below onLogout prop added
const Dashboard = ({ user,onLogout }) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header with Welcome message and Logout button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal Finance Tracker</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          
          {/* ✅ Red Logout Button on the right */}
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Warning message */}
        {warning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {warning}
          </div>
        )}

        {/* Transaction Form */}
        <div className="mb-8">
          <TransactionForm fetchTransactions={fetchTransactions} />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <Charts pieData={pieData} barData={barData} stackedData={stackedData} />
        </div>

        {/* Transaction List */}
        <TransactionList transactions={transactions} fetchTransactions={fetchTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;