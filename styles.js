import { StyleSheet } from "react-native";


export const Splash = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent : 'center',
        display: 'flex',
      },
});

export const Auth = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    maxWidth: window.innerWidth/2,
  },
  inputfield: {
    alignContent: 'center',
    textAlign:'center',
    borderColor: 'black',
    borderWidth: 2,

  },
});

export const ScavHunt = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  huntObj: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inputField: {
    alignContent: 'center',
    textAlign:'center',
    borderColor: 'black',
    borderWidth: 2,
  },
});

export const Hunt = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    alignContent: 'center',
    textAlign:'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  HuntName: {
    fontSize: 20,
  }
});