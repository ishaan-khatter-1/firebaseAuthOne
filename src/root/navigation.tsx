import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../components/splashScreen';
import Login from '../components/login';
import SignUp from '../components/signUp';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="CommonPage" component={CommonPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
