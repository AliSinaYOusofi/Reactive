
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import ShowTransactionDetailsModal from "./ShowTransactionDetailsModal";
import DeleteRecordModal from "../global/DeleteRecordModal";
import EditCustomerRecordModal from "../global/EditCustomerRecordModal";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import useListAnimation from "../animations/useListAnimation";
import useDeleteAnimation from "../animations/useDeleteAnimation";
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { padi_color, received_color } from "../global/colors";

import React, { useState } from 'react'
import { Pressable, View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native'
import ShowTransactionDetailsModal from './ShowTransactionDetailsModal'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeleteRecordModal from '../global/DeleteRecordModal';
import EditCustomerRecordModal from '../global/EditCustomerRecordModal';
import { padi_color, received_color } from '../global/colors';
import { Trash2 } from 'lucide-react-native';
const { width } = Dimensions.get('window')

export default function UserListView({username, amount, currency, transaction_type, transaction_date, record_id}) {

    const [detailsModal, setDetailsModal] = useState(false)
    const [ deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    
    return (
        <>

            <View style={[styles.container, animatedStyle]}>
                {/* MAIN CONTENT */}
                <TouchableOpacity
                    onPress={() => setDetailsModal(true)}
                    style={styles.pressable}
                    activeOpacity={0.8}
                >
                    <View style={styles.mainRow}>
                        {/* Avatar */}
                        <View
                            style={[
                                styles.avatar,
                                {
                                    backgroundColor: transaction_type === "received" ? received_color : padi_color,
                                },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {currency.substring(0, 2).toUpperCase()}
                            </Text>
                        </View>

            <View style={[styles.container, { backgroundColor: transaction_type === 'received' ? received_color : padi_color}]}>
                <TouchableOpacity onPress={() => setDetailsModal(true)} style={[styles.container]}>
                    
                    <View style={styles.username_and_shortcut_container}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text >{(currency)}</Text>
                        </View>
                        
                    </View>
                {/* ACTIONS */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={(e) => {e.stopPropagation(); setEditModal(true)}}
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                    >
                        <Feather name="edit-3" size={18} color="#333333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDeleteModal(true)}
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                    >
                        <Feather name="trash-2" size={18} color="#333" />
                    <View style={styles.textContainer}>
                        
                        <Text style={styles.amountText}
                            numberOfLines={1} 
                            ellipsizeMode="tail">  
                            <Text style={styles.amount}>{amount}</Text> {currency} 
                        </Text>
                        
                    </View>                
                </TouchableOpacity>
                
                <View style={styles.icon_container}>
                    
                    <TouchableOpacity style={styles.deleteicon} onPress={() => setDeleteModal(true)}>
                        <Trash2 
                            style={styles._icon} 
                            size={24} 
                            color="black" 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setEditModal(true)}>
                        <MaterialCommunityIcons 
                            style={styles._icon} 
                            name="circle-edit-outline" 
                            size={24} 
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={detailsModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDetailsModal(!detailsModal)}
            >
                <ShowTransactionDetailsModal 
                    username={username}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
                    transaction_date={transaction_date}
                    closeModal={setDetailsModal}
                />
            </Modal>

            <Modal
                visible={deleteModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDeleteModal(false)}
            >
                <DeleteRecordModal 
                    username={username}
                    setCloseModal={setDeleteModal}
                    message={"Are you sure you want to delete this record?"}
                    record_id={record_id}
                />
            </Modal>
            
            <Modal
                visible={editModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setEditModal(false)}
            >
                <EditCustomerRecordModal 
                    username={username}
                    setUpdateRecordModal={setEditModal}
                    record_id={record_id}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
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
        padding: 4,
        marginVertical: 5,
        borderRadius: 10
    },
    
    usernameShortCutStyle: {
        backgroundColor: "white", // the bg-color
        borderRadius: 50,
        padding: 8
    },
    
    hr: {

        // Adjust as needed for spacing
    },

    username_and_shortcut_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10
    },
    
    username: {

    },
    _icon: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        backgroundColor: "white", // the bg-color
        borderRadius: 50,
        padding: 8
        
    },

    icon_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    },
    textContainer: {
        marginLeft: 10,
        
    },
    usernameText: {
        fontSize: 16,
        fontWeight: '500',
        maxWidth: width * 0.5,
    },
    amountText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
    deleteicon : {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 50,
    },
    amount: {
        color: 'black',
        fontWeight: '600',
        fontSize: 18
    }
})