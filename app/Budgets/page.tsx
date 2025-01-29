'use client'

import React, { useState,useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import {useUser} from "@clerk/nextjs"
import EmojiPicker from 'emoji-picker-react';
import {addBuget,getBudgets} from '../actions'
import Notification from "../components/Notification"
import BudgetItem from "../components/BudgetItem"
import {Budget} from "@/types"
import Link from "next/link"
import { Landmark } from 'lucide-react';
const Page = () => {
   const {user}=useUser()
   const [budgetName , setBudgetName]= useState<string>("")
   const [budgetAmount , setBudgetAmount]= useState<string>("")
   const [showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);
   const [selectedEmoji,setSelectedEmoji] = useState<string>("")
   const handleEmojiSelect=(emojiObject : {emoji : string})=>{
     setSelectedEmoji(emojiObject.emoji)
     setShowEmojiPicker(false)
   } 
   const [budgets,setBudgets] = useState<Budget[]>([])
   const [notification,setNotification] = useState<string>("");
   const closeNotification = ()=>{
    setNotification("")
   }
   const handleAddbudget= async ()=>{
    try{
      const amount = parseFloat(budgetAmount)
      if(isNaN(amount) ||  amount <= 0){
        throw new Error("le montant doit etre un nombre positif");
      }
      await addBuget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectedEmoji
      )
      fetchBudgets()
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement
      if(modal){
        modal.close()
      }
     setNotification("Nouveau Budget cree avec success par Leassi Devop 😎")
     setBudgetAmount("")
     setBudgetName("")
     setSelectedEmoji("")
     setShowEmojiPicker(false)
    }catch(error){
      setNotification(`Erreur lors de la creation de budget: ${error}`)
    }
   }
  
   const fetchBudgets =  async ()=>{
    if(user?.primaryEmailAddress?.emailAddress){
      try{
        const usesBudgets = await getBudgets(user?.primaryEmailAddress?.emailAddress)
        setBudgets(usesBudgets)
      }catch(error){
        setNotification(`Erreur lors de l recuperation des budgets: ${error}`)
      }
    }
   }
   useEffect(()=>{
    fetchBudgets()
  },[user?.primaryEmailAddress?.emailAddress])
  return (
  <Wrapper>
    {notification && (
      <Notification message={notification} onclose={closeNotification}></Notification>
    )}
{/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
  Nouveau Budgets
  <Landmark className='w-4'/>
  </button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Creation d'un budgets</h3>
    <p className="py-4">Permet de controler ces depenses facilement</p>
    <div className="w-full flex flex-col">
      <label htmlFor="budgetName" className="text-slate-700 mb-2">Nom du budget</label>
      <input type="text" id="budgetName" value={budgetName} 
      onChange={(e)=>setBudgetName(e.target.value)} 
      className="input input-bordered mb-3 text-pink-600"
      placeholder="Nom budget" required/>

      <label htmlFor="budgetAmount" className="text-slate-700 mb-2">Montant du budget</label>
      <input type="number" id="budgetAmount" value={budgetAmount}
      onChange={(e)=>setBudgetAmount(e.target.value)}
      className="input input-bordered mb-3 text-pink-600"
      placeholder="Montant budget" required/>
      <button className="btn mb-3"
      onClick={()=>setShowEmojiPicker(!showEmojiPicker)}>
       {
        selectedEmoji || "selectionnez un emoji 👍😎"
       }
      </button>
        {
          showEmojiPicker && (
            <div className="flex justify-center items-center my-4">
              <EmojiPicker onEmojiClick={handleEmojiSelect}/>
            </div> 
          )
        }
      
      <button
       onClick={handleAddbudget}
      type="submit"
       className="btn btn-primary w-full"
       >Enregistrer</button>
    </div>
  </div>
</dialog>

  <ul className="grid md:grid-cols-3 gap-6 mt-4">
   {
    budgets.map((budget)=>(
      <Link href={`/managesi/${budget.id}`} key={budget.id}>
        <BudgetItem budget={budget} enableHover={1}/>
      </Link>
    ))
   }
  </ul>
  </Wrapper>

  );
}

export default Page;
