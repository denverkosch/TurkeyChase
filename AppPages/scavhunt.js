import { Button, FlatList, Text, TextInput, TouchableWithoutFeedback, View, Keyboard } from 'react-native';
import { ScavHunt } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../slices';
import { apiCall } from '../registerLogin';
import { useEffect, useState } from 'react';


export function ScavHuntScreen({navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const dispatch = useDispatch();
    const [huntName, setHuntName] = useState('');
    const [huntList, setHuntList] = useState([]);
    
    useEffect(() => {
        const getList = async () => {
            const result = await apiCall('getMyHunts.php', {token: token});
            if (result) {
                if (result.hunts) {
                setHuntList(result.hunts);
                }
                else {
                    console.log("error: failed to recieve hunts properly (returned: " + result.error);
                }
            }
        };
        getList();
    }, [token]);

    const hunt = (item) => {
        const {huntid, name} = item.item;
        return (
            <View style={ScavHunt.huntObj}>
                <Text>{name}</Text>
                <Button title='Details' onPress={() => {
                    navigation.replace('Hunt Details', {huntid: huntid, name: name});
                }}/>
            </View>
        )
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={ScavHunt.container}>

                <Text style={{fontWeight: 'bold'}}>Add Scavenger Hunt:</Text>
                <TextInput
                placeholder='Hunt Name'
                inputMode='text'
                value={huntName}
                style={ScavHunt.inputField}
                onChangeText={text => setHuntName(text)}
                />

                <View style={{padding: 10}}>
                    <Button title='Add Hunt' onPress={ async () => {
                        if (huntName != '') {
                            await apiCall('addHunt.php', {token: token, name: huntName});
                            setHuntList((await apiCall('getMyHunts.php', {token: token})).hunts);
                        }
                        else {
                            alert('Please enter a name for the hunt.');
                        }
                    }}/>
                </View>


                <View style={{padding: 10}}></View>

                <Text style={{fontWeight: 'bold'}}>Scavenger Hunts You Own:</Text>

                <FlatList
                    data= {huntList}
                    renderItem={ (item) => hunt(item, dispatch)}
                    keyExtractor={ (item, index) => index }
                    style={{borderColor: 'black', borderWidth: 2, width: 'auto'}}
                />

                <View style={{padding: 20}}></View>

                <Button title="Log Out" onPress={() =>{
                    dispatch(clearAll());
                    navigation.reset({
                    index: 0,
                    routes: [{ name: 'Register/Log-In' }],
                    })
                }}/>
            </View>
        </TouchableWithoutFeedback>
    )
}