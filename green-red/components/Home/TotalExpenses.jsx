import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TotalExpenses({totalAmountToGive, totalAmountToTake, currency}) {

    return (
        <>
            <View style={styles.container}>
                
                <View style={styles.take_give_container}>

                    <View style={[styles.take_give_views, styles.give]}>
                    
                        <View  style={styles.carets}>
                            
                            <FontAwesome 
                                name="arrow-circle-up" 
                                size={28} 
                                color="red" 
                            />
                        </View>

                        <View>
                            <Text style={styles.to_give_text}>In total I paid</Text>
                            <Text style={[styles.to_give_text, styles.money]}>{totalAmountToTake} <Text style={styles.currency}>{currency}</Text></Text>
                        </View>
                    </View>
                    
                    <View style={[styles.take_give_views, styles.take]}>
                        
                        <View style={styles.carets}>
                            <FontAwesome 
                                name="arrow-circle-down" 
                                size={28} 
                                color="green" 
                            />
                        </View>
                        <View>
                            <Text style={styles.to_take_text}>In total I received</Text>
                            <Text style={[styles.to_take_text, styles.money]}>{totalAmountToGive} <Text style={styles.currency}> {currency}</Text></Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.total_container]}>
                    {
                        parseFloat(totalAmountToGive) > parseFloat(totalAmountToTake) 
                        ?
                        <Text style={styles.info_text}> In total I must give <Text style={styles.total_amount_text}> {(totalAmountToGive - totalAmountToTake)} </Text> <Text style={styles.currency}> {currency} </Text> </Text>
                        :
                        <Text style={styles.info_text}> In total I must get <Text style={styles.total_amount_text}> {(totalAmountToGive - totalAmountToTake) * -1} </Text> <Text style={styles.currency}> {currency} </Text> </Text>
                    }
                </View>
            </View>
            

        </>
    )
}

const styles = StyleSheet.create({
    
    container: {
        display: "flex",
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: "start",
        justifyContent: "start",
        height: "auto",
        alignItems: 'start',
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5
    },

    take_give_views: {
        borderRadius: 8,
        height: "auto",
        color: "white",
        display: "flex",
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        gap: 10,
        margin: 2,
        paddingHorizontal: 10,
        paddingVertical: 25,
        flex: 1
    },

    give: {
        borderColor: "#8b0000",
        flex: 1,
        width: '50%',
        borderWidth: 1.5
    },
    
    take: {
        borderColor: "#0E593C",
        flex: 1,
        width: '50%',
        borderWidth: 1.5
    },

    to_give_text: {
        color: "black",
        fontSize: 15,
        fontWeight: "600"
    },

    to_take_text: {
        color: "black",
        fontSize: 15,
        fontWeight: "600"
    },

    carets: {
        color: 'white'
    },

    money: {
        fontSize: 20,
        fontWeight: "bold",
    },

    currency: {
        fontSize: 15,
        fontWeight: "normal",
        textDecorationLine: "underline"
    },

    in_total_text: {
        color: "white",
        fontSize: 17,
    },

    total_amount_text: {
        fontWeight: 'bold',
        fontSize: 20
    },

    info_text: {
        color: 'black'
    },

    total_container: {
        borderRadius: 8,
        height: "auto",
        color: "black",
        display: "flex",
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        gap: 10,
        margin: 2,
        borderColor: "#1D224E", 
        width: '100%',
        borderWidth: 1,
        padding: 3,
        justifyContent: 'start'
    },

    take_give_container: {
        display: "flex",
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: "center",
        height: "auto",
        alignItems: 'stretch'
    }
})