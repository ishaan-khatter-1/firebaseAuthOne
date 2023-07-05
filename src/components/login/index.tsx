import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CommonPage from '../commonPage';
import {StackActions, useNavigation} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import CommonInput from '../commonInput';
import {CountryPicker, PhoneNumberInput} from 'react-native-phone-number-input';
import * as RNLocalize from 'react-native-localize';

const Login = () => {
  const values = ['Email', 'Enter Password'];
  const keybrdValues = ['email-address', 'default'];
  const secureTextValues = [false, true];
  const passRef = useRef();
  const dummyRef = useRef();

  const [loading, setLoading] = useState(false);
  // const passRefValues = [passRef];
  // const onsubmiteditingvalues = [passRef.current?.focus()];

  //
  // useStates
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const [opacityBtn, setOpacityBtn] = useState(0.4);

  // const [input, setInput] = useState('');
  // const;
  const refArr = [dummyRef, passRef];
  const submitRefArr = [() => passRef.current.focus()];
  const blurOnSubmitValues = [false, true];
  const {navigate, dispatch} = useNavigation();

  const returnKeyTypeValues = ['next', 'done'];
  const emailRex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validation = async () => {
    // let emailValidation = validationFunctionEmail();
    // let passwordValidation = validationFunctionPassword();
    console.log(email);
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
        text: 'Incorrect password',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
    setLoading(true);

    if (emailRex.test(email) && passRex.test(password)) {
      // Alert.alert('Login Successful.');
      try {
        const userCredentials = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        // console.log(userCredentials.user);
        const usersCollection = await firestore()
          .collection('users')
          .doc(userCredentials.user.uid)
          .get();
        // console.log(usersCollection.data);
        // const userData = usersCollection.data();
        if (userCredentials.user.emailVerified) {
          dispatch(StackActions.replace('Home', usersCollection.data()));
        } else {
          // Alert.alert('Please Verify through email');
          setLoading(false);

          Snackbar.show({
            text: 'Please Verify through email',
            duration: Snackbar.LENGTH_SHORT,
          });
          await auth().currentUser?.sendEmailVerification();
          await auth().signOut();
        }
        // dispatch(StackActions.replace('Home'));
      } catch (error) {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      }
      return 1;
    }
    setLoading(false);
  };

  // const opacityCh = () => {
  //   if (passRex.test(password) && emailRex.test(email)) {
  //     setOpacityBtn(1);
  //   } else {
  //     setOpacityBtn(0.4);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Login</Text>
      <View style={{width: '100%'}}>
        <CommonInput
          plcHolder={'Email'}
          keybrdType={'email-address'}
          secureText={false}
          // opacityBtn={undefined}
          onUpdateText={val => {
            setEmail(val);
          }}
          onSubmitEditting={() => passRef.current.focus()}
          // passRef={emailRef}
          blurOnSubmitOne={false}
          returnKeyTypeFirst={'next'}
        />

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
      </View>

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
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <TouchableOpacity onPress={() => navigate('SignUp')}>
        <Text style={styles.signInText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(49, 26, 93)',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgb(211,204,224)',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#333333',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgb(158,140,255)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    marginBottom: 16,
  },
});

// import {Alert, View, TouchableOpacity, Text} from 'react-native';
// import React, {useRef, useState} from 'react';
// import auth, {firebase} from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// import CommonPage from '../commonPage';
// import {StackActions, useNavigation} from '@react-navigation/native';
// import Snackbar from 'react-native-snackbar';

// const Login = () => {
//   const values = ['Email', 'Enter Password'];
//   const keybrdValues = ['email-address', 'default'];
//   const secureTextValues = [false, true];
//   const passRef = useRef();
//   const dummyRef = useRef();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loginMethod, setLoginMethod] = useState('email');
//   const [verificationId, setVerificationId] = useState('');
//   const refArr = [dummyRef, passRef];
//   const submitRefArr = [() => passRef.current.focus()];
//   const blurOnSubmitValues = [false, true];
//   const {navigate, dispatch} = useNavigation();

//   const returnKeyTypeValues = ['next', 'done'];
//   const emailRex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   const passRex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   const phoneRegex = /^\d{10}$/;

//   const validation = async () => {
//     if (loginMethod === 'email') {
//       if (email === '') {
//         Snackbar.show({
//           text: 'Email field cannot be empty.',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       } else if (!emailRex.test(email)) {
//         Snackbar.show({
//           text: 'Enter valid input in the form of example@xyz.xyz',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       }

//       if (password === '') {
//         Snackbar.show({
//           text: 'Password cannot be empty',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       } else if (!passRex.test(password)) {
//         Snackbar.show({
//           text: 'Password must contain at least 8 characters with 1 number, 1 uppercase letter, and 1 special character',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       }

//       try {
//         const userCredentials = await auth().signInWithEmailAndPassword(
//           email,
//           password,
//         );
//         const usersCollection = await firestore()
//           .collection('users')
//           .doc(userCredentials.user.uid)
//           .get();

//         if (userCredentials.user.emailVerified) {
//           dispatch(StackActions.replace('Home', usersCollection.data()));
//         } else {
//           Snackbar.show({
//             text: 'Please Verify through email',
//             duration: Snackbar.LENGTH_SHORT,
//           });
//           await auth().currentUser?.sendEmailVerification();
//           await auth().signOut();
//         }
//       } catch (error) {
//         if (error.code === 'auth/operation-not-allowed') {
//           console.log('Enable anonymous in your firebase console.');
//         }
//         console.error(error);
//       }
//     } else if (loginMethod === 'phone') {
//       if (phoneNumber === '') {
//         Snackbar.show({
//           text: 'Phone number field cannot be empty.',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       }

//       if (phoneNumber === '') {
//         // Alert.alert('Phone number cannot be empty');
//         Snackbar.show({
//           text: 'Phone number cannot be empty',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       } else if (!phoneRegex.test(phoneNumber)) {
//         // Alert.alert('wrong phone number');
//         Snackbar.show({
//           text: 'wrong phone number',
//           duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//       }

//       const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//       setVerificationId(confirmation.verificationId); // Store the verification ID

//       // Prompt the user to enter the OTP
//       // You can navigate to a new screen with an input field to enter the OTP and handle verification there
//       // For simplicity, let's display an alert with the OTP
//       Alert.alert('OTP Sent', 'Please enter the OTP received.');

//       // try {
//       //   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//       //   const credential = firebase.auth.PhoneAuthProvider.credential(
//       //     confirmation.verificationId,
//       //     verificationCode,
//       //   );
//       //   await auth().signInWithCredential(credential);
//       // } catch (error) {
//       //   console.log(error);
//       // }
//     }
//   };

//   const handleLoginMethodChange = method => {
//     setLoginMethod(method);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: 'rgb(49, 26, 93)',
//         paddingTop: '5%',
//       }}>
//       <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//         <TouchableOpacity
//           onPress={() => handleLoginMethodChange('email')}
//           style={{
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderBottomWidth: 2,
//             borderBottomColor:
//               loginMethod === 'email' ? 'white' : 'transparent',
//           }}>
//           <Text style={{color: 'white'}}>Email/Password</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => handleLoginMethodChange('phone')}
//           style={{
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderBottomWidth: 2,
//             borderBottomColor:
//               loginMethod === 'phone' ? 'white' : 'transparent',
//           }}>
//           <Text style={{color: 'white'}}>Phone Number</Text>
//         </TouchableOpacity>
//       </View>
//       {loginMethod === 'email' ? (
//         <CommonPage
//           headerText={'Login'}
//           inputVal={values}
//           btnText={'Login'}
//           orText={'New User?'}
//           btnNav={'SignUp'}
//           inputkeybrdValues={keybrdValues}
//           secureVal={secureTextValues}
//           validate={() => validation()}
//           onupdatetext={(index, val) => {
//             if (index === 0) {
//               setEmail(val);
//             } else if (index === 1) {
//               setPassword(val);
//             }
//           }}
//           onsubmitvalues={submitRefArr}
//           passRefVal={refArr}
//           blurOnSubmitVal={blurOnSubmitValues}
//           returnKeyTypeVal={returnKeyTypeValues}
//         />
//       ) : (
//         <CommonPage
//           headerText={'Login'}
//           inputVal={['Phone Number', 'Enter OTP']}
//           btnText={'Login'}
//           orText={'New User?'}
//           btnNav={'SignUp'}
//           inputkeybrdValues={['phone-pad']}
//           validate={() => validation()}
//           onupdatetext={(index, val) => setPhoneNumber(val)}
//           onsubmitvalues={submitRefArr}
//           passRefVal={refArr}
//           blurOnSubmitVal={blurOnSubmitValues}
//           returnKeyTypeVal={returnKeyTypeValues}
//           secureVal={[false]}
//         />
//       )}
//     </View>
//   );
// };

// export default Login;
