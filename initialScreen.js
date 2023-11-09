import { Button, Image, Text, View } from 'react-native';
import { Splash } from './styles';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';



export function SplashScreen({navigation}) {
    
    const token = useSelector((state) => state.token);
    const [verified, setVerified] = useState(false);

    const verifyToken = async () => {
        const body = new FormData;
        body.append('token', token);

        const result = await fetch('https://cpsc345sh.jayshaffstall.com/verifyToken.php', {method: "POST", body: body});

        if (result.ok) {
            const data = await result.json();
            return {userid: data.userid};
        }

        else {return {error: result.error};}
    };

    useEffect(() => {
        const fetchData = async () => {
          if (token === '') {
            return;
          }
            const result = await verifyToken(token);
    
            if ('userid' in result) {
              setVerified(true);
            } else {
              console.log(result.error);
            }
    
        // Call the fetchData function
        fetchData();
    }});

    return (
        <View style={Splash.container}>
            <Image style ={{width:'100%', height:"40%"}} source={require('./tmp.jpg')}/>
            
            {/* If not verified go to registerLogin */}
            {!verified &&
                navigation.replace("Register/Log-In")
            }
            {/* If verified go to ScavHuntScreen */}
            {verified &&
                navigation.replace("TurkeyChase")
            }
        </View>
    )
}