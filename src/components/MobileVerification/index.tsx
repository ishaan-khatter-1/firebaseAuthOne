import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
} from 'react-native';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MobileVerification = () => {
  const [userData, setUserData] = useState(null);
  const {dispatch} = useNavigation();
  const [mobileNo, setMobileNo] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [confirmData, setConfirmData] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userCurrent = Auth().currentUser;
      const userDoc = await firestore()
        .collection('users')
        .doc(userCurrent?.uid)
        .get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtp = async () => {
    try {
      const mobile = '+91' + userData?.phoneNumber;
      const response = await auth().signInWithPhoneNumber(mobile);
      setConfirmData(response);
      console.log(response);
      // alert('Otp Is Sent Please Verify It...');
    } catch (err) {
      console.log(err);
    }
  };

  const submitOtp = async () => {
    try {
      const response = await confirmData.confirm(otpInput);
      console.log(response);

      // alert('Your number is verified');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        style={{borderWidth: 1, width: '80%', marginBottom: 5}}
        placeholder="Enter Your Mobile Number"
        onChangeText={value => setMobileNo(value)}
      />
      <Button title="Send Otp" onPress={() => sendOtp()} />
      <TextInput
        style={{borderWidth: 1, width: '80%', marginBottom: 5, marginTop: 30}}
        placeholder="Enter Your OTP"
        onChangeText={value => setOtpInput(value)}
      />
      <Button title="Submit" onPress={() => submitOtp()} />
    </View>
  );
};

export default MobileVerification;
