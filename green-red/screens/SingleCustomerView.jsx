import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import AddNewCustomeRecordModal from "../components/global/AddNewCustomeRecordModal";
import { useAppContext } from "../context/useAppContext";
import Animated, {
    FadeIn,
    withSpring,
    useSharedValue,
} from "react-native-reanimated";
import NoCustomerRecordFound from "../components/global/NoCustomerRecordFound";
import { AntDesign, Entypo } from "@expo/vector-icons";
import AnimatedUserListView from "../components/global/AnimatedUserListView";
import CarouselOfTracker from "../components/carousel/Carouself";
import { supabase } from "../utils/supabase";
import RetryComponent from "../components/RetryComponent";
import SingleCustomerSortOptions from "../components/SingleCustomerSort";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";

export default function SingleCustomerView({ navigation, route }) {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortModal, setSortModal] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState(null); // Track the selected sort option
    const [convertinToPdf, setConvertingToPdf] = useState(false);

    const username = route.params.username;
    const [addNewRecordModal, setAddNewRecordModal] = useState(false);
    const {
        refreshSingelViewChangeDatabase,
        refreshHomeScreenOnChangeDatabase,
        userId,
    } = useAppContext();
    const [singleCustomerExpense, setSingleCustomerExpense] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState("");

    const modalScale = useSharedValue(0);

    useEffect(() => {
        const fetchAllCustomerExpense = async () => {
            setIsLoading(true);
            let totalAmountsByCurrency = {};

            try {
                const { data: initialTransaction, error: error1 } =
                    await supabase
                        .from("customers")
                        .select("amount, currency, transaction_type")
                        .eq("username", username)
                        .eq("user_id", userId)
                        .limit(1);

                if (error1) {
                    console.error(
                        "Error fetching initial transaction:",
                        error1
                    );
                    return;
                }

                if (initialTransaction && initialTransaction.length > 0) {
                    const { amount, currency, transaction_type } =
                        initialTransaction[0];
                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive:
                            transaction_type === "received"
                                ? parseFloat(amount)
                                : 0,
                        totalAmountBasedOnCurrencyToTake:
                            transaction_type === "paid"
                                ? parseFloat(amount)
                                : 0,
                    };
                }

                const { data: customerRecords, error: error2 } = await supabase
                    .from("customer__records")
                    .select("currency")
                    .eq("username", username);

                if (error2) {
                    console.error("Error fetching customer records:", error2);
                    return;
                }

                const distinctCurrencies = [
                    ...new Set(
                        customerRecords.map((record) => record.currency)
                    ),
                ];

                await Promise.all(
                    distinctCurrencies.map(async (currency) => {
                        const [toGiveResult, toTakeResult] = await Promise.all([
                            supabase
                                .from("customer__records")
                                .select("amount")
                                .eq("transaction_type", "received")
                                .eq("currency", currency)
                                .eq("username", username)
                                .eq("user_id", userId),
                            supabase
                                .from("customer__records")
                                .select("amount")
                                .eq("transaction_type", "paid")
                                .eq("currency", currency)
                                .eq("username", username)
                                .eq("user_id", userId)
                        ]);

                        if (toGiveResult.error || toTakeResult.error) {
                            console.error(
                                "Error fetching transaction data:",
                                toGiveResult.error || toTakeResult.error
                            );
                            return;
                        }

                        if (!totalAmountsByCurrency[currency]) {
                            totalAmountsByCurrency[currency] = {
                                totalAmountBasedOnCurrencyToGive: 0,
                                totalAmountBasedOnCurrencyToTake: 0,
                            };
                        }

                        const toGiveTotal = toGiveResult.data.reduce(
                            (sum, record) => sum + record.amount,
                            0
                        );
                        const toTakeTotal = toTakeResult.data.reduce(
                            (sum, record) => sum + record.amount,
                            0
                        );

                        totalAmountsByCurrency[
                            currency
                        ].totalAmountBasedOnCurrencyToGive += toGiveTotal;
                        totalAmountsByCurrency[
                            currency
                        ].totalAmountBasedOnCurrencyToTake += toTakeTotal;
                    })
                );

                const total_expense_data = Object.keys(
                    totalAmountsByCurrency
                ).map((currency) => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive:
                        totalAmountsByCurrency[currency]
                            .totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake:
                        totalAmountsByCurrency[currency]
                            .totalAmountBasedOnCurrencyToTake,
                }));
                setSingleCustomerExpense(total_expense_data);
            } catch (error) {
                console.error(
                    "Error fetching customer expenses:",
                    error.message
                );
                setError(error.message || "Failed to fetch customers");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllCustomerExpense();
    }, [username, refreshSingelViewChangeDatabase, refresh]);

    useEffect(() => {
        const loadCustomerDataList = async () => {
            try {
                const { data, error } = await supabase
                    .from("customer__records")
                    .select("*")
                    .eq("user_id", userId)

                if (error) {
                    setError(error.message || "Failed to fetch records");
                    console.error(
                        "Error while fetching customer records:",
                        error
                    );
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Failed to fetch customer records",
                    });
                    return;
                }

                let sortedCustomers = [...data];

                if (selectedSortOption === "HIGHEST") {
                    sortedCustomers.sort((a, b) => b.amount - a.amount);
                } else if (selectedSortOption === "LOWEST") {
                    sortedCustomers.sort((a, b) => a.amount - b.amount);
                } else {
                    sortedCustomers.sort(
                        (a, b) =>
                            new Date(b.transaction_at) -
                            new Date(a.transaction_at)
                    );
                }

                setCustomers(sortedCustomers);
            } catch (e) {
                console.error("Error while fetching customer records:", e);
                setError("Failed to fetch records");
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to fetch customer records",
                });
            }
        };

        loadCustomerDataList();
    }, [
        refreshSingelViewChangeDatabase,
        username,
        refreshHomeScreenOnChangeDatabase,
        refresh,
        selectedSortOption,
    ]);

    const AllCustomersData = async () => {
        try {
            let allCustomersDataToConvert = [];

            const { data: all_customers, error: error1 } = await supabase
                .from("customers")
                .select("*")
                .eq("user_id", userId);

            if (error1) {
                throw error1;
            }

            await Promise.all(
                all_customers.map(async (customer) => {
                    const { data: other_customer_records, error: error2 } =
                        await supabase
                            .from("customer__records")
                            .select("*")
                            .eq("username", username);

                    if (error2) {
                        console.error(
                            "Error fetching customer records:",
                            error2
                        );
                        return;
                    }

                    const customers_with_relevant_records = {
                        ...customer,
                        records: other_customer_records,
                    };

                    allCustomersDataToConvert.push(
                        customers_with_relevant_records
                    );
                })
            );

            return allCustomersDataToConvert;
        } catch (error) {
            console.error("Error while generating data", error);
        }
    };

    const convertQueryResultToPdf = async () => {
        setConvertingToPdf(true);
        try {
            const allCustomersDataToConvert = await AllCustomersData();
            if (!allCustomersDataToConvert.length) {
                return showToast("No customers found");
            }

            const formatDateTime = (dateString) => {
                const date = parseISO(dateString);
                return `${format(
                    date,
                    "MMM d, yyyy HH:mm"
                )} (${formatDistanceToNowStrict(date)} ago)`;
            };

            const customerDataHtml = allCustomersDataToConvert
                .map((customer, index) => {
                    const records = customer.records || [];

                    const transactionRows = [customer, ...records]
                        .map(
                            (transaction, tIndex) => `
                  <tr class="${tIndex === 0 ? "customer-row" : "record-row"} ${
                                index % 2 === 0 ? "even" : "odd"
                            }">
                    ${
                        tIndex === 0
                            ? `<td rowspan="${
                                  records.length + 1
                              }" class="username">${customer.username}</td>`
                            : ""
                    }
                    <td class="transaction-type">${
                        transaction.transaction_type
                    }</td>
                    <td class="amount">${transaction.amount} ${
                                transaction.currency
                            }</td>
                    <td class="date">${formatDateTime(
                        transaction.at || transaction.transaction_at
                    )}</td>
                  </tr>
                `
                        )
                        .join("");

                    return `
                  <tbody class="customer-group">
                    ${transactionRows}
                  </tbody>
                `;
                })
                .join("");

            const customerHtml = `
                <html>
                  <head>
                    <style>
                      :root {
                        --primary-color: #4f46e5;
                        --secondary-color: #6366f1;
                        --text-color: #1e293b;
                        --border-color: #e2e8f0;
                      }
          
                      body {
                        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                        margin: 2rem;
                        color: var(--text-color);
                        line-height: 1.6;
                      }
          
                      .report-header {
                        text-align: center;
                        margin-bottom: 2rem;
                        padding-bottom: 1.5rem;
                        border-bottom: 2px solid var(--border-color);
                      }
          
                      h1 {
                        color: var(--primary-color);
                        margin: 0 0 0.5rem 0;
                        font-size: 2.2rem;
                        font-weight: 600;
                      }
          
                      .report-subtitle {
                        color: #64748b;
                        font-size: 0.9rem;
                      }
          
                      table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        background: white;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                      }
          
                      thead {
                        background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                        color: white;
                        font-size: 0.95rem;
                      }
          
                      th {
                        padding: 1.1rem 1.5rem;
                        text-align: left;
                        font-weight: 500;
                        letter-spacing: 0.5px;
                      }
          
                      td {
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid var(--border-color);
                      }
          
                      .customer-group {
                        border-bottom: 2px solid var(--primary-color);
                      }
          
                      .customer-row {
                        background-color: #f8fafc;
                      }
          
                      .record-row {
                        background-color: white;
                      }
          
                      .username {
                        font-weight: 600;
                        color: var(--primary-color);
                      }
          
                      .transaction-type {
                        font-style: italic;
                      }
          
                      .amount {
                        font-family: 'Courier New', monospace;
                        font-weight: 600;
                        color: #16a34a;
                      }
          
                      .date {
                        white-space: nowrap;
                        font-size: 0.9rem;
                        color: #64748b;
                      }
          
                      @media print {
                        body {
                          margin: 1cm;
                          font-size: 12pt;
                        }
          
                        table {
                          box-shadow: none;
                        }
          
                        .report-header {
                          padding-bottom: 0.5rem;
                          margin-bottom: 1rem;
                        }
          
                        h1 {
                          font-size: 18pt;
                        }
          
                        th {
                          padding: 0.75rem;
                        }
          
                        td {
                          padding: 0.5rem;
                        }
                      }
                    .customer_name {
                        color: green,
                        font-size: 18px;
                    }
                    </style>
                  </head>
                  <body>
                    <div class="report-header">
                      <h1>Customer Transaction Report</h1>
                      <h1 class="customer_name"> Customer Name: ${username} </h1>
                      <div class="report-subtitle">
                        Generated on ${format(new Date(), "MMM d, yyyy HH:mm")}
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Transaction Type</th>
                          <th>Amount</th>
                          <th>Date & Time</th>
                        </tr>
                      </thead>
                      ${customerDataHtml}
                    </table>
                  </body>
                </html>
              `;

            const { uri } = await Print.printToFileAsync({
                html: customerHtml,
                base64: false,
            });

            await Sharing.shareAsync(uri, {
                dialogTitle: "Customer Transaction History",
                mimeType: "application/pdf",
                UTI: "com.adobe.pdf",
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            showToast("Failed to generate PDF");
        } finally {
            setConvertingToPdf(false);
        }
    };
    const handleAddNewCustomer = () => {
        modalScale.value = withSpring(1);
        setAddNewRecordModal(true);
    };

    if (isLoading) {
        return (
            <ActivityIndicator
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                }}
                color="black"
                size={"large"}
            />
        );
    } else if (error) {
        return (
            <View style={styles.errorContainer}>
                <RetryComponent
                    setRefresh={setRefresh}
                    setError={setError}
                    errorMessage={error}
                />
            </View>
        );
    }

    return (
        <>
            <Animated.View
                style={{ backgroundColor: "white", height: 195 }}
                entering={FadeIn.duration(500)}
            >
                <CarouselOfTracker
                    totalExpenseOfCustomer={singleCustomerExpense}
                />
            </Animated.View>

            <View
                style={{
                    flex: 1,
                    paddingBottom: 40,
                    backgroundColor: "white",
                    marginTop: 50,
                }}
            >
                <View style={styles.usernameContainer}>
                    <Text style={styles.username}>Transactions with {username} ({customers.length})</Text>
                </View>
                <ScrollView style={styles.container}>
                    {customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <AnimatedUserListView
                                key={customer.id}
                                customer={customer}
                                index={index}
                            />
                        ))
                    ) : (
                        <NoCustomerRecordFound />
                    )}
                </ScrollView>
            </View>

            <Animated.View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddNewCustomer}
                >
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSortModal(true)}
                >
                    <AntDesign
                        name="filter"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={convertQueryResultToPdf}
                >
                    {convertinToPdf ? (
                        <ActivityIndicator size={24} color={"black"} />
                    ) : (
                        <AntDesign
                            name="download"
                            size={24}
                            color="white"
                            style={styles.icon}
                        />
                    )}
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.button}>
                    <Entypo
                        name="wallet"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                </TouchableOpacity> */}
            </Animated.View>

            <Modal
                visible={addNewRecordModal}
                animationType="none"
                transparent={true}
                onRequestClose={() => {
                    modalScale.value = withSpring(0);
                    setAddNewRecordModal(false);
                }}
            >
                <Animated.View style={[{ flex: 1 }]}>
                    <AddNewCustomeRecordModal
                        username={username}
                        setAddNewRecordModal={setAddNewRecordModal}
                    />
                </Animated.View>
            </Modal>

            <Modal
                visible={sortModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSortModal(false)}
            >
                <SingleCustomerSortOptions
                    setSelected={setSelectedSortOption}
                    selected={selectedSortOption}
                    setCloseSortModal={setSortModal}
                />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        height: "100%",
    },

    add_new_customer_btn: {},
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    errorText: {
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "between",
        alignItems: "stretch",
        columnGap: 18, // Increased gap for better spacing
        backgroundColor: "#181c20",
        color: "white",
        height: "auto",
        backgroundColor: "#14171A",
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        backgroundColor: "#14171A",
        borderRadius: 9999,
        width: "70%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        bottom: 1,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Added for better text alignment
        backgroundColor: "white", // A modern blue shade
        paddingVertical: 12,
        paddingHorizontal: 16, // Adjusted padding for better text fit
        borderRadius: 25,
    },
    icon: {
        color: "black",
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    },
    usernameContainer: {
        padding: 10,
        justifyContent: "center",
        alignItems: "start",
        marginTop: 10
    },
    username: {
        color: "black",
        fontSize: 23,
        fontWeight: "bold",
    },
});
