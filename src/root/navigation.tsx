import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../components/splashScreen';
import Login from '../components/login';
import SignUp from '../components/signUp';
import Home from '../components/home';
import UpdateProfile from '../components/updateProfile';
import MobileVerification from '../components/MobileVerification';

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
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen
          name="MobileVerification"
          component={MobileVerification}
        />

        {/* <Stack.Screen name="CommonPage" component={CommonPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
