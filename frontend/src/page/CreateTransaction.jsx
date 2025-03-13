import { useState } from "react";
import axios from "axios";

function CreateTransaction({ setTransactions }) {
    const [category, setCategory] = useState(null);
    const [amount, setAmount] = useState(null); // Initialize as empty string
    const [date, setDate] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            alert("Please enter a valid number for the amount.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/transactions", {
                category,
                amount: parsedAmount, // Use the parsed amount
                date,
            });
            
            setTransactions((prevTransactions) => [...prevTransactions, response.data]);
            setCategory("");
            setAmount(""); // Reset to empty string
            setDate("");
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    return (
        <div>
            <h2>Create Transaction</h2>
            <form onSubmit={handleSubmit}>
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
                        onChange={(e) => setAmount(e.target.value)} // Store as string
                        step="0.01" // Allow decimal values
                        min="0" // Prevent negative numbers
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
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateTransaction;