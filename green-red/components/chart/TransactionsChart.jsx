import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';
import { LineChart } from 'react-native-chart-kit';
import { format, parseISO } from 'date-fns';
import Flag from 'react-native-flags'
import { options } from '../global/CurrencyDropdownList';

export default function TransactionsChart({ navigation, route }) {
    const username = route.params.username;
    const [transactionData, setTransactionData] = useState({});
    const db = openDatabaseSync('green-red.db');

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const query = `
                    SELECT currency, amount, transaction_type, transaction_at
                    FROM customer__records
                    WHERE username = ?
                    ORDER BY transaction_at ASC
                `;
                const results = await db.getAllAsync(query, [username]);

                if (!results || results.length === 0) {
                    setTransactionData(null);
                    return;
                }

                const dataByDate = results.reduce((acc, transaction) => {
                    const { currency, amount, transaction_type, transaction_at } = transaction;
                    const date = format(parseISO(transaction_at), 'yyyy-MM-dd');
                    
                    if (!acc[currency]) {
                        acc[currency] = {};
                    }
                    if (!acc[currency][date]) {
                        acc[currency][date] = { received: 0, paid: 0 };
                    }
                    
                    if (transaction_type === 'received') {
                        acc[currency][date].received += parseFloat(amount);
                    } else {
                        acc[currency][date].paid += parseFloat(amount);
                    }
                    
                    return acc;
                }, {});

                setTransactionData(dataByDate);
            } catch (error) {
                console.error("Error fetching transaction data:", error.message);
                setTransactionData(null);
            }
        };

        fetchTransactionData();
    }, [username]);

    const renderChart = (currency) => {
        const data = Object.entries(transactionData[currency]).map(([date, amounts]) => ({
            date,
            received: amounts.received,
            paid: amounts.paid
        }));

        const chartData = {
            labels: data.map(d => format(parseISO(d.date), 'MMM dd')),
            datasets: [
                {
                    data: data.map(d => d.received),
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    strokeWidth: 2
                },
                {
                    data: data.map(d => d.paid),
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    strokeWidth: 2
                }
            ],
            legend: ["Received", "Paid"]
        };

        return (
            <View key={currency} style={styles.chartContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.currencyTitle}>{currency} Transactions </Text>
                    <Flag
                        code={options.find(option => option.value === currency)?.countryCode || 'US'}
                        size={32}
                    />
                </View>
                <LineChart
                    data={chartData}
                    width={Dimensions.get('window').width - 32}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForLabels: {
                            fontSize: 10,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{username}'s Transactions</Text>
            {transactionData ? (
                Object.keys(transactionData).length > 0 ? (
                    Object.keys(transactionData).map(renderChart)
                ) : (
                    <Text style={styles.loadingText}>Loading chart data...</Text>
                )
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No transaction data available for {username}.</Text>
                    <Text style={styles.noDataSubText}>Add some transactions to see charts.</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        padding: 16,
    },
    chartContainer: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 8,
    },
    currencyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'left',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    noDataSubText: {
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: 16,
        textAlign: 'center',
    },
});