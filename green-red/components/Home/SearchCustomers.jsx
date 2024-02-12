import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchCustomers() {
    
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    return (
        <View style={styles.container}>
            
            <View style={styles.searchContainer}>
                
                <EvilIcons name="search" size={24} color="black" style={styles.icon}/>
                
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={currentSearchTerm}
                    onChangeText={text => setCurrentSearchTerm(text)}
                />
            </View>

            <View style={styles.sort_and_pdf_container}>
                <MaterialIcons name="sort" size={24} color="black" style={styles.icon}/>
                <AntDesign name="pdffile1" size={24} color="black" style={styles.icon}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
        backgroundColor: "#f5f5f5"
    },

    icon: {
        marginRight: 10,
        color: "black"
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },

    sort_and_pdf_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 5,
    },
});
