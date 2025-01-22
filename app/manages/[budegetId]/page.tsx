"use client"
import { getTransactionByBudgetId } from '@/app/actions';
import BudgetItem from '@/app/components/BudgetItem';
import { Budget } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: { budgetId: string } }) => {
    const [budgetId, setBudgetId] = useState<string>('');
    const [budget, setBudget] = useState<Budget>();

    async function fetchBudgetData(budgetId: string) {
        try {
            if (budgetId) {
                const budgetData = await getTransactionByBudgetId(budgetId);
                setBudget(budgetData);
            }
        } catch (error) {
            console.error("erreur lors de la recuperation du budget et des transactions", error);
        }
    }

    useEffect(() => {
        if (params.budgetId) {
            setBudgetId(params.budgetId);
            fetchBudgetData(params.budgetId);
        }
    }, [params]);

    console.log(budget);
    console.log(budgetId);

    return (
        <div>
            {/* Render your budget data here */}
            {budget && <BudgetItem budget={budget} />}
        </div>
    );
};

export default Page;