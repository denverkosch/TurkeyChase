import { Button, TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { register, login } from './registerLogin';


export function AutheticateScreen({navigation}) {
    const [existing, toggleExisting] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [err, setErr] = useState(' ');
    
    return (
        <View>
            {!existing &&
            <View>
                <Text>Register New Account</Text>
                <Text>Username:</Text>
                <TextInput
                placeholder='Enter Username'
                inputMode='text'
                value={username}
                onChangeText={text => setUsername(text)}
                />

                <Text>Password:</Text>
                <TextInput
                placeholder='Enter Password'
                inputMode='text'
                value={password}
                onChangeText={text => setPassword(text)}
                />

                <TextInput
                placeholder='Re-enter Password'
                inputMode='text'
                value={password2}
                onChangeText={text => setPassword2(text)}
                />

                <Text>{err}</Text>

                <Button title='Submit' onPress={() => {
                    if (password === password2 && password !== '') {
                        register(username, password)
                    }
                    else {
                        () => {setErr("Passwords do not match")};
                    }
                }}/>
                <Button title='Have an Account? Login' onPress={() => {
                    toggleExisting(true);
                    setPassword('');
                    setPassword2('');
                    setUsername('');
                    }}/>
            </View>
            }

            {existing &&
            <View>
                <Text>Login to Existing Account</Text>
                <Text>Username:</Text>
                <TextInput
                placeholder='Enter Username'
                inputMode='text'
                value={username}
                onChangeText={text => setUsername(text)}
                />

                <Text>Password:</Text>
                <TextInput
                placeholder='Enter Password'
                inputMode='text'
                value={password}
                onChangeText={text => setPassword(text)}
                />
                <Button title='Submit' onPress={() => {
                    login(username, password)
                    
                }}/>
                <Button title='New User? Register' onPress={() => {
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