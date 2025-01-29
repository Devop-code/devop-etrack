import { Transaction } from '@/types'
import Link from 'next/link'
import React from 'react'
interface TransactionItemProps {
    transaction: Transaction
}
export const TransactionItem: React.FC<TransactionItemProps> = ({transaction}) => {
  return (
    <li key={transaction.id} className="flex justify-between items-center p-2">
       <div className='my-4'>
          <button className='btn'>
            <div className='badge badge-accent'>
             -   {transaction.amount} €
            </div>
            {transaction.budgetName}
          </button>
       </div>
       <div className='md:hidden flex flex-col items-end'>
        <span className='font-bold text-sm mr-3'>
            {transaction.description} 
        </span>
        <span className='text-sm '>
            {transaction.createdAt.toLocaleDateString("fr-FR")} a {""}
            {transaction.createdAt.toLocaleTimeString("fr-FR",{
                hour: '2-digit',
                minute: '2-digit'
            })}
        </span>
       </div>
       <div className='hidden md:flex'>
          <span className='font-bold text-sm mr-3'>
            {transaction.description}
          </span>
          <div className='hidden md:flex'>
            <span className='text-sm'>
                {transaction.createdAt.toLocaleDateString("fr-FR")} a {""}
                {transaction.createdAt.toLocaleTimeString("fr-FR",{
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
          </div>
       </div>
       <div className='hidden md:flex'>
        <Link href={`/managesi/${transaction.budgetId}`} className='btn '>Voir plus</Link>
       </div>
    </li>
  )
}
