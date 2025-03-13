import axios from "axios";

function DeleteTransaction({ transactionId, setTransactions }) {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/transactions/${transactionId}`);
            setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    return <button onClick={handleDelete}>Delete</button>;
}

export default DeleteTransaction;
