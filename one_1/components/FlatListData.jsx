import React from 'react'
import { Text, StyleSheet, FlatList, View } from 'react-native'


// FLast list displays a list of structured data, which are
// have the same properties, but the FlatList only renders the data
// that is showing on the screen
export default function FlatListData() {

    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    {
                        name: "one",
                        index: "0"
                    },
                    {
                        name: "one",
                        index: "0"
                    },
                    {
                        name: "one",
                        index: "0"
                    },
                    {
                        name: "one",
                        index: "0"
                    },
                ]}

                renderItem={
                    (item) => 
                    <View style={styles.item}> 
                        <Text> {item.name} </Text>
                        <Text> {item.index} </Text>
                    </View>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        paddingTop: 22,
    },

    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})