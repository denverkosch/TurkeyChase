import { Button, TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { register, login } from '../functions';
import { useDispatch } from 'react-redux';
import { setToken, } from '../slices';
import { Auth } from '../styles';


export function AutheticateScreen({navigation}) {
    const [existing, toggleExisting] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [err, setErr] = useState(' ');
    const dispatch = useDispatch();
    
    // easy login
        // un: dkApp
        // pw: scavengerhunt


    return (
        <View style={Auth.container} >
            {!existing &&
            <View style={Auth.container}>
                <Text>Register New Account</Text>
                <Text>Username:</Text>
                <TextInput
                placeholder='Enter Username'
                inputMode='text'
                value={username}
                style={Auth.inputfield}
                onChangeText={text => setUsername(text)}
                />

                <Text>Password:</Text>
                <TextInput
                placeholder='Enter Password'
                inputMode='text'
                value={password}
                style={Auth.inputfield}
                onChangeText={text => setPassword(text)}
                />

                <TextInput
                placeholder='Re-enter Password'
                inputMode='text'
                value={password2}
                style={Auth.inputfield}
                onChangeText={text => setPassword2(text)}
                />

                <Text>{err}</Text>

                <Button style={Auth.button} title='Submit' onPress = { async () => {
                    console.log('username (line 47): ' + username);
                    console.log('password: ' + password);
                    console.log('password: ' + password2);
                    
                    //Check for empty fields/matching passwords

                    if (password == password2 && password != '' && username != '') {
                        console.log("time to register!");
                        let result = await register(username, password);
                        console.log("completed registration function");

                        //Check for successful return
                        if ('token' in result) {
                            console.log(result.token);
                            dispatch(setToken(result.token));
                            navigation.replace('Scavenger Hunt');
                        } else {
                            console.log('error: ' + result.error);
                            setErr("Registration Failed: " + result.error);
                        }

                    }
                    else {
                        //Check that password is properly validating
                        console.log(password + ' !== ' + password2 + ': ' + (password!==password2));
                        setErr((password !== password2) ? "Passwords do not match" : "Missing Username or password");
                        console.log("changed error");
                    }
                    console.log(err);
                }}/>

                <Button title='Have an Account? Login' onPress={() => {
                    toggleExisting(true);
                    setErr('');
                    setPassword('');
                    setPassword2('');
                    setUsername('');
                }}
                />
            </View>
            }

            {existing &&
            <View style={Auth.container}>
                <Text>Login to Existing Account</Text>
                <Text>Username:</Text>
                <TextInput
                style={Auth.inputfield}
                placeholder='Enter Username'
                inputMode='text'
                value={username}
                onChangeText={text => setUsername(text)}
                />

                <Text>Password:</Text>
                <TextInput
                style={Auth.inputfield}
                placeholder='Enter Password'
                inputMode='text'
                value={password}
                onChangeText={text => setPassword(text)}
                />

                <Text>{err}</Text>

                <Button title='Submit' onPress={ async () => {
                    if (username != '' && password != '') {
                        const result = await login(username, password);

                        //Check for successful return
                        if ('token' in result) {
                            dispatch(setToken(result.token));
                            navigation.replace('Scavenger Hunt');
                        } else {
                            setErr("Failed to log in");
                        }
                    }
                    else setErr('Please enter a username and password');
                }}/>

                <Button title='New User? Register' onPress={() => {
                    setErr('');
                    toggleExisting(false)
                    setPassword('');
                    setPassword2('');
                    setUsername('');
                }}/>
            </View>
            }


        </View>
    );
}
