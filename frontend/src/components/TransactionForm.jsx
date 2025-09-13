import { useState } from "react";
import API from "../../api";

const TransactionForm = ({ fetchTransactions }) => {
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", category: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/transactions", form);
    setForm({ description: "", amount: "", type: "expense", category: "" });
    fetchTransactions();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mt-4 p-4 border rounded shadow-sm">
      <input 
        type="text" 
        name="description" 
        value={form.description} 
        placeholder="Description" 
        onChange={handleChange} 
        className="p-2 border rounded flex-grow" 
        required 
      />
      <input type="number" name="amount" value={form.amount} placeholder="Amount" onChange={handleChange} className="p-2 border rounded" required />
      <select name="type" value={form.type} onChange={handleChange} className="p-2 border rounded">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="text" name="category" value={form.category} placeholder="Category" onChange={handleChange} className="p-2 border rounded" required />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Add</button>
    </form>
  );
};


export default TransactionForm;