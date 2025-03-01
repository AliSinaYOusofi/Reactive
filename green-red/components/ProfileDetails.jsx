import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

const ProfileDetailsModal = ({ isVisible, onClose, profileData }) => {
    if (!profileData) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.handle} />
                    <Text style={styles.modalTitle}>Profile Details</Text>
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Username:</Text>
                        <Text style={styles.value}>{profileData.username}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{profileData.email}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Created At:</Text>
                        <Text style={styles.value}>
                            {new Date(
                                profileData.created_at
                            ).toLocaleDateString()}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        
    },
    modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        maxHeight: height * 0.8,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#00000030",
        borderRadius: 3,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    profileInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
    },
    value: {
        flex: 1,
        textAlign: "right",
    },
    closeButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
        width: "100%",
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ProfileDetailsModal;
