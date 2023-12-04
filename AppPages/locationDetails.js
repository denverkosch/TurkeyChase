import { View, Text, Button, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Switch, Modal } from "react-native";
import { Loc } from "../styles";
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../functions";
import { useSelector } from "react-redux";
import * as Location from 'expo-location';
import { useFocusEffect } from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export function LocationScreen({ route, navigation }) {
    const token = useSelector((state) => state.userInfo.token);
    const locationid = route.params.loc.locationid;
    const [name, setName] = useState(route.params.loc.name);
    const [clue, setClue] = useState(route.params.loc.clue);
    const [desc, setDesc] = useState(route.params.loc.description);
    const [lat, setLat] = useState(route.params.loc.latitude);
    const [long, setLong] = useState(route.params.loc.longitude);
    const [locPerm, setLocPerm] = useState(route.params.locPerm);
    const [delLoc, setDelLoc] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newClue, setNewClue] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [conditions, setConditions] = useState([]);
    const locList = route.params.locList;
    const [addingCon, setAddingCon] = useState(false);
    const [addingTime, setAddingTime] = useState(false);
    const [chosenLoc, setChosenLoc] = useState('');
    const [chosenStart, setChosenStart] = useState(new Date());
    const [chosenEnd, setChosenEnd] = useState(new Date());

    useFocusEffect(useCallback(() => {
        const requestLocationAccess = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            setLocPerm(true);
        };
        if (!locPerm) requestLocationAccess();


        const getConditions = async () => {
            const result = await apiCall('getConditions.php', {token: token, locationid: locationid});
            if (result) {
                if (result.conditions) {
                    setConditions(result.conditions);
                }
                else {
                    console.log("error: failed to recieve conditions properly (returned: " + result.error);
                }
            }
        };
        getConditions();
    }, []));

    const refreshCon = async () => {
        const result = await apiCall('getConditions.php', { token: token, locationid: locationid });
        if (result) {
          if (result.conditions) {
            setConditions(result.conditions);
          } else {
            console.log("error: failed to receive conditions properly (returned: " + result.error);
          }
        }
    };
    
    const isRequiredLoc = async () => {
        const results = await Promise.all(
            locList.map(async element => {
                let result = await apiCall('getConditions.php', {token: token, locationid: element.locationid});
                if (result && result.conditions) {
                    let locCons = result.conditions;
                    if (locCons.length != 0) {
                        let locConList = locCons.map(obj => obj.requiredlocationid);
                        return locConList.includes(locationid);
                    }
                }
                else console.log("error: failed to recieve conditions properly (returned: " + result.error);
            })
            )
        return results.some(result => result);
    };

    const getLoc = async () => {
        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
        return ({latitude: location.coords.latitude.toFixed(6), longitude: location.coords.longitude.toFixed(6)});
    };

    const handleUpdateLoc = async () => {
        let loc = await getLoc();
        setLat(loc.latitude);
        setLong(loc.longitude);
        await apiCall('updateHuntLocationPosition.php', {token: token, locationid: locationid, latitude: loc.latitude, longitude: loc.longitude});
    };

    const toggleAddingTime = () => setAddingTime(!addingTime);
    
    const changeChosenStart = (event, selectedDate) => setChosenStart(selectedDate);

    const changeChosenEnd = (event, selectedDate) => setChosenEnd(selectedDate);

    const condition = ({item}) => {
        const condition = {conditionid: item.conditionid, dependentlocation:locationid, starttime: item.starttime, endtime: item.endtime, requiredlocationid: item.requiredlocationid};
        let dep = (condition.requiredlocationid) ? (locList.find(obj => obj.locationid === item.requiredlocationid).name) : (condition.starttime + ' - ' + condition.endtime);
        return (
            <View style={Loc.Condition}>
                <Text>{dep}</Text>
                <Button title='Details' onPress={() => {
                    navigation.navigate('Conditions', {con: condition, locList:locList});
                }}/>
            </View>
        )
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style = {Loc.container}>
                <View style={Loc.header}>
                    <Text style={Loc.LocName}>{name}</Text>
                </View>

                <View style={Loc.main}>
                    <View>
                        <Text style={{textAlign: 'center'}}>Clue: {clue}</Text>
                        <Text style={{textAlign: 'center'}}>Description: {desc}</Text>
                        <Text style={{textAlign: 'center'}}>Latitude: {(lat != undefined) ? lat : ''}</Text>
                        <Text style={{textAlign: 'center'}}>Longitude: {(long != undefined) ? long : ''}</Text>
                    {!editing && <Button title="Edit Location" onPress={() => setEditing(true)}/>}
                    {editing &&
                        <View>
                            <TextInput style={Loc.inputField} placeholder='New Name' value={newName} onChangeText={text => setNewName(text)} />
                            <TextInput style={Loc.inputField} placeholder='New Clue' value={newClue} onChangeText={text => setNewClue(text)} />
                            <TextInput style={Loc.inputField} placeholder='New Description' value={newDesc} multiline={true} onChangeText={text => setNewDesc(text)} numberOfLines={3}/>
                            <Button title='Save Changes' onPress={async () => {
                                let i = {};
                                if (newName != '' || newClue != '' || newDesc != '') {
                                    i.name = (newName == '') ? name : newName;
                                    i.clue = (newClue == '') ? clue : newClue;
                                    i.description = (newDesc == '') ? desc : newDesc;
                                    i.token = token;
                                    i.locationid = locationid;
                                } else alert("Please enter new Values");
                                
                                let result = await apiCall('updateHuntLocation.php', i);
                                if (result.status != 'okay') {
                                    alert(result.error);
                                    return;
                                }
                                setClue(newClue);
                                setDesc(newDesc);
                                setName(newName);
                                setNewClue('');
                                setNewDesc('');
                                setNewName('');
                                setEditing(false);
                                
                            }}/>
                            <Button title='Cancel Changes' onPress={() => setEditing(false)}/>
                        </View>
                    }
                    </View>

                    <View style={{padding: 10, borderColor: 'black', borderWidth: 2}}>
                        <Text style={Loc.posText}>Press to Update this Location's Position:</Text>
                        <Button title='Click Here' onPress={() => {
                            handleUpdateLoc();
                        }}/>
                    </View>
                    <View style={{padding: 5}}>
                        <Text style={{textAlign: 'center'}}>Click Here to View {'\n'}Location on Map:</Text>
                        <Button title="Open Map" onPress={() => {
                            navigation.navigate('LocationMap', {loc: route.params.loc, locList: locList});
                        }}/>
                    </View>


                    <View >
                        <Text style={{textAlign:'center'}}>Conditions:</Text>
                        <View style={{ width: '105%', display: 'flex', alignSelf: 'center'}}>
                            <FlatList
                                data= {conditions}
                                renderItem={ condition }
                                keyExtractor={ (item, index) => index }
                                style={{borderColor: 'black', borderWidth: 2, width: 'auto'}}
                            />
                        </View>
                        
                        <Button title="Add Condition" onPress={() => {
                            setAddingCon(true);
                        }}/>
                        
                        <Modal visible={addingCon}>
                            <View style={[{width: '105%'}, Loc.container]}>
                                <View style={{borderColor: 'black', borderWidth: 2, }}>
                                    <Text style={{textAlign:"center", padding: 10}}>New Condition: </Text>
                                    <View>
                                        <Text style={{alignSelf: 'center'}}>{'\<'}--Location  Time--{'\>'}</Text>
                                        <Switch style={{alignSelf: 'center'}} value={addingTime} onValueChange={toggleAddingTime}/>
                                    </View>

                                    {!addingTime &&
                                        <View>
                                            <Text style={{textAlign: 'center'}}>Required Location:</Text>
                                            <Picker selectedValue={chosenLoc} onValueChange={(itemValue, itemIndex) => setChosenLoc(itemValue)}>
                                                <Picker.Item key={0} label='' value=''/>
                                                {locList
                                                    .filter(location => location.locationid !== locationid)
                                                    .map((location, index) => (
                                                    <Picker.Item key={index+1} label={location.name} value={location.locationid} />
                                                ))}
                                            </Picker>
                                            <View style={{flexDirection:'row', alignSelf:'center', }}>
                                                <Button title='Cancel' onPress={() => setAddingCon(false)}/>
                                                <Button title='Add Condition' onPress={async () => {
                                                    if (chosenLoc != '') {
                                                        await apiCall('addCondition.php', {locationid: locationid, token:token, requiredlocationid: chosenLoc});
                                                    }
                                                    setAddingCon(false);
                                                    refreshCon();
                                                }}/>
                                            </View>
                                        </View>
                                    }
                                    {addingTime &&
                                        <View>
                                            <View style={{flexDirection: 'row', paddingBottom: 10, alignSelf:'center'}}>
                                                <Text>Start Time:</Text>
                                                <DateTimePicker mode='time' value={chosenStart} onChange={changeChosenStart}/>
                                            </View>

                                            <View style={{flexDirection: 'row', alignSelf:'center'}}>
                                                <Text>End Time:</Text>
                                                <DateTimePicker mode='time' value={chosenEnd} onChange={changeChosenEnd}/>
                                            </View>
                                            
                                            <View style={{flexDirection:'row', alignSelf:'center', }}>
                                                <Button title='Cancel' onPress={() => setAddingCon(false)}/>
                                                <Button title='Add Condition' onPress={async () => {
                                                    if (chosenStart > chosenEnd) {
                                                        let start = chosenStart.getHours() + ':' + chosenStart.getMinutes() + ':00';
                                                        let end = chosenEnd.getHours() + ':' + chosenEnd.getMinutes() + ':00';
                                                        await apiCall('addCondition.php', {locationid: locationid, token:token, starttime: start, endtime: end});
                                                        setAddingCon(false);
                                                        refreshCon();
                                                    }
                                                }}/>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </Modal>
                    </View>


                </View>

                <View style={Loc.footer}>
                    {!delLoc &&
                        <View>
                            <Button title='Delete Location' onPress={() =>{
                                setDelLoc(true);
                            }}/>
                        </View>
                    }
                    {delLoc &&
                        <View style={Loc.container}>
                            <Text style={{fontWeight: 'bold'}}>Are you sure you want to delete this location?</Text>
                            <Text style={{fontWeight: 'bold', color: 'red', textAlign: 'center'}}>WARNING: Ensure that there are no conditions which require this Location</Text>

                            <Button title='Yes' onPress={async () => {
                                if (await isRequiredLoc()) {
                                    alert('Location Required for a Condition (Cannot Delete)');
                                    setDelLoc(false);
                                    return;
                                }
                                const result = await apiCall('deleteHuntLocation.php', {locationid: locationid, token: token});
                                if (result.status == "okay") {
                                    navigation.goBack();
                                }
                                else {
                                    alert(result.error);
                                    setDelLoc(false);
                                }
                            }}/>

                            <Button title='No' onPress={() => {
                                setDelLoc(false);
                            }}/>

                        </View>
                    }
                    {/* Back & Home Buttons */}
                    <View style={[{flexDirection: 'row'}, Loc.container]}>
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
}
