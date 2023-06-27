import {Alert, View} from 'react-native';
import React, {useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';

import CommonPage from '../commonPage';
import {StackActions, useNavigation} from '@react-navigation/native';

const Login = () => {
  const values = ['Email', 'Enter Password'];
  const keybrdValues = ['email-address', 'default'];
  const secureTextValues = [false, true];
  const passRef = useRef();
  const dummyRef = useRef();

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

  const validation = () => {
    // let emailValidation = validationFunctionEmail();
    // let passwordValidation = validationFunctionPassword();
    console.log(email);
    if (email === '') {
      Alert.alert('Email field cannot be empty.');
      return null;
    } else if (!emailRex.test(email)) {
      Alert.alert('Entry valid input in the form of example@xyz.xyz');
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
    if (emailRex.test(email) && passRex.test(password)) {
      // Alert.alert('Login Successful.');

      auth()
        // .signInAnonymously()
        .signInWithEmailAndPassword(email, password)
        .then(async userCredentials => {
          console.log('User signed in.' + userCredentials.user);
          // navigate('Home', {
          //   userData: {
          //     email: userCredentials.user.email,
          //     uid: userCredentials.user.uid,
          //   },
          // });
          if (userCredentials.user.emailVerified) {
            dispatch(StackActions.replace('Home'));
          } else {
            Alert.alert('Please Verify through email');
            await auth().currentUser?.sendEmailVerification();
            await auth().signOut();
          }
          // dispatch(StackActions.replace('Home'));
        })
        .catch(error => {
          if (error.code === 'auth/operation-not-allowed') {
            console.log('Enable anonymous in your firebase console.');
          }

          console.error(error);
        });
      return 1;
    }
  };

  // const opacityCh = () => {
  //   if (passRex.test(password) && emailRex.test(email)) {
  //     setOpacityBtn(1);
  //   } else {
  //     setOpacityBtn(0.4);
  //   }
  // };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgb(49, 26, 93)',
        paddingTop: '5%',
      }}>
      <CommonPage
        headerText={'Login'}
        inputVal={values}
        btnText={'Login'}
        orText={'New User?'}
        btnNav={'SignUp'}
        inputkeybrdValues={keybrdValues}
        secureVal={secureTextValues}
        validate={() => validation()}
        onupdatetext={(index, val) => {
          if (index === 0) {
            setEmail(val);
          } else if (index === 1) {
            setPassword(val);
          }
          // opacityCh();
        }}
        onsubmitvalues={submitRefArr}
        passRefVal={refArr} // passRefVal={passRef}
        blurOnSubmitVal={blurOnSubmitValues}
        returnKeyTypeVal={returnKeyTypeValues}
        // opacity={opacityBtn}
      />
    </View>
  );
};

export default Login;
