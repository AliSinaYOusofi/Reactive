export const amount_of_money = /^\d+(\.\d+)?$/;

export const amountOfMoneyValidator = (amount) => new RegExp(amount_of_money).test(amount)