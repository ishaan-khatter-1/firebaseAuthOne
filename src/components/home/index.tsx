import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';

const Home = () => {
  // console.log(props);
  // const route = useRoute();
  // console.log('HI' + route.params);
  // const userData = route.params?.userData;

  // console.log('userData' + userData);
  const {navigate, dispatch} = useNavigation();
  return (
    <View>
      <Text>Email: {Auth().currentUser?.email}</Text>
      <Text>UID: {Auth().currentUser?.uid}</Text>
      <TouchableOpacity
        onPress={() => {
          Auth().signOut;
          dispatch(StackActions.replace('Login'));
          // navigate('Login');
        }}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
