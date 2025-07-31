
import React, { useEffect, useState } from "react";
import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import SearchCustomers from "../components/Home/SearchCustomers";
import CustomerListTemplate from "../components/Home/CustmerListTemplate";
import AddNewCustomer from "../components/global/AddNewCustomerButton";
import { useAppContext } from "../context/useAppContext";
import NoUserAddedInfo from "../components/global/NoUserAddedInfo";
import ZeroSearchResult from "../components/global/ZeroSearchResult";

import CarouselOfTracker from "../components/carousel/Carouself";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from "../utils/supabase";
import RetryComponent from "../components/RetryComponent";
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
});

export default function HomeScreen({ navigator }) {
    const [customers, setCustomers] = useState([]);

    const [customer, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("");
    const [totalExpenseOfCustomer, setTotalExpenseOfCustomers] = useState([]);
    const { refreshHomeScreenOnChangeDatabase, userId } = useAppContext();
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadCustomerDataList = async () => {
            setLoading(true);
            try {
                let { data: singleCustomer, error } = await supabase
                    .from("customers")
                    .select("*")
                    .eq("user_id", userId);

                if (error) {
                    console.error("Error fetching customers:", error);
                    setError(error.message || "Error Fetching customers table");
                    return;
                }

                if (!singleCustomer || singleCustomer.length === 0) {
                    setCustomers([]);
                    return;
                }

                setCustomers(singleCustomer);
            } catch (error) {
                console.error("Error loading customer data:", error);
                setError(error.message || "Error Fetching users table");
            } finally {
                setLoading(false);
            }
        };

        loadCustomerDataList();
    }, [refreshHomeScreenOnChangeDatabase, refresh]);

    const handleSearch = (searchTerm) => {
        setParentSearchTerm(searchTerm);
        setFilteredCustomers(
            customer.filter(
                (item) =>
                    searchTerm &&
                    item.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        );
    };

    useEffect(() => {
        const fetchTotalOfAmountsBasedOnCurrency = async () => {
            try {
                let totalAmountsByCurrency = {};

                const { data: transactionRecords, error: error1 } =
                    await supabase
                        .from("customer_transactions")
                        .select("currency")
                        .eq("user_id", userId);

                if (error1) {
                    console.error(
                        "Error fetching transaction records:",
                        error1
                    );
                    return;
                }

                const distinctCurrencies = [
                    ...new Set(
                        transactionRecords.map((record) => record.currency)
                    ),
                ];

                // For each currency, fetch the totals for "received" and "paid" transactions
                await Promise.all(
                    distinctCurrencies.map(async (currency) => {
                        const [toGiveResult, toTakeResult] = await Promise.all([
                            supabase
                                .from("customer_transactions")
                                .select("amount")
                                .eq("transaction_type", "received")
                                .eq("currency", currency)
                                .eq("user_id", userId),
                            supabase
                                .from("customer_transactions")
                                .select("amount")
                                .eq("transaction_type", "paid")
                                .eq("currency", currency)
                                .eq("user_id", userId),
                        ]);

                        if (toGiveResult.error || toTakeResult.error) {
                            console.error(
                                "Error fetching transaction data:",
                                toGiveResult.error || toTakeResult.error
                            );
                            return;
                        }

                        const toGiveTotal = toGiveResult.data.reduce(
                            (sum, record) => sum + record.amount,
                            0
                        );
                        const toTakeTotal = toTakeResult.data.reduce(
                            (sum, record) => sum + record.amount,
                            0
                        );

                        totalAmountsByCurrency[currency] = {
                            totalAmountBasedOnCurrencyToGive: toGiveTotal,
                            totalAmountBasedOnCurrencyToTake: toTakeTotal,
                        };
                    })
                );

                setTotalExpenseOfCustomers(
                    Object.entries(totalAmountsByCurrency).map(
                        ([currency, amounts]) => ({
                            currency,
                            totalAmountBasedOnCurrencyToGive:
                                amounts.totalAmountBasedOnCurrencyToGive,
                            totalAmountBasedOnCurrencyToTake:
                                amounts.totalAmountBasedOnCurrencyToTake,
                        })
                    )
                );
            } catch (error) {
                console.error("Error fetching total amounts:", error);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Refs for cleanup and optimization
    const searchTimeoutRef = useRef(null);
    const appStateRef = useRef(AppState.currentState);
    const isMountedRef = useRef(true);

    // Enhanced memoized filtered customers with search optimization
    const displayCustomers = useMemo(() => {
        if (!parentSearchTerm.trim()) return customers;

        const searchLower = parentSearchTerm.toLowerCase().trim();
        return customers.filter((item) => {
            const username = item.username?.toLowerCase() || "";
            const email = item.email?.toLowerCase() || "";
            const phone = item.phone?.toLowerCase() || "";

            return (
                username.includes(searchLower) ||
                email.includes(searchLower) ||
                phone.includes(searchLower)
            );
        });
    }, [customers, parentSearchTerm]);

    // Enhanced customer data loading with retry logic and caching
    const loadCustomerDataList = useCallback(
        async (isRefreshing = false, retryCount = 0) => {
            if (!isMountedRef.current) return;

            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                const { data: customerData, error: customerError } =
                    await supabase
                        .from("customers")
                        .select("*")
                        .eq("user_id", userId)
                        .order("created_at", { ascending: false });

                if (customerError) {
                    throw new Error(
                        customerError.message || "Failed to fetch customers"
                    );
                }

                if (isMountedRef.current) {
                    setCustomers(customerData || []);
                    setIsInitialLoad(false);
                }
            } catch (err) {
                console.error("Error loading customer data:", err);

                if (isMountedRef.current) {
                    setError(err.message);

                    // Retry logic for network errors
                    if (
                        retryCount < 2 &&
                        (err.message.includes("network") ||
                            err.message.includes("timeout"))
                    ) {
                        setTimeout(() => {
                            loadCustomerDataList(isRefreshing, retryCount + 1);
                        }, 1000 * (retryCount + 1));
                        return;
                    }

                    // Show user-friendly error alert only on final failure
                    if (!isRefreshing) {
                        Alert.alert(
                            "Connection Error",
                            "Unable to load customer data. Please check your internet connection and try again.",
                            [
                                {
                                    text: "Retry",
                                    onPress: () => loadCustomerDataList(false),
                                },
                                { text: "Cancel", style: "cancel" },
                            ]
                        );
                    }
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [userId]
    );

    // Enhanced total amounts calculation with better caching and error handling
    const fetchTotalAmounts = useCallback(
        async (retryCount = 0) => {
            if (!isMountedRef.current) return;

            try {
                // First, get all distinct currencies with better query
                const { data: transactionRecords, error: currencyError } =
                    await supabase
                        .from("customer_transactions")
                        .select("currency")
                        .eq("user_id", userId)
                        .not("currency", "is", null);

                if (currencyError) {
                    throw new Error("Failed to fetch currency data");
                }

                if (!transactionRecords?.length) {
                    if (isMountedRef.current) {
                        setTotalExpenseOfCustomers([]);
                    }
                    return;
                }

                const distinctCurrencies = [
                    ...new Set(
                        transactionRecords
                            .map((record) => record.currency)
                            .filter(Boolean)
                    ),
                ];

                // Batch process currencies for better performance
                const batchSize = 3;
                const currencyBatches = [];
                for (let i = 0; i < distinctCurrencies.length; i += batchSize) {
                    currencyBatches.push(
                        distinctCurrencies.slice(i, i + batchSize)
                    );
                }

                const allResults = [];

                for (const batch of currencyBatches) {
                    const batchResults = await Promise.allSettled(
                        batch.map(async (currency) => {
                            const [receivedResult, paidResult] =
                                await Promise.all([
                                    supabase
                                        .from("customer_transactions")
                                        .select("amount")
                                        .eq("transaction_type", "received")
                                        .eq("currency", currency)
                                        .eq("user_id", userId),
                                    supabase
                                        .from("customer_transactions")
                                        .select("amount")
                                        .eq("transaction_type", "paid")
                                        .eq("currency", currency)
                                        .eq("user_id", userId),
                                ]);

                            if (receivedResult.error || paidResult.error) {
                                throw new Error(
                                    `Failed to fetch ${currency} transactions`
                                );
                            }

                            const totalReceived =
                                receivedResult.data?.reduce(
                                    (sum, record) =>
                                        sum + (parseFloat(record.amount) || 0),
                                    0
                                ) || 0;

                            const totalPaid =
                                paidResult.data?.reduce(
                                    (sum, record) =>
                                        sum + (parseFloat(record.amount) || 0),
                                    0
                                ) || 0;

                            return {
                                currency,
                                totalAmountBasedOnCurrencyToGive: totalReceived,
                                totalAmountBasedOnCurrencyToTake: totalPaid,
                            };
                        })
                    );

                    allResults.push(...batchResults);
                }

                // Filter successful results and sort by currency
                const successfulResults = allResults
                    .filter((result) => result.status === "fulfilled")
                    .map((result) => result.value)
                    .sort((a, b) => a.currency.localeCompare(b.currency));

                if (isMountedRef.current) {
                    setTotalExpenseOfCustomers(successfulResults);
                }

                // Log any failed currency calculations
                const failedResults = allResults.filter(
                    (result) => result.status === "rejected"
                );
                if (failedResults.length > 0) {
                    console.warn(
                        "Some currency calculations failed:",
                        failedResults
                    );

                    // Retry failed calculations once
                    if (retryCount === 0) {
                        setTimeout(() => fetchTotalAmounts(1), 2000);
                    }
                }
            } catch (err) {
                console.error("Error fetching total amounts:", err);

                // Retry logic for critical errors
                if (
                    retryCount === 0 &&
                    (err.message.includes("network") ||
                        err.message.includes("timeout"))
                ) {
                    setTimeout(() => fetchTotalAmounts(1), 2000);
                }
            }
        },
        [userId]
    );

    // App state change handler for background/foreground
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // App came to foreground, refresh data if it's been a while
                const shouldRefresh =
                    Date.now() - (global.lastDataFetch || 0) > 300000; // 5 minutes
                if (shouldRefresh && userId) {
                    InteractionManager.runAfterInteractions(() => {
                        loadCustomerDataList(true);
                        fetchTotalAmounts();
                    });
                }
            }
            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );
        return () => subscription?.remove();
    }, [loadCustomerDataList, fetchTotalAmounts, userId]);

    // Initial data loading with interaction manager for better performance
    useEffect(() => {
        if (userId) {
            InteractionManager.runAfterInteractions(() => {
                loadCustomerDataList();
                fetchTotalAmounts();
                global.lastDataFetch = Date.now();
            });
        }
    }, [
        loadCustomerDataList,
        fetchTotalAmounts,
        refreshHomeScreenOnChangeDatabase,
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };

        fetchTotalOfAmountsBasedOnCurrency();
    }, [refresh, refreshHomeScreenOnChangeDatabase]);

    if (loading) {
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
        // Debounce search for better performance
        searchTimeoutRef.current = setTimeout(() => {
            setParentSearchTerm(searchTerm);
        }, 300);
    }, []);

    // Pull-to-refresh handler with haptic feedback
    const onRefresh = useCallback(() => {
        // Add haptic feedback if available
        if (global.HapticFeedback) {
            global.HapticFeedback.impact(
                global.HapticFeedback.ImpactFeedbackStyle.Light
            );
        }

        loadCustomerDataList(true);
        fetchTotalAmounts();
        global.lastDataFetch = Date.now();
    }, [loadCustomerDataList, fetchTotalAmounts]);

    // Enhanced retry handler
    const handleRetry = useCallback(() => {
        setError(null);
        loadCustomerDataList();
        fetchTotalAmounts();
    }, [loadCustomerDataList, fetchTotalAmounts]);

    // Optimized render functions
    const renderCustomerItem = useCallback(
        (item, index, isSearch = false) => (
            <Animated.View
                key={isSearch ? `search-${item.id}` : `customer-${item.id}`}
                entering={FadeInDown.delay(index * 30)} // Reduced delay for faster animation
            >
                <CustomerListTemplate
                    index={index}
                    username={item.username}
                    usernameShortCut={
                        item.username?.substring(0, 2).toUpperCase() || "AS"
                    }
                    totalAmount={item.amount}
                    style={styles.item}
                    transaction_type={item.transaction_type}
                    currency={item.currency}
                    at={item.at}
                    border_color={item.border_color}
                    email={item.email}
                    phone={item.phone}
                    isSearchComponent={isSearch}
                    searchResultLength={
                        isSearch ? displayCustomers.length : undefined
                    }
                    customer_id={item.id}
                />
            </Animated.View>
        ),
        [displayCustomers.length, styles.item]
    );

    // Loading state with better UX
    if (loading && !refreshing && isInitialLoad) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    } else if (error) {
        return (
            <View style={style.errorContainer}>
                <RetryComponent
                    setError={setError}
                    setRefresh={setRefresh}
                    errorMessage={error?.message || "Failed to fetch data"}
                />
            </View>
        );
    }

    return (
        <Animated.View style={style.container} entering={FadeIn.duration(500)}>
            {
                customer.length !== 0
                &&
                <CarouselOfTracker
                    totalExpenseOfCustomer={totalExpenseOfCustomer}
                />
            }
            <Animated.View
                style={{ marginTop: 50 }}
                entering={FadeInDown.delay(200)}
            >
                {customer.length ? (
                    <SearchCustomers
                        style={style.item}
                        handleSearch={handleSearch}
                        setCustomers={setCustomers}
                        customersToConvert={customer}
                    />
                ) : null}
            </Animated.View>

            <View style={{ flex: 1 }}>
                <ScrollView indicatorStyle="black" style={style.scroll_view}>
                    {customer.length ? (
                        parentSearchTerm ? (
                            filteredCustomers.length ? (
                                filteredCustomers.map((item, index) => (
                                    <Animated.View
                                        key={item.id}
                                        entering={FadeInDown.delay(index * 100)}
                                    >
                                        <CustomerListTemplate
                                            username={item.username}
                                            usernameShortCut={"AS"}
                                            totalAmount={item.amount}
                                            style={style.item}
                                            transaction_type={
                                                item.transaction_type
                                            }
                                            currency={item.currency}
                                            at={item.at}
                                            border_color={item.border_color}
                                            email={item.email}
                                            phone={item.phone}
                                            isSearchComponent={true}
                                            searchResultLength={
                                                filteredCustomers.length
                                            }
                                        />
                                    </Animated.View>
                                ))
            {/* Customer List */}
            <View style={styles.listContainer}>
                <ScrollView
                    indicatorStyle="black"
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#007AFF"]}
                            tintColor="#007AFF"
                            title="Pull to refresh"
                            titleColor="#007AFF"
                        />
                    }
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                >
                    {customers.length > 0 ? (
                        parentSearchTerm ? (
                            displayCustomers.length > 0 ? (
                                displayCustomers.map((item, index) =>
                                    renderCustomerItem(item, index, true)
                                )
                            ) : (
                                <ZeroSearchResult />
                            )
                        ) : (
                            customer.map((item, index) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(index * 100)}
                                >
                                    <CustomerListTemplate
                                        index={index}
                                        username={item.username}
                                        usernameShortCut={"AS"}
                                        totalAmount={item.amount}
                                        style={style.item}
                                        transaction_type={item.transaction_type}
                                        currency={item.currency}
                                        at={item.at}
                                        border_color={item.border_color}
                                        email={item.email}
                                        phone={item.phone}
                                        isSearchComponent={false}
                                        customer_id={item.id}
                                    />
                                </Animated.View>
                            ))
                            customers.map((item, index) =>
                                renderCustomerItem(item, index, false)
                            )
                        )
                    ) : (
                        <NoUserAddedInfo />
                    )}
                </ScrollView>
            </View>
            {!parentSearchTerm.length && (
                <Animated.View entering={FadeInDown.delay(300)}>
                    <AddNewCustomer />
                </Animated.View>
            )}
        </Animated.View>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: "column",
        rowGap: 10,
        backgroundColor: "white",
        height: "100%",
        fontFamily: "Roboto",
        width: "100%",
    },
    item: {
        flex: 1,
        marginHorizontal: 10,
        fontFamily: "Roboto",
    },
    scroll_view: {
        paddingHorizontal: 4,
    },
    slide: {
        flex: 1,
        justifyContent: "start",
        alignItems: "start",
        backgroundColor: "white",
        height: "auto",
        width: "85%",
    },
    spinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
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
});
