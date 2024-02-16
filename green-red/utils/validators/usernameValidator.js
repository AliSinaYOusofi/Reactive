export const username_regex = /^[a-zA-Z0-9\s]{2,}$/;

export const validateUsername = (username) => new RegExp(username_regex).test(username);