import { formatDistanceToNowStrict } from 'date-fns'
import React from 'react'
import { Text, StyleSheet } from 'react-native'

export default function DateDiffDetails({date}) {

    return (
        <>
            <Text style={style.color}>
                {
                    date?.split("T")[0]
                }
            </Text>

            <Text style={style.text_margin}>
                &nbsp;({
                    formatDistanceToNowStrict(new Date(date), { addSuffix: true })
                })
            </Text>
        </>
    )
}


const style = StyleSheet.create( { 

    text: {
        color: 'black',
    },

    text_margin: {
        color: 'gray',
        padding: 5,
        fontSize: 12,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    }
} )