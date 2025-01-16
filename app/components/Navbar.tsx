'use client'
import { useUser,UserButton } from '@clerk/nextjs';
import React from 'react';
import Link from "next/link"

const Navbar = () => {
    const {isLoaded , isSignedIn , user} = useUser()
  return (
    <div className="bg-base-200/30 px-5 md:-px-[10%] py-4">
      {isLoaded && (
        (isSignedIn ? (
           <div className="flex justify-between items-center">
              <div className="flex text-2xl items-center font-bold">
                Devop's<span className="text-accent">Etrack</span>
              </div>
              <div className="flex">
                <Link href={""} className="btn">Mes Budgets</Link>
                <Link href={""} className="btn">Tableau de Bord</Link>  
                <Link href={""} className="btn">Mes Transactions</Link>
                <UserButton/>
               </div>
           </div> 
        ):(
            <div>
                je suis deconnecter
            </div>
        ))
      )}
    </div>
  );
}

export default Navbar;
