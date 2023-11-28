import { Button, Text, TextInput, View, FlatList, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { useSelector } from 'react-redux';
import { apiCall } from '../functions';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Hunt } from '../styles';
import { FontAwesome } from '@expo/vector-icons';


export function HuntDetailScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const [huntName, setHuntName] = useState(route.params.hunt.name);
    const [huntid, setHuntId] = useState(route.params.hunt.huntid);
    const [active, setActive] = useState(route.params.hunt.active);
    const [newName, setNewName] = useState('');
    const [deleteHunt, setDeleteHunt] = useState(true);
    const [nameChange, setNameChange] = useState(false);
    const [locations, setLocations] = useState([]);
    const [locationName, setLocationName] = useState('');

    useFocusEffect(useCallback(() => {
        const getLocations = async () => {
            const result = await apiCall('getHuntLocations.php', {token: token, huntid: huntid});
            if (result) {
                if (result.locations) {
                    setLocations(result.locations);
                }
                else {
                    console.log("error: failed to recieve hunts properly (returned: " + result.error);
                }
            }
        };
        getLocations();
    },[locations]));

    const location = ({item}) => {
        const {name} = item;
        return (
            <View style={Hunt.location}>
                <Text>{name}</Text>
                <Button title='Details' onPress={() => {
                    navigation.navigate('Location', {loc: item, locPerm: route.params.locPerm, locList: locations});
                }}/>
            </View>
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={Hunt.container}>
                {/* Header Content (Active & Name) */}
                <View style={Hunt.header}>
                    <Text style={Hunt.HuntName}>{huntName}</Text>

                    {!nameChange && 
                        <Text style ={{fontWeight: 'bold'}} onPress={() => setNameChange(true)}>Change Hunt Name</Text>
                    }
                    {nameChange &&
                        <View style={{padding: 20, borderColor: 'black', borderWidth: 1,}}>
                            <Text style={{fontWeight: 'bold'}}>Change Hunt Name:</Text>
                            <TextInput
                            placeholder='New Hunt Name'
                            inputMode='text'
                            value={newName}
                            style={Hunt.inputField}
                            onChangeText={text => setNewName(text)}
                            />
                            <View>
                                <Button title='Submit' onPress={async () => {
                                    await apiCall('updateHunt.php', {name: newName, huntid: huntid, token: token});
                                    setHuntName(newName);
                                    setNewName('');
                                    setNameChange(!nameChange);
                                }}/>
                                <Button title='Back' onPress={async () => {
                                    setNameChange(!nameChange);
                                }}/>
                            </View>
                        </View>
                    }
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <FontAwesome style={{}} name="circle" size={24} color={(active == 1) ? "green" : "red"} />
                        <Button title="Toggle Active" onPress={() => {
                            apiCall('updateHunt.php', {huntid: huntid, token: token, name: huntName, active: ((active == 1) ? 0: 1)});
                            setActive((active == 1) ? 0 : 1);
                        }}/>
                    </View>
                </View>
                
                <View style={Hunt.main}>

                    <View style={{ width: '150%', alignSelf:'center', padding: 10}}>
                        <Text style={{fontWeight: 'bold', textAlign:"center"}}>Hunt Locations:</Text>
                            <FlatList
                                data= {locations}
                                renderItem={ location }
                                keyExtractor={ (item, index) => index }
                                style={{borderColor: 'black', borderWidth: 2, width: 'auto'}}
                            />
                    </View>

                    <View >
                        <Text style={{fontWeight: 'bold'}}>Add New Hunt Location:</Text>
                        <TextInput
                        placeholder='Location Name'
                        inputMode='text'
                        value={locationName}
                        style={Hunt.inputField}
                        onChangeText={text => setLocationName(text)}
                        />

                        <View style={{padding: 10}}>
                            <Button title='Add Location' onPress={ async () => {
                                if (locationName != '') {
                                    await apiCall('addHuntLocation.php', {token: token, name: locationName, huntid: huntid});
                                    setLocationName('');
                                    setLocations( await apiCall('getHuntLocations.php', {token: token, huntid: huntid}).locations);
                                }
                                else {
                                    alert('Please enter a name for the location.');
                                }
                            }}/>
                        </View>
                    </View>
                </View>



                <View style={Hunt.footer}>
                    {deleteHunt &&
                        <View>
                            <Button title='Delete Hunt' onPress={() =>{
                                setDeleteHunt(false);
                            }}/>
                        </View>
                    }
                    {!deleteHunt &&
                        <View>
                            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Are you sure you want to delete this hunt?</Text>

                            <Button title='Yes' onPress={async () => {
                                await apiCall('deleteHunt.php', {huntid: huntid, token: token});
                                navigation.goBack();
                            }}/>

                            <Button title='No' onPress={() => {
                                setDeleteHunt(true);
                            }}/>

                        </View>
                    }
                    <View style={[{flexDirection: 'row'}, Hunt.container]}>
                        <Button title='Back' onPress={() =>{
                            navigation.goBack();
                        }}/>
                        <Button title='Home' onPress={() =>{
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Scavenger Hunt' }],
                                })
                        }}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};
