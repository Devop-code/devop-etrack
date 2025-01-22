'use server'

import prisma from "@/lib/prisma"

export async function  checkAndAddUser(email: string | undefined) {
   if(!email) {
          return
       }
       try{
            const existingUser= await prisma.user.findUnique({
                where:{
                    email
                }
            })
          if(!existingUser) {
             await prisma.user.create({
                    data:{ email: email as string }
                })
               console.log("nouvel  utilisateur ajouté dans la BD")
           }else{
          console.log("l'utilisateur existe déjà dans la BD")
      }
     } catch(error) {
         console.log("erreur lors de la verification de l'utilisateur",error)
      }
     }

export async function addBuget(email: string,name:string,amount: number,selectedEmoji:string){
   try{
      const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
        if(!user){
            throw new Error("Utilisateur non trouver")
        }
        await prisma.budget.create({
            data:{
                name,
                amount,
                emoji: selectedEmoji,
                userId: user.id
            }
        })
      
   }catch(error){
    console.log("erreur lors de l ajout du budget: ",error)
    throw error
   }
}
export async function getBudgets(email:string){
    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            },
            include:{
                budgets:{
                    include:{
                        transactions:true
                    }
                }
            }
        })
        if(!user){
            throw new Error("Utilisateur non trouver")
        }
        return user.budgets
    }catch(error){
        console.log("erreur lors de la récupération des budgets: ",error)
        throw error
    }
}
export async function getTransactionByBudgetId(budgetId:string){
    try{
        const budget = await prisma.budget.findUnique({
            where:{
                id:budgetId
            },
            include: {
                transactions:true
            }
        })
        if(!budget){
            throw new Error('Budget non trouver');
        }
        return budget;
    }catch(error){
        console.error("erreur lors de la récupération des transactions: ",error)
        throw error;
    }
}

export async function addTransaction(budgetId: string, description: string, amount: number){
    try{
        const budget = await prisma.budget.findUnique({
            where:{
                id:budgetId
            },
            include:{
                transactions:true
            }
        })
        if(!budget){
            throw new Error('Budget non trouver');
        }
        const totalTransactions = budget.transactions.reduce((sum,transaction)=>{
            return sum + transaction.amount
        },0)
        const totalWithTransaction = totalTransactions + amount
        if(totalWithTransaction > budget.amount){
           throw new Error('le montant total des transactions depasse le montant du budget.');
        }
        
     const newTransaction =   await prisma.transaction.create({
            data:{
                description,
                amount,
                emoji:budget.emoji,
                budget: {
                    connect:{
                        id: budget.id
                    }
                }
            }
        })
        return budget;
    }catch(error){
        console.error("erreur lors de l'ajout de transaction: ",error)
        throw error;
    }
}
