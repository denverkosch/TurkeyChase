import { Button, Image, Text, View } from 'react-native';
import { Splash } from '../styles';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUserId } from '../slices';
import { apiCall } from '../functions';



export function SplashScreen({navigation}) {
    const token = useSelector((state) => state.userInfo.token);

    useEffect(() => {
        const verify = async () => {
          if (token == '') {
            navigation.replace('Register/Log-In');
          return;
          }
          const result = await apiCall('verifyToken.php', {token: token});

          if (result) {
            if (result.userid) {
              navigation.replace('Scavenger Hunt');
            }
            else {
              navigation.replace('Register/Log-In');
            }
          }
        };
        verify();
    });

    return (
        <View style={Splash.container}>
            <Image style ={{width:'100%'}} source={require('../IMG_0163.jpg')}/>
        </View>
    )
}