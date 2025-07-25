import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import DeleteRecordModal from '../global/DeleteRecordModal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useListAnimation from '../animations/useListAnimation';
import useDeleteAnimation from '../animations/useDeleteAnimation';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window')

export default function CustomerListTemplate({onDelete, index=1, username='', customer_id=0 }) {
    const navigator = useNavigation();
    const [deleteModal, setDeleteModal] = useState(false);
    const { opacity: listOpacity, translateY } = useListAnimation(index);
    const { opacity: deleteOpacity, translateX, height, animateDelete } = useDeleteAnimation();
    
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: deleteOpacity.value * listOpacity.value,
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value }
        ],
        height: height.value,
    }));

    const handleCustomerViewClick = () => {
        navigator.navigate("CustomerData", {username, customer_id})    
    }

    const handleDelete = async () => {
        animateDelete();
        setTimeout(() => {
            setDeleteModal(false);
            if (onDelete) onDelete(username);
        }, 300);
    }

    return (
        <>
            <Animated.View style={[styles.container]}>
                <TouchableOpacity 
                    onPress={handleCustomerViewClick} 
                    style={styles.pressableContainer}
                >
                    <View style={styles.mainContent}>
                        {/* Clean Black & White Avatar */}
                        <View style={[styles.avatarContainer, { backgroundColor: "gray", borderRadius: 999 }]}>
                            <Text style={styles.avatarText}>
                                {getUserInitials(username)}
                        <View style={styles.usernameShortCutStyle}>
                            <Text style={styles.shortcutText}>
                                {(index)}
                            </Text>
                        </View>
                        
                        <View style={styles.textContainer}>
                            <Text 
                                numberOfLines={1} 
                                ellipsizeMode="tail" 
                                style={styles.usernameText}
                            >
                                {username.toUpperCase()}
                            </Text>
                            
                        </View>


                        {/* Subtle Chevron */}
                        <MaterialIcons name="chevron-right" size={18} color="#666666" />
                    </View>
                </TouchableOpacity>
                
                <View style={styles.iconsContainer}>
                    <TouchableOpacity 
                        onPress={() => setDeleteModal(true)} 
                        style={styles.iconButton}
                    >
                        <MaterialIcons name="edit" size={18} color="#333333" />
                        <Trash2 
                            name="delete-alert-outline" 
                            size={24} 
                            color="black" 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigator.navigate("EditCustomer", {username})}
                        style={[styles.iconButton, styles.edit_icon]}
                    >
                        <MaterialIcons name="delete" size={18} color="#333333" />
                        <MaterialCommunityIcons 
                            name="circle-edit-outline" 
                            size={24} 
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Modal
                visible={deleteModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDeleteModal(false)}
            >
                <DeleteRecordModal 
                    username={username}
                    customer_id={customer_id}
                    setCloseModal={setDeleteModal}
                    message={`All data related to ${username} will be deleted !`}
                    onConfirmDelete={handleDelete}
                />
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginVertical: 5,
        borderRadius: 10,
        overflow: 'scroll',
        width: width - 30,
        backgroundColor: '#f5f5f5'
    },
    pressableContainer: {
        flex: 1,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    usernameShortCutStyle: {
        borderRadius: 50,
        marginRight: 12,
        backgroundColor: "white",
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    shortcutText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black'
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: '500',
        maxWidth: width * 0.5,
    },
    amountText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 7,
        paddingLeft: 12,
    },
    iconButton: {
        backgroundColor: "white",
        padding: 4,
        borderRadius: 50,
    },
    edit_icon: {
        marginRight: 10,
        color: 'gray'
    }
});