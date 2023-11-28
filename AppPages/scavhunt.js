import { Button, FlatList, Text, TextInput, TouchableWithoutFeedback, View, Keyboard } from 'react-native';
import { ScavHunt } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../slices';
import { apiCall } from '../functions';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';


export function ScavHuntScreen({navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const dispatch = useDispatch();
    const [huntName, setHuntName] = useState('');
    const [huntList, setHuntList] = useState([]);
    const [locPerm, setLocPerm] = useState(false);
    
    useFocusEffect(useCallback(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return;
            setLocPerm(true);
        })();
        
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
    },[]));

    const hunt = (item) => {
        const {name, active} = item.item;
        return (
            <View style={ScavHunt.huntObj}>
                <FontAwesome name="circle" size={20} color={(active) ? "green" : "red"} />
                <Text> {name} </Text>
                <Button title='Details' onPress={() => {
                    navigation.navigate('Hunt Details', {hunt: item.item, locPerm: locPerm});
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
                            setHuntName('');
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
                    renderItem={ (item) => hunt(item)}
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