
import React, { useRef, useState, useCallback, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import TotalExpenses from "../Home/TotalExpenses";
import { Dimensions, StyleSheet, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Text } from "react-native";

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

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    carouselContainer: {
        height: 250,
        marginTop: 10
    },
    playPauseButton: {

        borderRadius: 18,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        padding: 6,
        
    },
    pageIndicator: {
        backgroundColor: "rgba(0,0,0,0.7)", // Enhanced opacity
        paddingHorizontal: 10, // Slightly more padding
        paddingVertical: 5,
        borderRadius: 12,
    },
    pageIndicatorText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600", // Enhanced font weight
    },
    nextButton: {
        backgroundColor: '#F8F8F8',
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
                        <Feather name="arrow-left" size={20} color="#333333" />
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
                            <Feather name="play" size={20} color="#333333" />
                        ) : (
                            <Feather name="pause" size={20} color="#333333" />
                        )}
                    </TouchableOpacity>
                )}

                {/* Next */}
                {totalCount > 1 && (
                    <TouchableOpacity
                        onPress={goNext}
                        style={[styles.nextButton, hideCarousel && { display: "none" }]}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Feather name="arrow-right" size={20} color="#333333" />
                    </TouchableOpacity>
                )}

                {/* Hide / Unhide */}
                <TouchableOpacity
                    onPress={() => setHideCarousel((h) => !h)}
                    style={styles.hideunhideButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {hideCarousel ? (
                        <Feather name="eye-off" size={20} color="#333333" />
                    ) : (
                        <Feather name="eye" size={20} color="#333333" />
                    )}
                </TouchableOpacity>
            </View>
                            <Pause color="#333333" size={20} />

                        )}
                    />
                </View>
            )}

        </View>
    );
}
