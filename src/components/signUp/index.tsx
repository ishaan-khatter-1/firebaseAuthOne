import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CommonPage from '../commonPage';
import {useNavigation} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import CommonInput from '../commonInput';
import fonts from '../../assets/fonts';
import PhoneNumberInput from 'react-native-phone-number-input';
import * as RNLocalize from 'react-native-localize';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import styles from './styles';
import {request, PERMISSIONS} from 'react-native-permissions';
import storage from '@react-native-firebase/storage';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [imagePic, setImagePic] = useState({});
  const [imgUrl, setImgUrl] = useState(null);
  const refRBSheet = useRef();
  // const [opacityBtn, setOpacityBtn] = useState(0.4);

  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();
  const dummyRef = useRef();
  const {navigate} = useNavigation();

  useEffect(() => {
    const defaultCountryCode = RNLocalize.getCountry();
    setCountry(defaultCountryCode);
  }, []);

  const handleCountrySelect = country => {
    setCountry(country);
  };

  const handlePhoneNumberChange = text => {
    setFormattedText(text);
  };

  const emailRex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const firstNameRegex = /^[a-zA-Z]+$/;
  const lastNameRegex = /^[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
  const phoneRegex = /^\d{10}$/;
  const validation = async () => {
    // let emailValidation = validationFunctionEmail();
    // let passwordValidation = validationFunctionPassword();
    console.log(email);
    if (firstName === '') {
      // Alert.alert('first name cannot be empty');
      Snackbar.show({
        text: 'first name cannot be empty',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!firstNameRegex.test(firstName)) {
      // Alert.alert('wrong first name');
      Snackbar.show({
        text: 'wrong first name',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    if (lastName === '') {
      // Alert.alert('last name cannot be empty');
      Snackbar.show({
        text: 'last name cannot be empty',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!lastNameRegex.test(lastName)) {
      // Alert.alert('wrong last name');
      Snackbar.show({
        text: 'wrong last name',
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

    if (password === '') {
      // Alert.alert('Password cannot be empty');
      Snackbar.show({
        text: 'Password cannot be empty',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    } else if (!passRex.test(password)) {
      // Alert.alert(
      //   'Password must contain atleast 8 characters which must have at least 1 number, atleast 1 Uppercase letter, and atleast 1 special character.',
      // );
      Snackbar.show({
        text: 'password must contain atleast 8 characters, 1 number, 1 uppercase and lowercase letters, and 1 special character',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    if (confirmPass !== password) {
      // Alert.alert('Confirm password does not matches the password');
      Snackbar.show({
        text: 'Confirm password does not matches the password',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    setLoading(true);
    if (emailRex.test(email) && passRex.test(password)) {
      try {
        const res = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const usersData = {
          id: res.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          imageUpload: imgUrl,
        };
        await firestore().collection('users').doc(res.user.uid).set(usersData);
        // console.log('res:: ' + res);  // undefined
        // fires;
        // console.log('User account created & signed in!');
        // console.log(auth().currentUser);
        await auth().currentUser?.sendEmailVerification();
        // await auth().
        // await auth().currentUser?.
        // Alert.alert('Email verfication link sent');
        Snackbar.show({
          text: 'Email verfication link sent',
          duration: Snackbar.LENGTH_SHORT,
        });
        await auth().signOut();

        navigate('Login');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setLoading(false);

          Snackbar.show({
            text: 'Account already Exist',
            duration: Snackbar.LENGTH_SHORT,
          });
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          setLoading(false);

          Snackbar.show({
            text: 'Invalid Email',
            duration: Snackbar.LENGTH_SHORT,
          });
          console.log('That email address is invalid!');
        }

        console.error(error);
      }
      // Alert.alert('Successfully Registered');
      setLoading(false);

      return 1;
    }
  };
  // const opacityCh = () => {
  //   if (
  //     passRex.test(password) &&
  //     emailRex.test(email) &&
  //     phoneRegex &&
  //     lastNameRegex &&
  //     firstNameRegex &&
  //     password === confirmPass
  //   ) {
  //     setOpacityBtn(1);
  //   } else {
  //     setOpacityBtn(0.4);
  //   }
  // };
  const askForPermissions = permission => {
    request(permission).then(result => {
      console.log(result);
    });
  };
  // const galleryPicker = () => {
  //   askForPermissions(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(async image => {
  //     console.log(image.path);
  //     setImagePic(image.path);
  //     const reference = storage().ref(image.path);
  //     setImgUrls(reference.getDownloadURL());
  //   });
  // };

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
    <View style={{flex: 1, backgroundColor: 'rgb(49, 26, 93)'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>User Registration</Text>
        <View style={{width: '100%'}}>
          <CommonInput
            plcHolder={'First Name'}
            keybrdType={'default'}
            secureText={false}
            // opacityBtn={undefined}
            onUpdateText={val => {
              setfirstName(val);
            }}
            onSubmitEditting={() => lastNameRef.current.focus()}
            passRef={dummyRef}
            blurOnSubmitOne={false}
            returnKeyTypeFirst={'next'}
          />
          <CommonInput
            plcHolder={'Last Name'}
            keybrdType={'default'}
            secureText={false}
            // opacityBtn={undefined}
            onUpdateText={val => {
              setlastName(val);
            }}
            onSubmitEditting={() => emailRef.current.focus()}
            passRef={lastNameRef}
            blurOnSubmitOne={false}
            returnKeyTypeFirst={'next'}
          />
          <CommonInput
            plcHolder={'Email'}
            keybrdType={'email-address'}
            secureText={false}
            // opacityBtn={undefined}
            onUpdateText={val => {
              setEmail(val);
            }}
            // onSubmitEditting={() => phoneRef.current.focus()}
            onSubmitEditting={() => passRef.current.focus()}
            passRef={emailRef}
            blurOnSubmitOne={false}
            returnKeyTypeFirst={'next'}
          />
          {/* <CommonInput
          plcHolder={'Phone'}
          keybrdType={'numeric'}
          secureText={false}
          // opacityBtn={undefined}
          onUpdateText={val => {
            setphoneNumber(val);
          }}
          onSubmitEditting={() => passRef.current.focus()}
          passRef={phoneRef}
          blurOnSubmitOne={false}
          returnKeyTypeFirst={'next'}
        /> */}
          <PhoneNumberInput
            // style={{backgroundColor: 'red'}}
            defaultCode={country}
            placeholder="Phone Number"
            onChangeText={setphoneNumber}
            value={phoneNumber}
            containerStyle={styles.inputPhoneContainer}
            textContainerStyle={[styles.inputPhone, {borderRadius: 8}]}
            withShadow
            autoFocus
            layout="first"
            onChangeTextFormatted={text => setFormattedText(text)}
            onSelectCountry={handleCountrySelect}
          />
          {/* <CountryPicker
        withCallingCode
        withFilter
        withFlag
        withEmoji
        countryCode={country}
        onSelect={handleCountrySelect}
      />
      <PhoneNumberInput
        defaultCode={country}
        layout="first"
        withShadow
        autoFocus
        textContainerStyle={{ padding: 8 }}
        onChangeFormattedText={handlePhoneNumberChange}
      /> */}
          <CommonInput
            plcHolder={'Password'}
            keybrdType={'default'}
            secureText={true}
            // opacityBtn={undefined}
            onUpdateText={val => {
              setPassword(val);
            }}
            onSubmitEditting={() => confirmPassRef.current.focus()}
            passRef={passRef}
            blurOnSubmitOne={false}
            returnKeyTypeFirst={'next'}
          />
          <CommonInput
            plcHolder={'Confirm Password'}
            keybrdType={'default'}
            secureText={true}
            // opacityBtn={undefined}
            onUpdateText={val => {
              setconfirmPass(val);
            }}
            onSubmitEditting={() => {}}
            passRef={confirmPassRef}
            blurOnSubmitOne={true}
            returnKeyTypeFirst={'done'}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, {flexDirection: 'row'}]}
          // onPress={imagePicker}
          onPress={() => {
            refRBSheet.current.open();
          }}>
          <Image
            source={require('../../assets/images/camera.png')}
            style={{width: 30, height: 30, marginRight: 5}}></Image>
          <Text style={[styles.buttonText, {marginLeft: 5}]}>Add Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!loading) {
              validation();
            }
          }}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            backgroundColor: 'rgb(211,204,224)',
            elevation: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <BottomSheet />
      </RBSheet>
    </View>
  );
};

export default SignUp;
