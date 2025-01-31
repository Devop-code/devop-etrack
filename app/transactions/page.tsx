"use client";
import { useUser } from "@clerk/nextjs";
import { Transaction } from "@prisma/client";

import React, { useEffect, useState } from "react";
import { getTransactionByEmailAndPeriod } from "../actions";
import Wrapper from "../components/Wrapper";
import { TransactionItem } from "../components/TransactionItem";

const Page = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async (period: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      try {
        const transactionData = await getTransactionByEmailAndPeriod(
          user.primaryEmailAddress.emailAddress,
          period
        );
        setTransactions(transactionData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching transactions");
      }
    }
  };
  useEffect(() => {
    fetchTransactions("last30");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.primaryEmailAddress?.emailAddress]);
  return (
    <Wrapper>
        <div className="flex justify-end mb-5">
            <select className="input input-bordered input-md"
            defaultValue="last30"
            onChange={(e) => fetchTransactions(e.target.value)}>
                <option value="last30">Les 30 derniers jours</option>
                <option value="last90">Les 90 derniers jours</option>
                <option value="last7">Les 7 derniers jours</option>
                <option value="last365">Les 365 derniers jours</option>
            </select>
        </div>
      <div className="overflow-x-auto w-full bg-base-200/35 p-5 rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center ">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center  h-full ">
            <span className="text-gray-500 text-sm ">
              Aucunne transaction ajouter
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-base-300">
            {transactions.map((transaction) => (
              <TransactionItem 
              transaction={transaction} 
              key={transaction.id} />
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
