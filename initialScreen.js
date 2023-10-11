import { Button, Image, Text, View } from 'react-native';
import { Splash } from './styles';


export function SplashScreen({navigation}) {
    
    const verifyToken = () => {
        return fetch('https://cpsc345sh.jayshaffstall.com/verifyToken.php')
    };

    return (
        <View style={Splash.container}>
            <Image style ={{width:'100%', height:"40%"}} source={require('./tmp.jpg')}/>
            <Button title='Carry On' onPress={() => navigation.replace("Register/Log-In")}/>
        </View>
    )
}