import { Button, Image, Text, View } from 'react-native';
import { Splash } from '../styles';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUserId } from '../slices';



export function SplashScreen({navigation}) {
    
    const token = useSelector((state) => state.userInfo.token);
    const verifyToken = async () => {
        const body = new FormData;
        body.append('token', token);

        const result = await fetch('https://cpsc345sh.jayshaffstall.com/verifyToken.php', {method: "POST", body: body});

        if (result.ok) {
            const data = await result.json();
            return {userid: data};
        }

        else {return {error: result};}
    };
    // Call the fetchData function
    const fetchData = async () => {
        if (token == '') {
          navigation.replace('Register/Log-In');
          return;
        }
          await verifyToken(token)
          .then (data => {
          if ('userid' in data) {
            setUserId(data.userid);
            navigation.replace('Scavenger Hunt');
          } else {
            console.log(data.error);
            navigation.replace('Register/Log-In');
          }
        });
    };

    useEffect(() => {
        fetchData();
    });

    return (
        <View style={Splash.container}>
            <Image style ={{width:'100%', height:"40%"}} source={require('../tmp.jpg')}/>
        </View>
    )
}