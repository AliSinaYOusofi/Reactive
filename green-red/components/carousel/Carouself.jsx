import React, { useRef, useState, useCallback, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import TotalExpenses from "../Home/TotalExpenses";
import { Dimensions, StyleSheet, View } from "react-native";
import { Play, Pause, ArrowRight, ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, Text } from "react-native";
import { Eye, EyeClosed } from "lucide-react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: "100%",
        overflow: "visible",
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    slide: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    carouselContainer: {
        height: 250,
    },
    playPauseButton: {
        backgroundColor: "black",
        padding: 8,
        borderRadius: 50,
        marginRight: 10,
        opacity: 0.9,
        // Enhanced styling
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        backgroundColor: "rgba(0,0,0,0.7)", // Enhanced color
        padding: 6, // Slightly more padding
        borderRadius: 50,
    },
    prevButton: {
        backgroundColor: "rgba(0,0,0,0.7)", // Enhanced color
        padding: 6, // Slightly more padding
        borderRadius: 50,
    },

    hideunhideButton: {
        backgroundColor: "black",
        padding: 8,
        borderRadius: 50,
        marginRight: 10,
        opacity: 0.9,
        // Enhanced styling
        alignSelf: "center",
    },

    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "90%",
        marginTop: 0
       
    },
});

export default function CarouselOfTracker({ totalExpenseOfCustomer }) {
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const totalCount = totalExpenseOfCustomer?.length || 0;
    const [hideCarousel, setHideCarousel] = useState(false);
    const width = Dimensions.get("window").width;

    // Handle carousel snap - this is the main fix for count display
    const handleSnapToItem = useCallback((index) => {
        console.log("Snapped to index:", index);
        setCurrentIndex(index);
    }, []);

    const goPrev = useCallback(() => {
        if (totalCount > 1 && carouselRef.current) {
            const newIndex =
                currentIndex === 0 ? totalCount - 1 : currentIndex - 1;
            console.log("Going to prev index:", newIndex);
            carouselRef.current.scrollTo({ index: newIndex, animated: true });
        }
    }, [currentIndex, totalCount]);

    const goNext = useCallback(() => {
        if (totalCount > 1 && carouselRef.current) {
            const newIndex =
                currentIndex === totalCount - 1 ? 0 : currentIndex + 1;
            console.log("Going to next index:", newIndex);
            carouselRef.current.scrollTo({ index: newIndex, animated: true });
        }
    }, [currentIndex, totalCount]);

    // Enhanced toggle with haptic feedback (if available)
    const togglePlayPause = useCallback(() => {
        setIsPaused((prev) => !prev);
    }, []);

    // Enhanced render item with better performance
    const renderItem = useCallback(
        ({ item, index }) => (
            <View style={styles.slide} key={`carousel-item-${index}`}>
                <TotalExpenses
                    totalAmountToGive={item.totalAmountBasedOnCurrencyToGive}
                    totalAmountToTake={item.totalAmountBasedOnCurrencyToTake}
                    currency={item.currency}
                />
            </View>
        ),
        []
    );

    // Don't render if no items
    if (totalCount === 0) return null;

    return (
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
                        parallaxScrollingScale: 0.95,
                        parallaxScrollingOffset: 20,
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
                        <ArrowLeft color="white" size={20} />
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
                            <Play color="white" size={20} />
                        ) : (
                            <Pause color="white" size={20} />
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
                        <ArrowRight color="white" size={20} />
                    </TouchableOpacity>
                )}

                {/* Hide / Unhide */}
                <TouchableOpacity
                    onPress={() => setHideCarousel((h) => !h)}
                    style={styles.hideunhideButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {hideCarousel ? (
                        <EyeClosed color="white" size={20} />
                    ) : (
                        <Eye color="white" size={20} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
