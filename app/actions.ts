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
      const user = await prisma.userfindUnique({
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
