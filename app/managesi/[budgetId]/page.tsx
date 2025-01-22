"use client"
import Notification from "@/app/components/Notification"
import { getTransactionByBudgetId ,addTransaction } from '@/app/actions';
import BudgetItem from '@/app/components/BudgetItem';
import Wrapper from '@/app/components/Wrapper';
import { Budget } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = ({params}:{params:Promise<{budgetId:string}>}) => {
    const [budgetId,setBudgetId ] = useState<string>("")
    const [budget , setBudget] = useState<Budget>()  
    const [description,setDescription]= useState<string>('')
    const [amount, setAmount]=useState<string>('')
    const [notification,setNotification] = useState<string>("");
       const closeNotification = ()=>{
        setNotification("")
       }
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
  const handleAddTransaction = async ()=>{
     if(!amount || !description){
       setNotification("veillez remplire tous les champs .")
       return;
     }

     try{
      const amountNumber = parseFloat(amount);
      if(isNaN(amountNumber)|| amountNumber<=0){
        throw new Error("le montant doit etre un nombre positif")
      }
      const newTransaction = await addTransaction(budgetId,description,amountNumber)
      setNotification("Transaction ajouter avec success ")
      fetchBudgetData(budgetId)
      setAmount("")
      setDescription("")

     } catch(error){
        setNotification("vous avez depasser votre budget")  
    }
  }
  return (
    <Wrapper>
      {notification && (
      <Notification message={notification} onclose={closeNotification}></Notification>
    )}
      {
        budget && (
            <div className="flex md:flex-row flex-col">
              <div className="md:w-1/3">
              <BudgetItem budget={budget} enableHover={1}/>
                 <button className="btn mt-4">
                  Supprimer le budget
                 </button>
                 <div className="space-y-4 flex flex-col mt-4">
                  <input type="text"
                  id="description"
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className="input input-bordered"/>

                  <input type="number"
                  id="amount"
                  value={amount}
                  onChange={(e)=> setAmount(e.target.value)}
                  placeholder="montant"
                  required
                  className="input input-bordered"/>

                  <button onClick={handleAddTransaction} className="btn">Ajouter les Depense</button>
                 </div>
              </div>
            </div>
          )}
    </Wrapper>
  );

}

export default Page;
