import API from "../../api";

const TransactionList = ({ transactions, fetchTransactions }) => {

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await API.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
        alert("Failed to delete transaction.");
      }
    }
  };
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Transactions</h3>
      <ul className="space-y-3">
        {transactions.map((t) => (
          <li key={t._id} className="p-3 border rounded-lg flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold capitalize">{t.description}</p>
              <p className="text-sm text-gray-600">{t.category}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                ₹{t.amount.toLocaleString()}
              </span>
              <button 
                onClick={() => handleDelete(t._id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;