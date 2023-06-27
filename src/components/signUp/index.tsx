import {Alert, View} from 'react-native';
import React, {useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';

import CommonPage from '../commonPage';
import {useNavigation} from '@react-navigation/native';

const SignUp = () => {
  const values = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Password',
    'Confirm Password',
  ];
  const keybrdValues = ['default', 'default', 'email-address', 'numeric'];
  const secureTextValues = [false, false, false, false, true, true];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  // const [opacityBtn, setOpacityBtn] = useState(0.4);

  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();
  const dummyRef = useRef();
  const {navigate} = useNavigation();

  const refArr = [
    dummyRef,
    lastNameRef,
    emailRef,
    phoneRef,
    passRef,
    confirmPassRef,
  ];
  const submitRefArr = [
    () => lastNameRef.current.focus(),
    () => emailRef.current.focus(),
    () => phoneRef.current.focus(),
    () => passRef.current.focus(),
    () => confirmPassRef.current.focus(),
  ];
  const blurOnSubmitValues = [false, false, false, false, false, true];

  const returnKeyTypeValues = ['next', 'next', 'next', 'next', 'next', 'done'];

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
      Alert.alert('first name cannot be empty');
      return null;
    } else if (!firstNameRegex.test(firstName)) {
      Alert.alert('wrong first name');
      return null;
    }
    if (lastName === '') {
      Alert.alert('last name cannot be empty');
      return null;
    } else if (!lastNameRegex.test(lastName)) {
      Alert.alert('wrong last name');
      return null;
    }
    if (email === '') {
      Alert.alert('Email field cannot be empty.');
      return null;
    } else if (!emailRex.test(email)) {
      Alert.alert('Entry valid input in the form of example@xyz.xyz');
      return null;
    }
    if (phoneNumber === '') {
      Alert.alert('Phone number cannot be empty');
      return null;
    } else if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('wrong phone number');
      return null;
    }

    if (password === '') {
      Alert.alert('Password cannot be empty');
      return null;
    } else if (!passRex.test(password)) {
      Alert.alert(
        'Password must contain atleast 8 characters which must have at least 1 number, atleast 1 Uppercase letter, and atleast 1 special character.',
      );
      return null;
    }
    if (confirmPass !== password) {
      Alert.alert('Confirm password does not matches the password');
      return null;
    }
    if (emailRex.test(email) && passRex.test(password)) {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async () => {
          // const {email, uid} = userCredentials.user;
          // const userData = {
          //   email: email,
          //   uid: uid,
          // };
          console.log('User account created & signed in!');
          // console.log('HI' + userCredentials.user);
          console.log(auth().currentUser);
          await auth().currentUser?.sendEmailVerification();
          Alert.alert('Email verfication link sent');
          await auth().signOut();
          // if (auth().currentUser?.emailVerified) {
          //   navigate('Home');
          // }
          // else {
          //   await auth().signOut();
          // }

          // navigate('Home', {userData});
          navigate('Login');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
      // Alert.alert('Successfully Registered');
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

  return (
    <View style={{flex: 1}}>
      <CommonPage
        headerText={'New User Registration'}
        inputVal={values}
        btnText={'Register'}
        orText={'Already a User? Login.'}
        btnNav={'Login'}
        inputkeybrdValues={keybrdValues}
        secureVal={secureTextValues}
        validate={validation}
        onupdatetext={(index, val) => {
          if (index === 0) {
            setfirstName(val);
          } else if (index === 1) {
            setlastName(val);
          } else if (index === 2) {
            setEmail(val);
          } else if (index === 3) {
            setphoneNumber(val);
          } else if (index === 4) {
            setPassword(val);
          } else if (index === 5) {
            setconfirmPass(val);
          }
          // opacityCh();
        }}
        onsubmitvalues={submitRefArr}
        passRefVal={refArr}
        blurOnSubmitVal={blurOnSubmitValues}
        returnKeyTypeVal={returnKeyTypeValues}
        // opacity={opacityBtn}
      />
    </View>
  );
};

export default SignUp;
