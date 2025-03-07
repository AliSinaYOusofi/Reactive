import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import TotalExpenses from '../Home/TotalExpenses';
import { Dimensions, StyleSheet, View } from 'react-native';

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: "100%",
        overflow: 'visible',
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    carouselContainer: {
        height: 80,
    },
});

export default function CarouselOfTracker({ totalExpenseOfCustomer }) {
    const width = Dimensions.get('window').width;

    return (
        <View style={style.container}>
            {totalExpenseOfCustomer.length > 0 && (
                <View style={style.carouselContainer}>
                    <Carousel
                        loop
                        width={width}
                        height={300} 
                        data={totalExpenseOfCustomer}
                        scrollAnimationDuration={3000}
                        autoPlay={totalExpenseOfCustomer.length > 1}
                        renderItem={({ item }) => (
                            <View style={style.slide}>
                                <TotalExpenses
                                    totalAmountToGive={item.totalAmountBasedOnCurrencyToGive}
                                    totalAmountToTake={item.totalAmountBasedOnCurrencyToTake}
                                    currency={item.currency}
                                />
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
