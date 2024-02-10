import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TotalExpenses() {

    return (
        <View style={styles.container}>
            
            <View style={[styles.take_give_views, styles.give]}>
               
                <View  style={styles.carets}>
                    
                    <FontAwesome 
                        name="chevron-up" 
                        size={28} 
                        color="white" 
                    />
                </View>

                <View>
                    <Text style={styles.text}>To give</Text>
                    <Text style={styles.text}>10000</Text>
                </View>
            </View>
            
            <View style={[styles.take_give_views, styles.take]}>
                
                <View style={styles.carets}>
                    <FontAwesome 
                        name="chevron-down" 
                        size={28} 
                        color="white" 
                    />
                </View>
                <View>
                    <Text style={styles.text}>To take</Text>
                    <Text style={styles.text}>200000</Text>
                </View>
            </View>
        </View>
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
        backgroundColor: "#FF0038",
        flex: 1
    },
    
    take: {
        backgroundColor: "#36B35F",
        flex: 1
    },

    text: {
        color: "white",
        fontSize: 15
    },

    carets: {
        borderColor: "white",
        borderRadius: 50,
        borderWidth: 1,
        padding: 2
    }
})