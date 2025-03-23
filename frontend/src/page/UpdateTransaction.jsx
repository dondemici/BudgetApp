import { useState } from "react";
import axios from "axios";

function UpdateTransaction({ transaction, setTransactions, setEditingTransaction }) {
    const [category, setCategory] = useState(transaction.category);
    const [amount, setAmount] = useState(transaction.amount);
    const formattedDate = transaction.date instanceof Date
    ? transaction.date.toISOString().split("T")[0]
    : new Date(transaction.date).toISOString().split("T")[0];
    const [date, setDate] = useState(formattedDate);



    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/transactions/${transaction.id}`, {
                category,
                amount: parseFloat(amount),
                date,
            });

            // Update transaction list dynamically
            setTransactions((prevTransactions) =>
                prevTransactions.map((t) => (t.id === transaction.id ? response.data : t))
            );

            setEditingTransaction(null); // Close the modal after submission
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    return (
        <div>
            <h2>Update Transaction</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingTransaction(null)}>Cancel</button>
            </form>
        </div>
    );
}

export default UpdateTransaction;
