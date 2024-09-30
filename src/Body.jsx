import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Body() {
  const [accountBalance, setAccountBalance] = useState(2000);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [paidBills, setPaidBills] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [billAmounts, setBillAmounts] = useState({
    electric: "",
    water: "",
    internet: "",
    rent: "",
  });
  const [transferDescription, setTransferDescription] = useState("");
  const [fromAccount, setFromAccount] = useState("checking");
  const [toAccount, setToAccount] = useState("external");
  const [transactionType, setTransactionType] = useState("deposit");

  const hasSufficientFunds = (amount) => {
    return accountBalance >= amount;
  };

  const handleBillAmountChange = (bill, value) => {
    setBillAmounts((prevAmounts) => ({
      ...prevAmounts,
      [bill]: value,
    }));
  };

  const handlePayClick = (billId) => {
    if (!paidBills[billId]) {
      const billAmount = parseFloat(billAmounts[billId]);

      if (!isNaN(billAmount) && billAmount > 0) {
        if (hasSufficientFunds(billAmount)) {
          setPaidBills((prevState) => ({
            ...prevState,
            [billId]: true,
          }));

          const formattedBillId =
            billId.charAt(0).toUpperCase() + billId.slice(1).toLowerCase();
          setTransactionHistory((prevHistory) => [
            ...prevHistory,
            `${formattedBillId} ${billAmount}`,
          ]);

          setAccountBalance((prevBalance) => prevBalance - billAmount);
        } else {
          alert("Insufficient funds to pay the bill.");
        }
      }
    }
  };

  const handleBalanceClick = (type) => {
    setTransactionType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setTransactionAmount("");
  };

  const handleTransactionAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };

  const handleDeposit = () => {
    if (
      transactionAmount &&
      !isNaN(transactionAmount) &&
      parseFloat(transactionAmount) > 0
    ) {
      const amount = parseFloat(transactionAmount);
      setAccountBalance((prevBalance) => prevBalance + amount);
      setTransactionHistory((prevHistory) => [
        ...prevHistory,
        `Deposit ${amount}`,
      ]);
      handleModalClose();
    } else {
      alert("Please enter a valid deposit amount.");
    }
  };

  const handleWithdraw = () => {
    if (transactionAmount && !isNaN(transactionAmount)) {
      const amount = parseFloat(transactionAmount);
      if (hasSufficientFunds(amount)) {
        setAccountBalance((prevBalance) => prevBalance - amount);
        setTransactionHistory((prevHistory) => [
          ...prevHistory,
          `Withdraw ${amount}`,
        ]);
        handleModalClose();
      } else {
        alert("Insufficient funds for this withdrawal.");
      }
    } else {
      alert("Please enter a valid withdrawal amount.");
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);

    if (amount > 0) {
      if (hasSufficientFunds(amount)) {
        setAccountBalance((prevBalance) => prevBalance - amount);
        setTransactionHistory((prevHistory) => [
          ...prevHistory,
          `Transfer ${amount} from ${fromAccount} to ${toAccount}: ${transferDescription}`,
        ]);
        setTransferAmount("");
        setTransferDescription("");
        setFromAccount("checking");
        setToAccount("external");
      } else {
        alert("Insufficient funds for this transfer.");
      }
    } else {
      alert("Please enter a valid transfer amount.");
    }
  };

  const handleShowMoreToggle = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const sortedTransactionHistory = transactionHistory
    .map((transaction) => {
      const [type, amountStr] = transaction.split(" ");
      const amount = parseFloat(amountStr);
      return { transaction, amount: isNaN(amount) ? 0 : amount };
    })
    .sort((a, b) => b.amount - a.amount)
    .map((item) => item.transaction);

  const totalDeposits = transactionHistory
    .filter((transaction) => transaction.startsWith("Deposit"))
    .reduce((total, transaction) => {
      const amount = parseFloat(transaction.split(" ")[1]);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);

  const totalWithdrawals = transactionHistory
    .filter((transaction) => transaction.startsWith("Withdraw"))
    .reduce((total, transaction) => {
      const amount = parseFloat(transaction.split(" ")[1]);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);

  const spendingData = [
    parseFloat(billAmounts.electric) || 0,
    parseFloat(billAmounts.water) || 0,
    parseFloat(billAmounts.internet) || 0,
    parseFloat(billAmounts.rent) || 0,
    totalDeposits,
    totalWithdrawals,
  ];

  return (
    <main className="flex-grow container mx-auto p-4">
      <section id="dashboard" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Account Balance */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 transition duration-300 hover:shadow-lg h-full">
            <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
            <p
              id="account-balance"
              className="text-3xl font-bold text-blue-600 cursor-pointer"
              onClick={() => handleBalanceClick("deposit")}
            >
              ${accountBalance.toFixed(2)}
            </p>
          </div>

          {/* Modal */}
          {modalVisible && (
            <div
              id="balance-modal"
              className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
            >
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 className="text-xl font-semibold mb-4">Manage Balance</h3>
                <div className="mb-4">
                  <label htmlFor="transaction-amount" className="block mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="transaction-amount"
                    value={transactionAmount}
                    onChange={handleTransactionAmountChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    id="deposit-btn"
                    onClick={handleDeposit}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                  >
                    Deposit
                  </button>
                  <button
                    id="withdraw-btn"
                    onClick={handleWithdraw}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  >
                    Withdraw
                  </button>
                </div>
                <button
                  id="close-modal"
                  onClick={handleModalClose}
                  className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 transition duration-300 hover:shadow-lg h-full">
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <ul id="transaction-history" className="space-y-4">
              {sortedTransactionHistory
                .slice(0, showAllTransactions ? undefined : 3)
                .map((transaction, index) => {
                  const [type, amount] = transaction.split(" ");
                  let bgColor = "";
                  let icon = "";
                  switch (type.toLowerCase()) {
                    case "deposit":
                      bgColor = "bg-green-50 border-l-4 border-green-500";
                      icon = "💵";
                      break;
                    case "withdraw":
                      bgColor = "bg-red-50 border-l-4 border-red-500";
                      icon = "💸";
                      break;
                    case "transfer":
                      bgColor = "bg-blue-50 border-l-4 border-blue-500";
                      icon = "🔄";
                      break;
                    default:
                      bgColor = "bg-blue-50 border-l-4 border-blue-500";
                      icon = "🧾";
                      break;
                  }
                  return (
                    <li key={index} className={`p-4 rounded-md ${bgColor}`}>
                      {icon} {transaction}
                    </li>
                  );
                })}
            </ul>
            {/* Render "Show More" only if there are transactions */}
            {sortedTransactionHistory.length > 3 && (
              <button
                onClick={handleShowMoreToggle}
                className="text-blue-500 mt-4 hover:underline"
              >
                {showAllTransactions ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Transfer */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 transition duration-300 hover:shadow-lg h-full">
            <h3 className="text-lg font-semibold mb-2">Transfer Funds</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label htmlFor="transfer-amount" className="block mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  id="transfer-amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label htmlFor="transfer-description" className="block mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="transfer-description"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Description"
                />
              </div>
              <div className="flex justify-between">
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full p-2 border rounded mr-2"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full p-2 border rounded ml-2"
                >
                  <option value="external">External Account</option>
                  <option value="investment">Investment Account</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 w-full"
              >
                Transfer
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bill Payments Section */}
      <div className="flex gap-4 mb-8">
        {/* Upcoming Bills Section */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Bill Payments</h2>
          <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
            <h3 className="text-lg font-semibold mb-2">Upcoming Bills</h3>
            <ul className="space-y-2">
              {["electric", "water", "internet", "rent"].map((bill) => (
                <li
                  key={bill}
                  className="flex items-center justify-between p-4 rounded-lg shadow-sm"
                >
                  <span className="flex-1 text-left">
                    {bill.charAt(0).toUpperCase() + bill.slice(1)}
                  </span>
                  <input
                    type="text"
                    value={billAmounts[bill]}
                    onChange={(e) =>
                      handleBillAmountChange(bill, e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-24"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => handlePayClick(bill)}
                    className={`ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${
                      paidBills[bill] ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={paidBills[bill]}
                  >
                    {paidBills[bill] ? "Paid" : "Pay"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Spending Chart Section */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Spending Chart</h2>
          <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
            <Bar
              data={{
                labels: [
                  "Electric",
                  "Water",
                  "Internet",
                  "Rent",
                  "Total Deposits",
                  "Total Withdrawals",
                ],
                datasets: [
                  {
                    label: "Spending",
                    data: spendingData,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              height={200}
            />
          </div>
        </div>
      </div>

      {/* Locate Section */}
      <section id="locate" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">ATM/Branch Locator</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-64 bg-gray-200 rounded overflow-hidden mb-4">
            {" "}
            {/* Added overflow-hidden */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d107162.66110378363!2d-96.700299!3d32.929006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c1f72c82bb491%3A0x6475d0317c327f37!2sBank%20of%20America%20ATM%20(Drive-thru)!5e0!3m2!1sen!2sus!4v1727730112822!5m2!1sen!2sus"
              width="600"
              height="450"
              style={{ border: "0", width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex justify-between">
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
              Find Nearest ATM
            </button>
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
              Find Nearest Branch
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Body;
