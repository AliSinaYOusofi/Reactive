export const phone_numer_regex = /^[0-9()\s-]+$/;

export const phoneNumberValidator = (phone_number) => new RegExp(phone_numer_regex).test(phone_number)