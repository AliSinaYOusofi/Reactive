import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import SortOptionsDropDownModal from "../global/SortOptionsDropDownModal";
import { format, parseISO } from "date-fns";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { formatDistanceToNowStrict } from "date-fns";
import Toast from "react-native-toast-message";
import { Search } from "lucide-react-native";
import { supabase } from "../../utils/supabase";
import { AntDesign } from "@expo/vector-icons";
import { useAppContext } from "../../context/useAppContext";

export default function SearchCustomers({ handleSearch, setCustomers }) {
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState("NEWEST");
    const [convertinToPdf, setConvertingToPdf] = useState(false);
    const handleSearchCustomers = (search_this) => {
        setCurrentSearchTerm(search_this);
        handleSearch(search_this);
    };
    const { userId } = useAppContext();

    const handleSortByDateOldest = () => {
        setCustomers((prevCustomers) => {
            let sortedCustomers = prevCustomers.slice().sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at);
            });
            return sortedCustomers;
        });
    };

    const handleSortByDateNewst = () => {
        setCustomers((prevCustomers) => {
            let sortedCustomers = prevCustomers.slice().sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            return sortedCustomers;
        });
    };

    const handleSortByAscendingAlphabeticalOrder = () => {
        setCustomers((previouseCustomers) => {
            return previouseCustomers.slice().sort((a, b) => {
                return a.username.localeCompare(b.username);
            });
        });
    };

    const handleSortByDescendingAlphabeticalOrder = () => {
        setCustomers((previouseCustomers) => {
            return previouseCustomers.slice().sort((a, b) => {
                return b.username.localeCompare(a.username);
            });
        });
    };

    const AllCustomersData = async () => {
        try {
            const { data: customers, error } = await supabase
                .from("customers")
                .select("*");

            if (error) {
                console.error("Error fetching customers:", error);
                return;
            }

            let allCustomersDataToConvert = [];

            await Promise.all(
                customers.map(async (customer) => {
                    const { data: transactions, error: transError } =
                        await supabase
                            .from("customer_transactions")
                            .select("*")
                            .eq("customer_id", customer.id);

                    if (transError) {
                        console.error(
                            "Error fetching transactions for customer",
                            customer.id,
                            transError
                        );
                        return;
                    }

                    allCustomersDataToConvert.push({
                        ...customer,
                        records: transactions,
                    });
                })
            );
            return allCustomersDataToConvert;
        } catch (error) {
            console.error("Error while generating data", error);
        }
    };

    useEffect(() => {
        const handleSortOptionsChange = () => {
            switch (selectedSortOption) {
                case "OLDEST":
                    handleSortByDateOldest();
                    break;
                case "NEWEST":
                    handleSortByDateNewst();
                    break;
                case "ASC ALPHA":
                    handleSortByAscendingAlphabeticalOrder();
                    break;
                case "DESC ALPHA":
                    handleSortByDescendingAlphabeticalOrder();
                    break;
            }
        };
        handleSortOptionsChange();
    }, [selectedSortOption]);

    const showToast = (message, type = "error") => {
        Toast.show({
            type: type,
            text1: message,
            position: "top",
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    const convertQueryResultToPdf = async () => {
        setConvertingToPdf(true);
        try {
            const allCustomersDataToConvert = await AllCustomersData()

            if (
                !allCustomersDataToConvert ||
                !allCustomersDataToConvert.length
            ) {
                return showToast("No customers found");
            }

            // Function to format dates using parseISO and format functions.
            const formatDateTime = (dateString) => {
                const date = parseISO(dateString);
                return `${format(
                    date,
                    "MMM d, yyyy HH:mm"
                )} (${formatDistanceToNowStrict(date)} ago)`;
            };

            // Build the HTML for each customer's group of transactions.
            const customerDataHtml = allCustomersDataToConvert
                .map((customer, index) => {
                    const records = customer.records || [];
                    let transactionRows = "";

                    if (records.length > 0) {
                        // Render each transaction row.
                        transactionRows = records
                            .map(
                                (record, tIndex) => `
                  <tr class="${tIndex === 0 ? "customer-row" : "record-row"} ${
                                    index % 2 === 0 ? "even" : "odd"
                                }">
                    ${
                        tIndex === 0
                            ? `<td rowspan="${records.length}" class="username">${customer.username}</td>`
                            : ""
                    }
                    <td class="transaction-type">${record.transaction_type}</td>
                    <td class="amount">${record.amount} ${record.currency}</td>
                    <td class="date">${formatDateTime(
                        record.transaction_at
                    )}</td>
                  </tr>
                `
                            )
                            .join("");
                    } else {
                        // If there are no transactions, show a single row with a "No transactions" message.
                        transactionRows = `
                  <tr class="customer-row ${index % 2 === 0 ? "even" : "odd"}">
                    <td class="username">${customer.username}</td>
                    <td colspan="3">No transactions</td>
                  </tr>
                `;
                    }

                    return `
                <tbody class="customer-group">
                  ${transactionRows}
                </tbody>
              `;
                })
                .join("");

            // Generate the full HTML for the PDF.
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
                </style>
              </head>
              <body>
                <div class="report-header">
                  <h1>Customer Transaction Report</h1>
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

            // Print the HTML to a file and share it.
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

    return (
        <>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Search size={20} color="#64748B" style={styles.icon} />

                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={currentSearchTerm}
                        onChangeText={(text) => handleSearchCustomers(text)}
                    />
                </View>

                <View style={styles.sort_and_pdf_container}>
                    <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                        <AntDesign
                            name="filter"
                            size={24}
                            color="white"
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => convertQueryResultToPdf()}>
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
                </View>
            </View>

            <Modal
                visible={sortModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSortModalVisible(false)}
            >
                <SortOptionsDropDownModal
                    selected={selectedSortOption}
                    setSelected={setSelectedSortOption}
                    setCloseSortModal={setSortModalVisible}
                />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: 10,
        backgroundColor: "#f8f9fa",
        padding: 3,
        borderRadius: 10,
        marginTop: 120,
    },

    icon: {
        marginRight: 5,
        color: "black",
        borderRadius: 50,
        padding: 8,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "black",
    },

    sort_and_pdf_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: 0,
    },

    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        padding: 5,
    },
});
