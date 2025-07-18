import React, { useState } from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  View, 
  TouchableOpacity 
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import TotalExpenses from '../Home/TotalExpenses';
import { Play, Pause } from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

export default function CarouselOfTracker({ totalExpenseOfCustomer }) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!totalExpenseOfCustomer.length) return null;

  return (
    <View style={styles.container}>
      {/* Play/Pause button */}
      {totalExpenseOfCustomer.length > 1 && (
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => setIsPaused(p => !p)}
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </TouchableOpacity>
      )}

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop={totalExpenseOfCustomer.length > 1}
          width={SCREEN_W}
          height={120}
          data={totalExpenseOfCustomer}
          autoPlay={totalExpenseOfCustomer.length > 1 && !isPaused}
          scrollAnimationDuration={800}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <TotalExpenses
                totalAmountToGive={item.totalAmountBasedOnCurrencyToGive}
                totalAmountToTake={item.totalAmountBasedOnCurrencyToTake}
                currency={item.currency}
              />
            </View>
          )}
        />
      </View>

      {/* Pagination dots */}
      {totalExpenseOfCustomer.length > 1 && (
        <View style={styles.dotsContainer}>
          {totalExpenseOfCustomer.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    overflow: 'visible',
    marginTop: 10,
    alignItems: 'center',
  },
  playPauseButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
  },
  carouselContainer: {
    height: 120,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_W,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#333',
    width: 12,
  },
});
