import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import DeleteRecordModal from '../global/DeleteRecordModal';
import { format_currency } from '../../utils/username_shortcut';
import { padi_color, received_color } from '../global/colors';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useListAnimation from '../animations/useListAnimation';
import useDeleteAnimation from '../animations/useDeleteAnimation';
import { TouchpadOff, Trash2 } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export default function CustomerListTemplate({onDelete, index=1, username='', totalAmount='', transaction_type=0, currency=0 }) {
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
                <TouchableOpacity 
                    onPress={handleCustomerViewClick} 
                    style={styles.pressableContainer}
                >
                    <View style={styles.mainContent}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text style={styles.shortcutText}>
                                {(currency)}
                            </Text>
                        </View>
                        
                        <View style={styles.textContainer}>
                            <Text 
                                numberOfLines={1} 
                                ellipsizeMode="tail" 
                                style={styles.usernameText}
                            >
                                {username}
                            </Text>
                            <Text 
                                numberOfLines={1} 
                                ellipsizeMode="tail" 
                                style={styles.amountText}
                            >
                                {totalAmount} {currency}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.iconsContainer}>
                    <TouchableOpacity 
                        onPress={() => setDeleteModal(true)} 
                        style={styles.iconButton}
                    >
                        <Trash2 
                            name="delete-alert-outline" 
                            size={24} 
                            color="black" 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigator.navigate("EditCustomer", {username, totalAmount, currency, transaction_type})}
                        style={[styles.iconButton, styles.edit_icon]}
                    >
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
        backgroundColor: "white",
        borderRadius: 50,
        padding: 10,
        marginRight: 12,
    },
    shortcutText: {
        fontSize: 14,
        fontWeight: '500',
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
        padding: 8,
        borderRadius: 50,
    },
    edit_icon: {
        marginRight: 10
    }
});