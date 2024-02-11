import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen';

const StackNavigator = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: true,
          contentStyle: {
            marginHorizontal: 20,
            margin: 5
          }
        }}
      >
        <StackNavigator.Screen
          name={"homescreen"}
          component={HomeScreen}
          options={{title: "Home"}}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
