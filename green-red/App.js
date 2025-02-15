import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen';
import Toast from 'react-native-toast-message';
import AddUser from './screens/AddUser';
import SingleCustomerView from './screens/SingleCustomerView';
import EditCustomerParent from './screens/EditCustomerParent';
import { AppContextProvider } from './context/useAppContext';
const StackNavigator = createNativeStackNavigator()
import * as SystemUI from 'expo-system-ui';
SystemUI.setBackgroundColorAsync("white");

import { Database, House, PenSquare, UserPlus } from 'lucide-react-native';

export default function App() {

  return (
    <AppContextProvider>
      
      <NavigationContainer >
        <StackNavigator.Navigator
          screenOptions={{
            headerShown: true,
            
            contentStyle: {
              marginHorizontal: 20,
              margin: 5,
              fontSize: 20
              
            },
          }}
        >
          <StackNavigator.Screen
            name={"homescreen"}
            component={HomeScreen}
            options={{
              headerStyle: {
                backgroundColor: "white",
                
              },
              headerTitleStyle: {
                fontSize: 25,
              },
              headerTitle: () => (
                <House size={24} color="black" />
              )
            }}
          />

          <StackNavigator.Screen
            name={"Add Customer"}
            component={AddUser}
            options={{
              title: "Add Customer", 
              headerTitleStyle: {
                fontSize: 25,
              },
              headerTitle: () => (
                <View style={{flexDirection: "row", flex: 1, justifyContent: "start", alignItems: "center", columnGap: 4}}>
                    <UserPlus color="black"/>
                    <Text>Add Customer</Text>
                </View>
              )
            }}
          />

          <StackNavigator.Screen
            name={"CustomerData"}
            component={SingleCustomerView}
            options={
              {
                title: "Customer Data",
                headerTitle: () => (
                  <View style={{flexDirection: "row", flex: 1, justifyContent: "start", alignItems: "center", columnGap: 4}}>
                      <Database name="database" size={24} color="black" />
                      <Text>Records</Text>
                  </View>
                )
              }
            }
          />
          <StackNavigator.Screen
            name={"EditCustomer"}
            component={EditCustomerParent}
            options={
              {
                title: "Customer Data",
                headerTitle: () => (
                  <View style={{flexDirection: "row", flex: 1, justifyContent: "start", alignItems: "center", columnGap: 4}}>
                      <PenSquare  color="black" />
                      <Text>Edit customer</Text>
                  </View>
                )
              }
            }
          />
          
        </StackNavigator.Navigator>
        <Toast />
      </NavigationContainer>
    </AppContextProvider>
  );
}
