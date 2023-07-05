// import {View, Text, TouchableOpacity} from 'react-native';
// import React from 'react';
// import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
// import Auth from '@react-native-firebase/auth';

// const Home = ({route}) => {
//   // console.log(route);
//   const {firstName, lastName, phoneNumber, email} = route.params;
//   const {navigate, dispatch} = useNavigation();
//   return (
//     <View>
//       {/* <Text>Email: {Auth().currentUser?.email}</Text>
//       <Text>UID: {Auth().currentUser?.uid}</Text> */}
//       <TouchableOpacity
//         onPress={() => {
//           Auth().signOut;
//           dispatch(StackActions.replace('Login'));
//         }}>
//         <Text>LOGOUT</Text>
//         <Text>{firstName}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Home;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import fonts from '../../assets/fonts';

const Home = ({route}) => {
  const [userData, setUserData] = useState(null);
  const {dispatch} = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

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
    setLoading(false);
  };

  const phoneVerification = () => {
    dispatch(StackActions.replace('MobileVerification'));
  };

  const handleLogout = () => {
    Auth().signOut();
    dispatch(StackActions.replace('Login'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Welcome Home {userData?.firstName}
        </Text>

        <TouchableOpacity
          onPress={() => {
            dispatch(StackActions.replace('UpdateProfile'));
          }}>
          <Image
            source={require('../../assets/images/edit.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        {/* <View style={styles.infoContainer}></View> */}
      </View>

      <View style={styles.content}>
        {userData?.imageUpload ? (
          <Image
            source={{uri: userData?.imageUpload}}
            style={{width: 200, height: 220, marginBottom: 20}}></Image>
        ) : null}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={styles.value}>{userData?.firstName}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Name:</Text>
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={styles.value}>{userData?.lastName}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={styles.value}>{userData?.phoneNumber}</Text>
          )}
          {/* <TouchableOpacity onPress={phoneVerification}>
            <Text style={[styles.value, {color: 'red', fontSize: 10}]}>
              Verify phone
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={styles.value}>{userData?.email}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    // fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.BOLDITALIC,
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
    fontSize: 18,
    // fontWeight: 'bold',
    marginRight: 10,
    color: '#2c3e50',
    fontFamily: fonts.BOLD,
  },
  value: {
    fontSize: 18,
    color: '#444444',
    fontFamily: fonts.MEDIUM,
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
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.BOLD,
  },
});

export default Home;
