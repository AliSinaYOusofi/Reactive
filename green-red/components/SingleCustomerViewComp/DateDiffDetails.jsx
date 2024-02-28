import { formatDistanceToNowStrict } from 'date-fns'
import React from 'react'
import { Text, StyleSheet } from 'react-native'

export default function DateDiffDetails({date}) {

    return (
        <>
            <Text style={style.color}>
                {
                    date?.split(" ")[0]
                }
            </Text>

            <Text style={style.text_margin}>
                ({
                    formatDistanceToNowStrict(new Date(date), { addSuffix: true })
                })
            </Text>
        </>
    )
}


const style = StyleSheet.create( { 

    text: {
        color: 'white',
    },

    text_margin: {
        color: 'white',
        padding: 5
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    }
} )