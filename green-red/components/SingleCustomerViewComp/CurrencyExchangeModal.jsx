import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import CurrencyDropdownListSearch from "../global/CurrencyDropdownList";
import Toast from "react-native-toast-message";

// for generating pdf of the converted transactions
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";

const { width, height } = Dimensions.get("window");

export default function CurrencyConverterModal({
    transactions = [],
    onClose,
    onConvert,
    username = "Customer",
}) {
    const [targetCurrency, setTargetCurrency] = useState("");
    const [exchangeRates, setExchangeRates] = useState({});
    const [manualRates, setManualRates] = useState({});
    const [loading, setLoading] = useState(false);
    const [useManualRates, setUseManualRates] = useState(false);
    const [convertedTransactions, setConvertedTransactions] = useState([]);
    const [isConverted, setIsConverted] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // afer conversion is complete we want scroll so the resutls are visible
    const scrollViewRef = useRef(null);

    // Get unique currencies from transactions
    const uniqueCurrencies = [
        ...new Set(transactions.map((t) => t.currency)),
    ].filter((c) => c !== targetCurrency);

    useEffect(() => {
        if (targetCurrency && !useManualRates && uniqueCurrencies.length > 0) {
            fetchExchangeRates();
        }
    }, [targetCurrency, useManualRates]);

    const fetchExchangeRates = async () => {
        if (!targetCurrency || uniqueCurrencies.length === 0) return;

        setLoading(true);
        try {
            // Using exchangerate-api.com (free tier: 1500 requests/month)
            const promises = uniqueCurrencies.map(async (currency) => {
                const response = await fetch(
                    `https://api.exchangerate-api.com/v4/latest/${currency}`
                );
                const data = await response.json();
                return { from: currency, rates: data.rates };
            });

            const results = await Promise.all(promises);
            const rates = {};

            results.forEach(({ from, rates: currencyRates }) => {
                if (currencyRates[targetCurrency]) {
                    rates[from] = currencyRates[targetCurrency];
                }
            });

            setExchangeRates(rates);
            showToast("Exchange rates fetched successfully!", "success");
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            showToast(
                "Failed to fetch exchange rates. Please use manual input.",
                "error"
            );
            setUseManualRates(true);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "error") => {
        Toast.show({
            type: type,
            text1: message,
            position: "top",
            topOffset: 100,
        });
    };

    const handleManualRateChange = (currency, rate) => {
        setManualRates((prev) => ({
            ...prev,
            [currency]: Number.parseFloat(rate) || 0,
        }));
    };

    const calculateConversion = () => {
        if (!targetCurrency) {
            showToast("Please select a target currency");
            return;
        }

        const ratesToUse = useManualRates ? manualRates : exchangeRates;
        const missingRates = uniqueCurrencies.filter(
            (currency) => !ratesToUse[currency] || ratesToUse[currency] === 0
        );

        if (missingRates.length > 0) {
            showToast(`Missing exchange rates for: ${missingRates.join(", ")}`);
            return;
        }

        const converted = transactions.map((transaction) => {
            if (transaction.currency === targetCurrency) {
                return {
                    ...transaction,
                    convertedAmount: transaction.amount,
                    exchangeRate: 1,
                    originalAmount: transaction.amount,
                    originalCurrency: transaction.currency,
                };
            }

            const rate = ratesToUse[transaction.currency];
            const convertedAmount = transaction.amount * rate;

            return {
                ...transaction,
                convertedAmount: Number.parseFloat(convertedAmount.toFixed(2)),
                exchangeRate: rate,
                originalAmount: transaction.amount,
                originalCurrency: transaction.currency,
            };
        });

        setConvertedTransactions(converted);
        setIsConverted(true);
        showToast("Conversion completed successfully!", "success");
    };

    const getTotalByType = (type) => {
        return convertedTransactions
            .filter((t) => t.transaction_type === type)
            .reduce((sum, t) => sum + t.convertedAmount, 0)
            .toFixed(2);
    };

    const getNetAmount = () => {
        const received = Number.parseFloat(getTotalByType("received"));
        const paid = Number.parseFloat(getTotalByType("paid"));
        return (received - paid).toFixed(2);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatDateTime = (dateString) => {
        const date = parseISO(dateString);
        return `${format(
            date,
            "MMM d, yyyy HH:mm"
        )} (${formatDistanceToNowStrict(date)} ago)`;
    };

    const generateConversionPdf = async () => {
        if (!convertedTransactions.length) {
            showToast("No converted transactions to export");
            return;
        }

        setGeneratingPdf(true);
        try {
            // Generate transaction rows
            let transactionRows = "";
            if (convertedTransactions.length > 0) {
                transactionRows = convertedTransactions
                    .map(
                        (record, tIndex) => `
                        <tr class="${
                            tIndex === 0 ? "customer-row" : "record-row"
                        } ${tIndex % 2 === 0 ? "even" : "odd"}">
                            ${
                                tIndex === 0
                                    ? `<td rowspan="${convertedTransactions.length}" class="username">${username}</td>`
                                    : ""
                            }
                            <td class="transaction-type">${
                                record.transaction_type
                            }</td>
                            <td class="amount">
                                ${record.convertedAmount} ${targetCurrency}
                                <br><small class="original-amount">(Original: ${
                                    record.originalAmount
                                } ${record.originalCurrency})</small>
                                <br><small class="exchange-rate">Rate: ${record.exchangeRate.toFixed(
                                    4
                                )}</small>
                            </td>
                            <td class="date">${formatDateTime(
                                record.transaction_at
                            )}</td>
                        </tr>
                    `
                    )
                    .join("");
            } else {
                transactionRows = `
                    <tr class="customer-row">
                        <td class="username">${username}</td>
                        <td colspan="3">No transactions</td>
                    </tr>
                `;
            }

            // Calculate totals for summary
            const totalReceived = getTotalByType("received");
            const totalPaid = getTotalByType("paid");
            const netAmount = getNetAmount();

            const conversionHtml = `
                <html>
                    <head>
                        <style>
                            :root {
                                --primary-color: #4f46e5;
                                --secondary-color: #6366f1;
                                --text-color: #1e293b;
                                --border-color: #e2e8f0;
                                --success-color: #187423ff;
                                --danger-color: #b92e34;
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

                            .customer_name {
                                font-size: 1.8rem;
                                margin: 1rem 0;
                            }

                            .conversion-notice {
                                background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                                border: 2px solid #0ea5e9;
                                border-radius: 12px;
                                padding: 16px;
                                margin: 16px 0;
                                text-align: center;
                                color: #0369a1;
                                font-weight: 600;
                                font-size: 1.1rem;
                            }

                            .summary-section {
                                background: #f8fafc;
                                border-radius: 12px;
                                padding: 20px;
                                margin: 20px 0;
                                border: 1px solid var(--border-color);
                            }

                            .summary-title {
                                font-size: 1.4rem;
                                font-weight: 700;
                                color: var(--primary-color);
                                margin-bottom: 16px;
                                text-align: center;
                            }

                            .summary-grid {
                                display: grid;
                                grid-template-columns: 1fr 1fr 1fr;
                                gap: 16px;
                                margin-bottom: 16px;
                            }

                            .summary-item {
                                text-align: center;
                                padding: 12px;
                                background: white;
                                border-radius: 8px;
                                border: 1px solid var(--border-color);
                            }

                            .summary-label {
                                font-size: 0.9rem;
                                color: #64748b;
                                margin-bottom: 4px;
                            }

                            .summary-value {
                                font-size: 1.2rem;
                                font-weight: 700;
                            }

                            .summary-received {
                                color: var(--success-color);
                            }

                            .summary-paid {
                                color: var(--danger-color);
                            }

                            .summary-net {
                                color: ${
                                    Number.parseFloat(netAmount) >= 0
                                        ? "var(--success-color)"
                                        : "var(--danger-color)"
                                };
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
                                margin-top: 20px;
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
                                vertical-align: top;
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

                            .even {
                                background-color: #f9fafb;
                            }

                            .username {
                                font-weight: 600;
                                color: var(--primary-color);
                                vertical-align: middle;
                            }

                            .transaction-type {
                                font-style: italic;
                                text-transform: capitalize;
                                font-weight: 500;
                            }

                            .amount {
                                font-family: 'Courier New', monospace;
                                font-weight: 600;
                                color: var(--success-color);
                            }

                            .original-amount {
                                font-size: 0.8rem;
                                color: #64748b;
                                font-style: italic;
                                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                            }

                            .exchange-rate {
                                font-size: 0.75rem;
                                color: #424852ff;
                                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                            }

                            .date {
                                white-space: nowrap;
                                font-size: 0.9rem;
                                color: #64748b;
                            }

                            .conversion-info {
                                background: #fef3c7;
                                border: 1px solid #f59e0b;
                                border-radius: 8px;
                                padding: 12px;
                                margin: 16px 0;
                                font-size: 0.9rem;
                                color: #92400e;
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

                                .customer_name {
                                    font-size: 16pt;
                                }

                                th {
                                    padding: 0.75rem;
                                }

                                td {
                                    padding: 0.5rem;
                                }

                                .summary-grid {
                                    grid-template-columns: 1fr;
                                    gap: 8px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="report-header">
                            <h1>Currency Conversion Report</h1>
                            <h1 class="customer_name">Customer: ${username}</h1>
                            <div class="conversion-notice">
                                All amounts converted to ${targetCurrency}
                            </div>
                            <div class="report-subtitle">
                                Generated on ${format(
                                    new Date(),
                                    "MMM d, yyyy HH:mm"
                                )}
                            </div>
                        </div>

                        <div class="summary-section">
                            <div class="summary-title">Conversion Summary</div>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <div class="summary-label">Total Received</div>
                                    <div class="summary-value summary-received">${totalReceived} ${targetCurrency}</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">Total Paid</div>
                                    <div class="summary-value summary-paid">${totalPaid} ${targetCurrency}</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">Net Amount</div>
                                    <div class="summary-value summary-net">${netAmount} ${targetCurrency}</div>
                                </div>
                            </div>
                        </div>

                        <div class="conversion-info">
                            <strong>Conversion Details:</strong> ${
                                convertedTransactions.length
                            } transactions converted using ${
                useManualRates ? "manual exchange rates" : "live exchange rates"
            } on ${format(new Date(), "MMM d, yyyy 'at' HH:mm")}.
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Transaction Type</th>
                                    <th>Amount & Conversion</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody class="customer-group">
                                ${transactionRows}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            // Generate the PDF and share it
            const { uri } = await Print.printToFileAsync({
                html: conversionHtml,
                base64: false,
            });

            await Sharing.shareAsync(uri, {
                dialogTitle: `${username} - Currency Conversion Report`,
                mimeType: "application/pdf",
                UTI: "com.adobe.pdf",
            });

            showToast("PDF generated and shared successfully!", "success");
        } catch (error) {
            console.error("Error generating PDF:", error);
            showToast("Failed to generate PDF");
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleApplyConversion = async () => {
        // Generate PDF first
        await generateConversionPdf();
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);

        // Close the modal
        // onClose();
    };
    return (
        <View style={styles.modalOverlay}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />

            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                style={styles.modalContainer}
            >
                <View style={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <View style={styles.headerIconContainer}>
                            <MaterialIcons
                                name="currency-exchange"
                                size={28}
                                color="#FFFFFF"
                            />
                        </View>
                        <Text style={styles.title}>Currency Converter</Text>
                        <Text style={styles.subtitle}>
                            Convert {transactions.length} transactions for{" "}
                            {username}
                        </Text>
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Current Currencies Info */}
                        {transactions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>
                                    Current Transactions
                                </Text>
                                <View style={styles.currencyInfo}>
                                    <Text style={styles.currencyInfoText}>
                                        Found {transactions.length} transactions
                                        in {uniqueCurrencies.length} currencies:
                                    </Text>
                                    <Text style={styles.currencyList}>
                                        {[
                                            ...new Set(
                                                transactions.map(
                                                    (t) => t.currency
                                                )
                                            ),
                                        ].join(", ")}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Target Currency Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>
                                Convert to Currency
                            </Text>
                            <CurrencyDropdownListSearch
                                selected={targetCurrency}
                                setSelected={setTargetCurrency}
                            />
                        </View>

                        {/* Rate Source Toggle */}
                        {targetCurrency && uniqueCurrencies.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>
                                    Exchange Rate Source
                                </Text>
                                <View style={styles.toggleContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            !useManualRates &&
                                                styles.toggleButtonActive,
                                        ]}
                                        onPress={() => setUseManualRates(false)}
                                    >
                                        <Feather
                                            name="globe"
                                            size={16}
                                            color={
                                                !useManualRates
                                                    ? "#FFFFFF"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                !useManualRates &&
                                                    styles.toggleTextActive,
                                            ]}
                                        >
                                            Live Rates
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            useManualRates &&
                                                styles.toggleButtonActive,
                                        ]}
                                        onPress={() => setUseManualRates(true)}
                                    >
                                        <Feather
                                            name="edit-3"
                                            size={16}
                                            color={
                                                useManualRates
                                                    ? "#FFFFFF"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                useManualRates &&
                                                    styles.toggleTextActive,
                                            ]}
                                        >
                                            Manual Input
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Exchange Rates Display/Input */}
                        {targetCurrency && uniqueCurrencies.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>
                                    Exchange Rates{" "}
                                    {loading && (
                                        <ActivityIndicator
                                            size="small"
                                            color="#1E293B"
                                        />
                                    )}
                                </Text>

                                {uniqueCurrencies.map((currency) => (
                                    <View
                                        key={currency}
                                        style={styles.rateContainer}
                                    >
                                        <View style={styles.rateHeader}>
                                            <Text style={styles.rateLabel}>
                                                1 {currency} = ?{" "}
                                                {targetCurrency}
                                            </Text>
                                        </View>

                                        {useManualRates ? (
                                            <TextInput
                                                style={styles.rateInput}
                                                placeholder="Enter exchange rate"
                                                placeholderTextColor="#94A3B8"
                                                keyboardType="decimal-pad"
                                                value={
                                                    manualRates[
                                                        currency
                                                    ]?.toString() || ""
                                                }
                                                onChangeText={(value) =>
                                                    handleManualRateChange(
                                                        currency,
                                                        value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <View style={styles.rateDisplay}>
                                                <Text style={styles.rateValue}>
                                                    {loading
                                                        ? "Loading..."
                                                        : exchangeRates[
                                                              currency
                                                          ]?.toFixed(4) ||
                                                          "N/A"}
                                                </Text>
                                                {exchangeRates[currency] && (
                                                    <Text
                                                        style={
                                                            styles.rateTimestamp
                                                        }
                                                    >
                                                        Live rate
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Conversion Results */}
                        {isConverted && convertedTransactions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>
                                    Conversion Results
                                </Text>

                                {/* Summary */}
                                <View style={styles.summaryContainer}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>
                                            Total Received:
                                        </Text>
                                        <Text
                                            style={[
                                                styles.summaryValue,
                                                styles.receivedText,
                                            ]}
                                        >
                                            {getTotalByType("received")}{" "}
                                            {targetCurrency}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>
                                            Total Paid:
                                        </Text>
                                        <Text
                                            style={[
                                                styles.summaryValue,
                                                styles.paidText,
                                            ]}
                                        >
                                            {getTotalByType("paid")}{" "}
                                            {targetCurrency}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.summaryRow,
                                            styles.netRow,
                                        ]}
                                    >
                                        <Text style={styles.summaryLabel}>
                                            Net Amount:
                                        </Text>
                                        <Text
                                            style={[
                                                styles.summaryValue,
                                                Number.parseFloat(
                                                    getNetAmount()
                                                ) >= 0
                                                    ? styles.receivedText
                                                    : styles.paidText,
                                            ]}
                                        >
                                            {getNetAmount()} {targetCurrency}
                                        </Text>
                                    </View>
                                </View>

                                {/* Transaction Details */}
                                <Text style={styles.detailsLabel}>
                                    Transaction Details:
                                </Text>
                                {convertedTransactions.map(
                                    (transaction, index) => (
                                        <View
                                            key={transaction.id || index}
                                            style={styles.transactionRow}
                                        >
                                            <View
                                                style={styles.transactionInfo}
                                            >
                                                <Text
                                                    style={
                                                        styles.transactionType
                                                    }
                                                >
                                                    {
                                                        transaction.transaction_type
                                                    }
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.originalAmount
                                                    }
                                                >
                                                    {transaction.originalAmount}{" "}
                                                    {
                                                        transaction.originalCurrency
                                                    }
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.transactionDate
                                                    }
                                                >
                                                    {formatDate(
                                                        transaction.transaction_at
                                                    )}
                                                </Text>
                                            </View>
                                            <View style={styles.conversionInfo}>
                                                <Text
                                                    style={
                                                        styles.convertedAmount
                                                    }
                                                >
                                                    {
                                                        transaction.convertedAmount
                                                    }{" "}
                                                    {targetCurrency}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.exchangeRateText
                                                    }
                                                >
                                                    Rate:{" "}
                                                    {transaction.exchangeRate.toFixed(
                                                        4
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                )}

                                {convertedTransactions.length && (
                                    <Text style={styles.moreTransactions}>
                                        {convertedTransactions.length}{" "}
                                        transactions converted
                                    </Text>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        {!isConverted ? (
                            <TouchableOpacity
                                style={[
                                    styles.convertButton,
                                    (!targetCurrency || loading) &&
                                        styles.convertButtonDisabled,
                                ]}
                                onPress={calculateConversion}
                                disabled={!targetCurrency || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <Feather
                                        name="refresh-cw"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                )}
                                <Text style={styles.convertButtonText}>
                                    {loading
                                        ? "Loading..."
                                        : "Convert Transactions"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.actionButtonsRow}>
                                <TouchableOpacity
                                    style={styles.resetButton}
                                    onPress={() => {
                                        setIsConverted(false);
                                        setConvertedTransactions([]);
                                    }}
                                >
                                    <Feather
                                        name="refresh-cw"
                                        size={18}
                                        color="#64748B"
                                    />
                                    <Text style={styles.resetButtonText}>
                                        Reset
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.applyButton,
                                        generatingPdf &&
                                            styles.applyButtonDisabled,
                                    ]}
                                    onPress={handleApplyConversion}
                                    disabled={generatingPdf}
                                >
                                    {generatingPdf ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#FFFFFF"
                                        />
                                    ) : (
                                        <Feather
                                            name="file-text"
                                            size={18}
                                            color="#FFFFFF"
                                        />
                                    )}
                                    <Text style={styles.applyButtonText}>
                                        {generatingPdf
                                            ? "Generating PDF..."
                                            : "Apply & Export PDF"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Feather name="x" size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 1000,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        maxHeight: height * 0.9,
    },
    contentContainer: {
        backgroundColor: "white",
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        maxHeight: height * 0.9,
        shadowColor: "black",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 15,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    headerIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748B",
        fontWeight: "500",
    },
    scrollContainer: {
        maxHeight: height * 0.5,
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 12,
    },
    currencyInfo: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    currencyInfoText: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 8,
    },
    currencyList: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    toggleButtonActive: {
        backgroundColor: "#1E293B",
    },
    toggleText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#64748B",
    },
    toggleTextActive: {
        color: "#FFFFFF",
    },
    rateContainer: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    rateHeader: {
        marginBottom: 8,
    },
    rateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
    },
    rateInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        fontSize: 16,
        color: "#1E293B",
    },
    rateDisplay: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rateValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },
    rateTimestamp: {
        fontSize: 12,
        color: "#10B981",
        fontWeight: "500",
    },
    summaryContainer: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    netRow: {
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        marginTop: 8,
        paddingTop: 16,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#475569",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    receivedText: {
        color: "#10B981",
    },
    paidText: {
        color: "#EF4444",
    },
    detailsLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 12,
    },
    transactionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    transactionInfo: {
        flex: 1,
    },
    transactionType: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
        textTransform: "capitalize",
    },
    originalAmount: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
    },
    transactionDate: {
        fontSize: 11,
        color: "#94A3B8",
        marginTop: 2,
    },
    conversionInfo: {
        alignItems: "flex-end",
    },
    convertedAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
    },
    exchangeRateText: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 2,
    },
    moreTransactions: {
        fontSize: 12,
        color: "#64748B",
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
    },
    convertButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E293B",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    convertButtonDisabled: {
        backgroundColor: "#94A3B8",
    },
    convertButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    actionButtonsRow: {
        flexDirection: "row",
        gap: 12,
    },
    resetButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    resetButtonText: {
        color: "#64748B",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButton: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    applyButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
});
