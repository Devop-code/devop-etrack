"use client"
import { getTransactionByBudgetId } from '@/app/actions';
import BudgetItem from '@/app/components/BudgetItem';
import { Budget } from '@/types';
import React, { useEffect, useState } from 'react';

const page = ({params}:{params:Promise<{budgetId:string}>}) => {
    const [budgetId,setBudgetId ] = useState<string>("")
    const [budget , setBudget] = useState<Budget>()  
  async function fetchBudgetData(budgetId:string){
      try{
        if(budgetId){
          const budgetData= await getTransactionByBudgetId(budgetId)
         setBudget(budgetData)
        }
      }
      catch(error){
        console.error("erreur lors de la recuperation du budget et des transaction",error)

      }
 }
console.log(budget)
console.log(budgetId)
  useEffect(()=>{
    const getId = async ()=>{
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId)
      fetchBudgetData(resolvedParams.budgetId)
    }
    getId()
  },[params])  
  return (
    <div>
      {
        budget && (
          <BudgetItem budget={budget} enableHover={1}/>
        )}
    </div>
  );

}

export default page;
