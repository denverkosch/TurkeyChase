import { SplashScreen } from './initialScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './store';
import { ActivityIndicator } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { AutheticateScreen } from './authenticate';
import { ScavHuntScreen } from './scavhunt';

const persistor= persistStore(store)
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store ={store}>
      <PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={SplashScreen} options={{title: 'Splash', headerShown: false}}/>
            <Stack.Screen name="Register/Log-In" component={AutheticateScreen} options={{title: 'Register/Log-In'}}/>
            <Stack.Screen name="Scavenger Hunt" component={ScavHuntScreen} options={{title: 'TurkeyChase'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
