import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TotalExpenses() {

    return (
        <>
        <View style={styles.container}>
            
            <View style={[styles.take_give_views, styles.give]}>
               
                <View  style={styles.carets}>
                    
                    <FontAwesome 
                        name="chevron-circle-up" 
                        size={28} 
                        color="red" 
                    />
                </View>

                <View>
                    <Text style={styles.to_give_text}>10000 AFG</Text>
                    <Text style={styles.to_give_text}>I have to give</Text>
                </View>
            </View>
            
            <View style={[styles.take_give_views, styles.take]}>
                
                <View style={styles.carets}>
                    <FontAwesome 
                        name="chevron-circle-down" 
                        size={28} 
                        color="green" 
                    />
                </View>
                <View>
                    <Text style={styles.to_take_text}>200000 AFG</Text>
                    <Text style={styles.to_take_text}>I have to take</Text>
                </View>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: "center",
        justifyContent: "space-around",

    },

    take_give_views: {
        borderRadius: 15,
        padding: 10,
        width: 100,
        height: 100,
        color: "white",
        display: "flex",
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        gap: 10,
        margin: 2
    },

    give: {
        backgroundColor: "#FFC8CD",
        flex: 1
    },
    
    take: {
        backgroundColor: "#93e9be",
        flex: 1
    },

    to_give_text: {
        color: "red",
        fontSize: 15,
        fontWeight: "600"
    },

    to_take_text: {
        color: "green",
        fontSize: 15,
        fontWeight: "600"
    },

    carets: {
        
    }
})