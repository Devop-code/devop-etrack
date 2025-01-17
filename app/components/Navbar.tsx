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
           <>
           <div className="flex justify-between items-center">
              <div className="flex text-2xl items-center font-bold">
                Devop's<span className="text-accent">Etrack</span>
              </div>

              <div className="md:flex hidden">
                <Link href={""} className="btn">Mes Budgets</Link>
                <Link href={""} className="btn">Tableau de Bord</Link>  
                <Link href={""} className="btn">Mes Transactions</Link>
                <UserButton/>
               </div>
           </div>
           <div className="md:hidden flex mt-2 justify-center">
                <Link href={""} className="btn btn-sm">Mes Budgets</Link>
                <Link href={""} className="btn mx-4 btn-sm">Tableau de Bord</Link>  
                <Link href={""} className="btn btn-sm">Mes Transactions</Link>
               </div>
           </> 
        ):(
          
            <div className="flex justify-between items-center">
              <div className="flex text-2xl items-center font-bold">
                Devop's<span className="text-accent">Etrack</span>
              </div>
               <div className=" flex mt-2 justify-center">
                <Link href={"/sign-in"} className="btn btn-sm">Se Connecter</Link>
                <Link href={"/sign-up"} className="btn mx-4 btn-sm btn-accent">S'inscrire</Link>
                  
                </div>
            </div>
        ))
      )}
    </div>
  );
}

export default Navbar;
