import React, { useState, useEffect } from 'react';
import { Text, Button, StyleSheet, Image, View, Modal } from 'react-native';

import CustomButton from './CustomButton';

const logo = {
    uri: 'https://img.freepik.com/free-vector/coloring-page-outline-cute-cat_1308-153756.jpg?size=626&ext=jpg',
    width: 64,
    height: 64,
};



export default function ScrollViews() {

    const [modal, setModal] = useState(false)

    const handleFullScreen = () => {
        
        // meo.play()
        setModal(true);
    };

    const closeModal = () => {
        // meo.pause()
        setModal(false);
    };
    
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
                            <CustomButton 
                                title={''}
                                onPress={handleFullScreen}
                            />
                    </View>
                ))}
            </View>
            
            <View style={styleSheet.container}>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modal}
                    onRequestClose={closeModal}
                >
                    <View style={styleSheet.modal}>

                        <Image 
                            source={logo} 
                            style={styleSheet.image} 
                        />
                    </View>

                </Modal>
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

    full_screen_button:  {
        borderRadius: 10,
        backgroundColor: "gray"
    },
    svg: {
        width: 20,
        height: 20,
        color: "white",
        marginVertical: 5,
        marginHorizontal: 5,
    },

    modal: {
        
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        width: "90%",
        height: "100%"
    }
});
