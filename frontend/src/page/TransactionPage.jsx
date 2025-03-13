import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the XLSX library
import CreateTransaction from "./CreateTransaction";
import UpdateTransaction from "./UpdateTransaction";

function TransactionPage() {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Fetch transactions from the backend
    const getTransactions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/transactions");
            setTransactions(response.data);
        } catch (error) {
            if (error.response) {
                // The request was made, but the server responded with an error
                console.error("Error fetching transactions:", error.response.data);
                console.error("Status code:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request
                console.error("Error in setting up the request:", error.message);
            }
        }
    };
    

    useEffect(() => {
        getTransactions();
    }, []);

    // Handle transaction deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/transactions/${id}`);
            setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    // Handle transaction editing (open modal)
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };

    // Export table data to Excel
    const handleExport = () => {
        // Format the date to MM/DD/YYYY
        const formattedTransactions = transactions.map((transaction) => {
            const formattedDate = new Date(transaction.date);
            const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // MM
            const day = formattedDate.getDate().toString().padStart(2, '0'); // DD
            const year = formattedDate.getFullYear(); // YYYY
    
            // Format the date as MM/DD/YYYY
            const formattedDateString = `${month}/${day}/${year}`;
    
            return { 
                ...transaction, // Keep other fields the same
                date: formattedDateString, // Update the date format
            };
        });
    
        // Create the Excel worksheet
        const ws = XLSX.utils.json_to_sheet(formattedTransactions);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, "transactions.xlsx");
    };
    
    return (
        <div>
            <h1>Transaction Page</h1>

            {/* Create Transaction Component */}
            <CreateTransaction setTransactions={setTransactions} />

            {/* Show UpdateTransaction Modal when editingTransaction is set */}
            {editingTransaction && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <UpdateTransaction
                            transaction={editingTransaction}
                            setTransactions={setTransactions}
                            setEditingTransaction={setEditingTransaction}
                        />
                    </div>
                </div>
            )}

            {/* Transaction Table */}
            {transactions.length > 0 ? (
                <>
                    <button onClick={handleExport}>Export to Excel</button> {/* Export Button */}

                    <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category</th>
                                <th>Amount ($)</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.amount.toFixed(2)}</td>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(transaction)}>Edit</button>
                                        <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No transactions found.</p>
            )}

            {/* CSS for Modal Styling */}
            <style>
                {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .modal-content {
                        background: black;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
                        min-width: 300px;
                    }
                `}
            </style>
        </div>
    );
}

export default TransactionPage;
