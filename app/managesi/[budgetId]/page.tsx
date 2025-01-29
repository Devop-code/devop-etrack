"use client"
import Notification from "@/app/components/Notification"
import { getTransactionByBudgetId , deleteTransaction,addTransaction , deleteBudget} from '@/app/actions';
import BudgetItem from '@/app/components/BudgetItem';
import Wrapper from '@/app/components/Wrapper';
import { Budget } from '@/types';
import { Send ,Trash} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {redirect} from 'next/navigation'

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
  const handleDeleteBudget = async () => {
   const confirmed = window.confirm(
      "ete vous sur de vouloir supprimer ce budget et toutes ses transactions associees ?"
    )
    if(confirmed){
      try{
        await deleteBudget(budgetId)
      }catch(error){
        console.error("erreur lors de la suppression du budget",error)
      }
      redirect("/budgets")
    }
  }
  const handleDeleteTransaction = async (transactionId:string) => {
    const confirmed = window.confirm(
       "ete vous sur de vouloir supprimer cette  transaction ?"
     )
     if(confirmed){
       try{
         await deleteTransaction(transactionId)
         fetchBudgetData(budgetId)
         setNotification("depense supprimer avec success")
       }catch(error){
         console.error("erreur lors de la suppression de la transaction",error)
       }

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
                 <button className="btn mt-4"
                 onClick={handleDeleteBudget}
                 >
                  Supprimer le budget
                 </button>
                
                 <div className="space-y-4 flex flex-col mt-4">
                  <input type="text"
                  id="description"
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                  placeholder="Description transaction"
                  required
                  className="input input-bordered"/>

                  <input type="number"
                  id="amount"
                  value={amount}
                  onChange={(e)=> setAmount(e.target.value)}
                  placeholder="montant transaction"
                  required
                  className="input input-bordered"/>

                  <button onClick={handleAddTransaction} className="btn">Ajouter les Depense</button>
                 </div>
              </div>
              {budget?.transactions &&  budget.transactions.length > 0 ?(
                  <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>Montant</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budget?.transactions.map((transaction)=>
                    
                    <tr key={transaction.id}>
                      <td className="text-lg md:text-3xl">{transaction.emoji}</td>
                    
                    <td>
                      <div className="badge badge-accent badge-xs md:badge-sm">
                       - {transaction.amount}
                      </div>
                    </td>
                    <td>{transaction.description}</td>
                    <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                    <td>{transaction.createdAt.toLocaleTimeString("fr-FR",{
                      hour : "2-digit",
                      minute:"2-digit",
                      second:"2-digit"
                    })}</td>
                    <td>
                      <button className="btn btn-sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}>
                          <Trash className="w-4"/>
                      </button>
                    </td>
                  </tr>
                    
                    )}
                      {/* row 3 */}
                      
                    </tbody>
                  </table>
                </div>
              ):(
                 <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
                  <Send className="w-8 h-8 text-accent" strokeWidth={1.5}/>
                  <span className='text-gray-500 ml-2'>aucune transactions</span>
                 </div>
              )}
            </div>
          )}
    </Wrapper>
  );

}

export default Page;
