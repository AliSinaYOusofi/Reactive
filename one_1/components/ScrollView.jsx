import React from 'react';
import { Text, Button, StyleSheet, Image, View } from 'react-native';

const logo = {
    uri: 'https://img.freepik.com/free-vector/coloring-page-outline-cute-cat_1308-153756.jpg?size=626&ext=jpg',
    width: 64,
    height: 64,
};

export default function ScrollViews() {
    return (
        <View 
            style={styleSheet.container}
            contentContainerStyle={styleSheet.viewContainer}
        >
            
            <Text>Scrollable Container</Text>
            
            <View style={styleSheet.viewContainer}>
                {[...Array(15)].map((_, index) => (
                    <View 
                        key={index}
                        >
                            <Image 
                                source={logo} 
                                style={styleSheet.image} 
                            />
                            <Button title={"full screen"} onPress={() => alert('Full Screen')}>Full Screen</Button>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styleSheet = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        width: "auto",
        height: "auto"
       
    },
    contentContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    viewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        margin: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    image: {
        marginVertical: 5,
        marginHorizontal: 5,
    },
});
