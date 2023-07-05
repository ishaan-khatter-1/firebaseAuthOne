import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
// import styles from './styles';
import {request, PERMISSIONS} from 'react-native-permissions';
import storage from '@react-native-firebase/storage';

const UpdateProfile = ({route}) => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [imagePic, setImagePic] = useState({});
  const [imgUrl, setImgUrl] = useState(null);
  const refRBSheet = useRef();

  const {dispatch} = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  // const updateUserData = data => {
  //   setUserData(data);
  //   setFirstName(data?.firstName);
  //   setLastName(data?.lastName);
  //   setPhoneNumber(data?.phoneNumber);
  //   setEmail(data?.email);
  // };

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
        setImgUrl(data?.imageUpload);
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
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        imageUpload: imgUrl,
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

  const askForPermissions = permission => {
    request(permission).then(result => {
      console.log(result);
    });
  };

  const galleryPicker = () => {
    askForPermissions(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      console.log(image.path);
      setImagePic(image.path);

      const reference = storage().ref(`images/${image.filename}`);
      const task = reference.putFile(image.path);

      task.on(
        'state_changed',
        snapshot => {
          // Handle upload progress if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        error => {
          // Handle upload error
          console.log('Upload error:', error);
        },
        async () => {
          // Handle upload success
          const downloadURL = await reference.getDownloadURL();
          console.log('Download URL:', downloadURL);
          setImgUrl(downloadURL);
        },
      );
    });
  };

  const cameraPicker = () => {
    askForPermissions(PERMISSIONS.ANDROID.CAMERA);

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image.path);
      setImagePic(image.path);
      const reference = storage().ref(`images/${image.filename}`);
      const task = reference.putFile(image.path);

      task.on(
        'state_changed',
        snapshot => {
          // Handle upload progress if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        error => {
          // Handle upload error
          console.log('Upload error:', error);
        },
        async () => {
          // Handle upload success
          const downloadURL = await reference.getDownloadURL();
          console.log('Download URL:', downloadURL);
          setImgUrl(downloadURL);
        },
      );
    });
  };
  console.log('imgPath', imagePic);
  const BottomSheet = () => {
    // const refRBSheet = useRef();
    /// <reference path="" />

    return (
      <View style={styles.bottomSheet}>
        <TouchableOpacity style={styles.buttonTwo} onPress={galleryPicker}>
          <Text style={styles.buttonTextTwo}>Select from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonTwo} onPress={cameraPicker}>
          <Text style={styles.buttonTextTwo}>Choose from Camera</Text>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.headerText}>HI {firstName}</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          {imgUrl ? (
            <TouchableOpacity onPress={() => refRBSheet.current.open()}>
              <Image
                // source={{uri: userData?.imageUpload}}
                source={{uri: imgUrl}}
                style={{width: 200, height: 220, marginBottom: 20}}></Image>
            </TouchableOpacity>
          ) : null}
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
          {/* <BottomSheet /> */}
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: 'transparent',
                // opacity: 0.5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 100,
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
            }}>
            <BottomSheet />
          </RBSheet>
        </View>
      </ScrollView>
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
    // fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.BOLD,
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
    // fontWeight: 'bold',
    marginRight: 10,
    color: '#2c3e50',
    fontFamily: fonts.BOLD,
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
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.BOLD,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#2c3e50',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    // elevation: 6,
  },
  buttonTwo: {
    backgroundColor: '#f9f9f9',
    // backgroundColor: 'rgb(158,140,255)',

    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonTextTwo: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
});

export default UpdateProfile;
