'use client'

import React, { useState } from 'react';
import Wrapper from '../components/Wrapper';
import {useUser} from "@clerk/nextjs"
const page = () => {
   const {user}=useUser()
   const [budgetName , setBudgetName]= useState<string>("")
   const [budgetAmount , setBudgetAmount]= useState<string>("")
  return (
  <div>
  <Wrapper>
{/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
  Nouveau Budgets
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
      <label htmlFor="budgetName">Nom du budget</label>
      <input type="text" id="budgetName" value={budgetName} 
      onChange={(e)=>setBudgetName(e.target.value)} 
      className="input input-bordered mb-3"
      placeholder="Nom budget" required/>

      <label htmlFor="budgetAmount" className="mb-2">Montant du budget</label>
      <input type="number" id="budgetAmount" value={budgetAmount}
      onChange={(e)=>setBudgetAmount(e.target.value)}
      className="input input-bordered mb-3"
      placeholder="Montant budget" required/>  
      <button type="submit" className="btn btn-primary w-full">Enregistrer</button>
    </div>
  </div>
</dialog>
  </Wrapper>
  </div>
  );
}

export default page;
