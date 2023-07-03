import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Alert,
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

const UpdateProfile = ({route}) => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const {dispatch} = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userCurrent = Auth().currentUser;
      const usersCollection = await firestore()
        .collection('users')
        .doc(userCurrent?.uid)
        .get();
      if (usersCollection.exists) {
        const data = usersCollection.data();
        setUserData(data);
        setFirstName(data?.firstName);
        setLastName(data?.lastName);
        setPhoneNumber(data?.phoneNumber);
        setEmail(data?.email);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    const emailRex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const firstNameRegex = /^[a-zA-Z]+$/;
    const lastNameRegex = /^[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
    const phoneRegex = /^\d{10}$/;
    if (firstName === '') {
      // Alert.alert('first name cannot be empty');
      Snackbar.show({
        text: 'first name field cannot be empty.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!firstNameRegex.test(firstName)) {
      // Alert.alert('wrong first name');
      Snackbar.show({
        text: 'Incorrect First Name',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    if (lastName === '') {
      // Alert.alert('last name cannot be empty');
      Snackbar.show({
        text: 'Last name cannot be empty',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!lastNameRegex.test(lastName)) {
      // Alert.alert('wrong last name');
      Snackbar.show({
        text: 'Incorrect Last Name',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    if (email === '') {
      // Alert.alert('Email field cannot be empty.');
      Snackbar.show({
        text: 'Email field cannot be empty.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!emailRex.test(email)) {
      // Alert.alert('Entry valid input in the form of example@xyz.xyz');
      Snackbar.show({
        text: 'Entry valid input in the form of example@xyz.xyz',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    if (phoneNumber === '') {
      // Alert.alert('Phone number cannot be empty');
      Snackbar.show({
        text: 'Phone number cannot be empty',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!phoneRegex.test(phoneNumber)) {
      // Alert.alert('wrong phone number');
      Snackbar.show({
        text: 'wrong phone number',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    try {
      const userCurrent = Auth().currentUser;
      await firestore().collection('users').doc(userCurrent?.uid).update({
        firstName,
        lastName,
        phoneNumber,
        email,
      });
      console.log('Profile updated successfully!');
      Snackbar.show({
        text: 'Profile updated successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            dispatch(StackActions.replace('Home'));
          }}>
          <Image
            source={require('../../assets/images/back.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>HI {userData?.firstName}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.value}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.value}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.value}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.value}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Button
          title="Update Profile"
          onPress={handleUpdateProfile}
          disabled={!firstName || !lastName || !phoneNumber || !email}
        />
        {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#2c3e50',
  },
  value: {
    fontSize: 16,
    color: '#444444',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    flex: 1,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 50,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UpdateProfile;
