
import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import DeleteRecordModal from '../global/DeleteRecordModal';
import { format_username } from '../../utils/username_shortcut';
import { padi_color, received_color } from '../global/colors';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useListAnimation from '../animations/useListAnimation';
import useDeleteAnimation from '../animations/useDeleteAnimation';
import { Trash2 } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function CustomerListTemplate({ index, username, totalAmount, transaction_type, currency, phone, email, isSearchComponent, searchResultLength, onDelete }) {
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
        navigator.navigate("CustomerData", {username})    
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
            
            <Animated.View style={[styles.container, { backgroundColor: transaction_type === 'received' ? received_color : padi_color}, animatedStyle]}>
                <Pressable onPress={handleCustomerViewClick} style={[styles.container]}>
                    <View style={styles.username_and_shortcut_container}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text>{format_username(username)}</Text>
                        </View>
                        <View>
                            <Text> {username} </Text>
                        </View>
                    </View>

                    <View>
                        <Text>  {totalAmount} {currency} </Text>
                    </View>                
                </Pressable>
                
                <View style={styles._icons_container}>
                    <Pressable 
                        onPress={() => setDeleteModal(true)} 
                        style={styles.delete_icon}
                    >
                        <Trash2 
                            name="delete-alert-outline" 
                            size={24} 
                            color="black" 
                        />
                    </Pressable>

                    <Pressable onPress={() => navigator.navigate("EditCustomer", {username, totalAmount, currency, transaction_type, email, phone})}>
                        <MaterialCommunityIcons 
                            style={styles.pdf_icon} 
                            name="circle-edit-outline" 
                            size={24} 
                            color="black"
                        />
                    </Pressable>
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        marginVertical: 5,
        borderRadius: 10,
        overflow: 'hidden'
    },
    usernameShortCutStyle: {
        backgroundColor: "white",
        borderRadius: 50,
        padding: 8
    },
    username_and_shortcut_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10
    },
    delete_icon: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 50,
    },
    _icons_container: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    },
    search_header: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 10,
    },
    pdf_icon: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 50,
    },
    
});
