import { SplashScreen } from './AppPages/initialScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './store';
import { ActivityIndicator } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { AutheticateScreen } from './AppPages/authenticate';
import { ScavHuntScreen } from './AppPages/scavhunt';
import { HuntDetailScreen } from './AppPages/huntDetails';
import { LocationScreen } from './AppPages/locationDetails';
import { ConditionsScreen } from './AppPages/ConditionsPage';
import { MapScreen } from './AppPages/MapScreen';
import { StartHuntScreen } from './AppPages/player/startHuntTbd';
import { ActiveHuntScreen } from './AppPages/player/activeHunt';
import { HuntLocationScreen } from './AppPages/player/huntLoc';


const persistor= persistStore(store)
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store ={store}>
      <PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={SplashScreen} options={{title: 'Splash', headerShown: false}}/>
            <Stack.Screen name="Scavenger Hunt" component={ScavHuntScreen} options={{title: 'TurkeyChase'}}/>
            <Stack.Screen name="Register/Log-In" component={AutheticateScreen} options={{title: 'Register/Log-In'}}/>
            <Stack.Screen name="Hunt Details" component={HuntDetailScreen} options={{title: 'Hunt Details'}}/>
            <Stack.Screen name="Location" component={LocationScreen} options={{title: 'Location Details'}}/>
            <Stack.Screen name="Conditions" component={ConditionsScreen} options={{title: 'Conditions'}}/>
            <Stack.Screen name="LocationMap" component={MapScreen} options={{title: 'Location on Map'}}/>
            <Stack.Screen name='StartHunt' component={StartHuntScreen} options={{title: 'Hunt Details'}}/>
            <Stack.Screen name="ActiveHunt" component={ActiveHuntScreen} option={{title: 'Hunt Details'}}/>
            <Stack.Screen name="AHLocation" component={HuntLocationScreen} option={{title: 'Location'}}/>
            
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
