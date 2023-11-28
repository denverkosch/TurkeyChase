import { StyleSheet } from "react-native";


export const Splash = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent : 'center',
        display: 'flex',
        width: 'auto',
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
    flex: 1,
  },
  inputField: {
    alignContent: 'center',
    textAlign:'center',
    borderColor: 'black',
    borderWidth: 2,
    width: '100%',
  },
  HuntName: {
    fontSize: 26,
    textDecorationLine: 'underline',
    paddingTop:0,
  },
  header: {
    width: '100%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    position: 'absolute',
    top:0,
  },
  main:{
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  footer: {
    width: '100%',
    paddingTop:'10%',
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'absolute',
    bottom:20,
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});


export const Loc = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    width: '100%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    top:0
  },
  inputField: {
    alignContent: 'center',
    textAlign:'center',
    borderColor: 'black',
    borderWidth: 2,
    width: '100%',
  },
  main:{
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  LocName: {
    fontSize: 26,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    paddingTop:0,
  },
  posText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  Condition: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export const Con = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    width: '100%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    top:0
  },
  main: {
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export const Map = StyleSheet.create({
  container: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    width: '100%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    top:0
  },
  main: {
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    display:'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
});