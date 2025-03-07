export const format_currency = currency => {
    
    if (currency.includes(' ')) {
        let first_letter = currency.split(' ')[0][0]
        let second_letter = currency.split(' ')[1][0]
        return first_letter + second_letter
    }

    return currency[0].toUpperCase + currency[1].toUpperCase()
}