import {StyleSheet} from 'react-native';
import ColorConstants from '../../assets/colorContants';
import fonts from '../../assets/fonts';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: ColorConstants.mainBg,
    paddingTop: 20,
  },
  headerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    // backgroundColor: 'red',
  },
  headerText: {
    // fontWeight: '700',
    fontSize: 25,
    color: ColorConstants.headerText,
    fontFamily: fonts.BOLDITALIC,
  },
  inputCardView: {
    flex: 1,
    // backgroundColor: 'yellow',
    alignItems: 'center',
  },
  inputView: {
    marginTop: 20,
    paddingVertical: 10,
    // backgroundColor: 'green',
    // backgroundColor: 'rgb(92, 71, 214)',

    width: '80%',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  lgnBtn: {
    margin: 5,
    backgroundColor: ColorConstants.lgnBtnColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    fontFamily: fonts.REGULAR,
  },
  lgnText: {
    // fontWeight: '700',
    fontSize: 20,
    color: ColorConstants.lgnText,
    fontFamily: fonts.BOLD,
  },
  opacity: {},
});
export default styles;
