"use server";

import prisma from "@/lib/prisma";

export async function checkAndAddUser(email: string | undefined) {
  if (!email) {
    return;
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: { email: email as string },
      });
      console.log("nouvel  utilisateur ajouté dans la BD");
    } else {
      console.log("l'utilisateur existe déjà dans la BD");
    }
  } catch (error) {
    console.log("erreur lors de la verification de l'utilisateur", error);
  }
}

export async function addBuget(
  email: string,
  name: string,
  amount: number,
  selectedEmoji: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("Utilisateur non trouver");
    }
    await prisma.budget.create({
      data: {
        name,
        amount,
        emoji: selectedEmoji,
        userId: user.id,
      },
    });
  } catch (error) {
    console.log("erreur lors de l ajout du budget: ", error);
    throw error;
  }
}
export async function getBudgets(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("Utilisateur non trouver");
    }
    return user.budgets;
  } catch (error) {
    console.log("erreur lors de la récupération des budgets: ", error);
    throw error;
  }
}
export async function getTransactionByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });
    if (!budget) {
      throw new Error("Budget non trouver");
    }
    return budget;
  } catch (error) {
    console.error("erreur lors de la récupération des transactions: ", error);
    throw error;
  }
}

export async function addTransaction(
  budgetId: string,
  description: string,
  amount: number
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });
    if (!budget) {
      throw new Error("Budget non trouver");
    }
    const totalTransactions = budget.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
    const totalWithTransaction = totalTransactions + amount;
    if (totalWithTransaction > budget.amount) {
      throw new Error(
        "le montant total des transactions depasse le montant du budget."
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        emoji: budget.emoji,
        budget: {
          connect: {
            id: budget.id,
          },
        },
      },
    });
    return budget;
  } catch (error) {
    console.error("erreur lors de l'ajout de transaction: ", error);
    throw error;
  }
}

export const deleteBudget = async (budgetId: string) => {
  try {
    await prisma.transaction.deleteMany({
      where: { budgetId },
    });
    await prisma.budget.delete({
      where: { id: budgetId },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du budget et de ses transaction",
      error
    );
    throw error;
  }
};

export async function deleteTransaction(transactionId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    if (!transaction) {
      throw new Error("Transaction non trouver");
    }
    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression  des transaction", error);
    throw error;
  }
}
export async function getTransactionByEmailAndPeriod(
  email: string,
  petriod: string
) {
  try {
    const now = new Date();
    let dateLimit;
    switch (petriod) {
      case "last30":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 30);
        break;
      case "last90":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 90);
        break;
      case "last7":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 7);
        break;
      case "last365":
        dateLimit = new Date(now);
        dateLimit.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Periode non valide");
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budgets: {
          include: {
            transactions: {
              where: {
                createdAt: {
                  gte: dateLimit,
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new Error("Utilisateur non trouver");
    }
    const transactions = user.budgets.flatMap((budget) =>
      budget.transactions.map((transaction) => ({
        ...transaction,
        budgetName: budget.name,
        budgetId: budget.id,
      }))
    );
    return transactions;
  } catch (error) {
    console.log("erreur lors de la récupération des transactions: ", error);
    throw error;
  }
}
