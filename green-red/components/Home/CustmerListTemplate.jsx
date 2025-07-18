import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import DeleteRecordModal from '../global/DeleteRecordModal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useListAnimation from '../animations/useListAnimation';
import useDeleteAnimation from '../animations/useDeleteAnimation';
import { Trash2, Edit3, ChevronRight } from 'lucide-react-native';
import getRandomColor from '../../utils/random_color_gen';

const { width } = Dimensions.get('window')

export default function CustomerListTemplate({
    onDelete, 
    index = 1, 
    username = '', 
    customer_id = 0,
    totalAmount = 0,
    currency = 'USD',
    transaction_type = 'neutral'
}) {
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
        navigator.navigate("CustomerData", { username, customer_id })
    }

    const handleDelete = async () => {
        animateDelete();
        setTimeout(() => {
            setDeleteModal(false);
            if (onDelete) onDelete(username);
        }, 300);
    }

    // Get user initials for avatar
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <>
            <Animated.View style={[styles.container, animatedStyle]}>
                <TouchableOpacity 
                    onPress={handleCustomerViewClick}
                    style={styles.pressableContainer}
                    activeOpacity={0.8}
                >
                    <View style={styles.mainContent}>
                        {/* Clean Black & White Avatar */}
                        <View style={[styles.avatarContainer, { backgroundColor: getRandomColor({ excludeLight: true, excludeDark: true }) }]}>
                            <Text style={styles.avatarText}>
                                {getUserInitials(username)}
                            </Text>
                        </View>
                        
                        {/* User Info Section */}
                        <View style={styles.textContainer}>
                            <Text 
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.usernameText}
                            >
                                {username}
                            </Text>
                            
                            {/* Amount Display */}
                            {totalAmount !== 0 && (
                                <Text style={styles.amountText}>
                                    {totalAmount} {currency}
                                </Text>
                            )}
                        </View>

                        {/* Subtle Chevron */}
                        <ChevronRight size={18} color="#666666" />
                    </View>
                </TouchableOpacity>
                
                {/* Minimalist Action Buttons */}
                <View style={styles.iconsContainer}>
                    <TouchableOpacity 
                        onPress={() => navigator.navigate("EditCustomer", { username })}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Edit3 size={18} color="#333333" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={() => setDeleteModal(true)}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Trash2 size={18} color="#333333" />
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
                    message={`All data related to ${username} will be deleted!`}
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
        marginVertical: 4,
        marginHorizontal: 0,
        borderRadius: 12,
        width: width - 30,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        
    },
    pressableContainer: {
        flex: 1,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 34,
        height: 34,
        borderRadius: 22,
        backgroundColor: "black",
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    usernameText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 2,
        letterSpacing: 0.2,
    },
    amountText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
        marginTop: 2,
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#F0F0F0',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
});