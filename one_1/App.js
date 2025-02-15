import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ScrollViews from './components/ScrollView';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FlatListData from './components/FlatListData';
import SectionListData from './components/SectionListData';
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      
      <NavigationContainer>
        <Stack.Navigator>
          
          <Stack.Screen
            name="homepage"
            component={ScrollViews}
            options={{title: "homepage"}}
          />
          
          <Stack.Screen
            name="List"
            component={FlatListData}
            options={{title: "Flat List Data"}}
          />

          <Stack.Screen
            name="Section"
            component={SectionListData}
            options={{title: "Section list data"}}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </>
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
