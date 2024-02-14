export const email_regx = '^[\\w\\.-]+@([\\w-]+\\.)+[\\w-]{2,4}$';

export const isEmailValid = (email) => new RegExp(email_regx).test(email);