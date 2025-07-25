import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import TotalExpenses from '../Home/TotalExpenses';
import { Dimensions, StyleSheet, View } from 'react-native';

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: "100%",
        overflow: 'visible',
        marginTop: 10,
        height: 'auto'
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
<<<<<<< HEAD
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
=======
        <View style={styles.container}>
            {/* Carousel */}
            <View
                style={[
                    styles.carouselContainer,
                    hideCarousel && { display: "none" },
                ]}
            >
                <Carousel
                    ref={carouselRef}
                    loop={totalCount > 1}
                    width={width}
                    height={280}
                    data={totalExpenseOfCustomer}
                    scrollAnimationDuration={600} // Slightly faster
                    onSnapToItem={handleSnapToItem} // Fixed callback
                    autoPlay={totalCount > 1 && !isPaused}
                    autoPlayInterval={3500} // Slightly longer interval
                    renderItem={renderItem}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 1.0,
                        parallaxScrollingOffset: 20.0,
                    }}
                    windowSize={3}
                    enabled={totalCount > 1}
                    // Additional performance props
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={3}
                />
            </View>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
                {/* Prev */}
                {totalCount > 1 && (
                    <TouchableOpacity
                        onPress={goPrev}
                        style={[styles.prevButton, hideCarousel && { display: "none" }]}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <ArrowLeft color="#333333" size={20} />
                    </TouchableOpacity>
                )}

                {/* Page Indicator */}
                {totalCount > 1 && (
                    <View style={[styles.pageIndicator, hideCarousel && { display: "none" }]}>
                        <Text style={[styles.pageIndicatorText]}>
                            {currentIndex + 1} / {totalCount}
                        </Text>
                    </View>
                )}

                {/* Play / Pause */}
                {totalCount > 1 && (
                    <TouchableOpacity
                        onPress={() => setIsPaused((p) => !p)}
                        style={[styles.playPauseButton, hideCarousel && { display: "none" }]}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {isPaused ? (
                            <Play color="#333333" size={20} />
                        ) : (
                            <Pause color="#333333" size={20} />
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3
                        )}
                    />
                </View>
            )}
        </View>
    );
}
