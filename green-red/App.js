import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen';
import Toast from 'react-native-toast-message';
import AddNewCustomer from './components/global/AddNewCustomerButton';
import AddUser from './screens/AddUser';
import SingleCustomerView from './screens/SingleCustomerView';
import EditCustomerParent from './screens/EditCustomerParent';
import { AppContextProvider } from './context/useAppContext';
const StackNavigator = createNativeStackNavigator()
import { Feather } from '@expo/vector-icons';
import ByMeACoffe from './components/Stripe/ByMeACoffe';
export default function App() {

  return (
    <AppContextProvider>

      <NavigationContainer>
        <StackNavigator.Navigator
          screenOptions={{
            headerShown: true,
            contentStyle: {
              marginHorizontal: 20,
              margin: 5,
              fontSize: 20
              
            },
            headerRight: () => <ByMeACoffe />
            
          }}
        >
          <StackNavigator.Screen
            name={"homescreen"}
            component={HomeScreen}
            options={{
              title: "Home",
              headerStyle: {
                backgroundColor: "white",
                
              },
              headerTitleStyle: {
                fontSize: 25,
              }
            }}
          />

          <StackNavigator.Screen
            name={"Add Customer"}
            component={AddUser}
            options={{
              title: "Add Customer", 
              headerTitleStyle: {
              fontSize: 25,
              }
            }}
          />

          <StackNavigator.Screen
            name={"CustomerData"}
            component={SingleCustomerView}
            options={{title: "Customer Data"}}
          />
          <StackNavigator.Screen
            name={"EditCustomer"}
            component={EditCustomerParent}
            options={{title: "Edit Custome Data"}}
          />
        </StackNavigator.Navigator>
        <Toast />
      </NavigationContainer>
    </AppContextProvider>
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
