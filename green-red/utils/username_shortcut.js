export const format_username = username => {
    
    if (username.includes(' ')) {
        let first_letter = username.split(' ')[0][0]
        let second_letter = username.split(' ')[1][0]
        return first_letter + second_letter
    }

    return username[0] + username[1]
}