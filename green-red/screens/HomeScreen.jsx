import React, { useEffect, useState } from "react";
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

export default function HomeScreen({ navigator }) {
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
