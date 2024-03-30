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
import { EvilIcons, Feather } from '@expo/vector-icons';
import ByMeACoffe from './components/Stripe/ByMeACoffe';
import { Ionicons } from '@expo/vector-icons';
import * as SystemUI from 'expo-system-ui';
SystemUI.setBackgroundColorAsync("white");
import mobileAds, { AppOpenAd, InterstitialAd, RewardedAd, BannerAd, TestIds } from 'react-native-google-mobile-ads'
import AboutScreen from './components/about/About';

mobileAds()
  .initialize()
  .then(() => console.log('Ads initialized'))
  .catch(error => console.error(error));

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
            
            headerRight: () => <ByMeACoffe />,
          
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
                <Ionicons name="home-outline" size={24} color="black" />
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
                    <EvilIcons name="plus" size={24} color="black" />
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
                      <Feather name="database" size={24} color="black" />
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
                      <EvilIcons name="pencil" size={34} color="black" />
                      <Text>Edit customer</Text>
                  </View>
                )
              }
            }
          />
          <StackNavigator.Screen
            name={"about"}
            component={AboutScreen}
            options={
              {
                title: "About PayPair",
                headerTitle: () => (
                  <View style={{flexDirection: "row", flex: 1, justifyContent: "start", alignItems: "center", columnGap: 4}}>
                      <EvilIcons name="exclamation" size={34} color="black" />
                      <Text style={{fontWeight: "bold"}}>About PayPair</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
