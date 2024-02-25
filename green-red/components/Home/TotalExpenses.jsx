import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesome6 } from '@expo/vector-icons';

export default function TotalExpenses({totalAmountToGive, totalAmountToTake, currency}) {

    return (
        <>
        <View style={styles.container}>
            
            <View style={[styles.take_give_views, styles.give]}>
               
                <View  style={styles.carets}>
                    
                    <FontAwesome 
                        name="arrow-circle-up" 
                        size={28} 
                        color="red" 
                    />
                </View>

                <View>
                    <Text style={[styles.to_give_text, styles.money]}>10000 <Text style={styles.currency}>AFG</Text></Text>
                    <Text style={styles.to_give_text}>I have to give</Text>
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
                    <Text style={[styles.to_take_text, styles.money]}>200000 <Text style={styles.currency}> AFG</Text></Text>
                    <Text style={styles.to_take_text}>I have to take</Text>
                </View>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    
    container: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: "center",
        justifyContent: "space-around",

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
        
    },

    give: {
        backgroundColor: "#8b0000",
        flex: 1,
    },
    
    take: {
        backgroundColor: "#0E593C",
        flex: 1,
    },

    to_give_text: {
        color: "white",
        fontSize: 15,
        fontWeight: "600"
    },

    to_take_text: {
        color: "white",
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
    }
})