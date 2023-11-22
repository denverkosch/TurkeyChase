import { Button, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { apiCall } from '../registerLogin';
import { useState } from 'react';
import { Hunt } from '../styles';


export function HuntDetailScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const [huntName, setHuntName] = useState(route.params.name);
    const [huntid, setHuntId] = useState(route.params.huntid);
    const [newName, setNewName] = useState('');
    const [deleteHunt, setDeleteHunt] = useState(true);

    return (
        <View style={Hunt.container}>
            <Text style={Hunt.HuntName}>{huntName}</Text>

            <View style={{padding: 20}}>
                <Text style={{fontWeight: 'bold'}}>Change Hunt Name:</Text>
                <TextInput
                placeholder='New Hunt Name'
                inputMode='text'
                value={newName}
                style={Hunt.inputField}
                onChangeText={text => setNewName(text)}
                />
                <Button title='Submit' onPress={async () => {
                    await apiCall('updateHunt.php', {name: newName, huntid: huntid, token: token});
                    setHuntName(newName);
                    setNewName('');
                }}/>
            </View>

            {deleteHunt &&
                <View>
                    <Button title='Delete Hunt' onPress={() =>{
                        setDeleteHunt(false);
                    }}/>
                </View>
            }
            {!deleteHunt &&
                <View>
                    <Text style={{fontWeight: 'bold'}}>Are you sure you want to delete this hunt?</Text>

                    <Button title='Yes' onPress={async () => {
                        await apiCall('deleteHunt.php', {huntid: huntid, token: token});
                        navigation.replace('Scavenger Hunt');
                    }}/>

                    <Button title='No' onPress={() => {
                        setDeleteHunt(true);
                    }}/>

                </View>
            }

            <Button title='Back' onPress={() => navigation.replace('Scavenger Hunt')}/>
        </View>
    )
};