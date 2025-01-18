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

