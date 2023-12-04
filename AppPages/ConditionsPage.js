import { useState } from "react";
import { View, Text, Button, Modal, Switch, Dimensions } from "react-native";
import { Con } from "../styles";
import { apiCall } from "../functions";
import { useSelector } from "react-redux";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';



export function ConditionsScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const conditionid = route.params.con.conditionid;
    const [rlId, setrlId] = useState((route.params.con.requiredlocationid) ? route.params.con.requiredlocationid : 'NaN');
    const [starttime, setStarttime] = useState((route.params.con.starttime) ? route.params.con.starttime : 'NaN');
    const [endtime, setEndtime] = useState((route.params.con.endtime) ? route.params.con.endtime : 'NaN');
    const locList = route.params.locList;
    const dependentlocationid = route.params.con.dependentlocation;
    const depLoc = locList.find(obj => obj.locationid === dependentlocationid).name;
    const [rlName, setrlName] = useState((rlId !== 'NaN') ? locList.find(obj => obj.locationid === rlId).name : 'NaN');
    const [delCon, setDelCon] = useState(false);
    const [err, setErr] = useState('');
    const [updating, setUpdating] = useState(false);
    const [addingTime, setAddingTime] = useState(false);
    const [chosenLoc, setChosenLoc] = useState('');
    const [chosenStart, setChosenStart] = useState(new Date());
    const [chosenEnd, setChosenEnd] = useState(new Date());


    const toggleAddingTime = () => setAddingTime(!addingTime);
    
    const changeChosenStart = (event, selectedDate) => setChosenStart(selectedDate);

    const changeChosenEnd = (event, selectedDate) => setChosenEnd(selectedDate);


    return (
        <View style={Con.container}>
            <View style={Con.header}>
                {(rlId !== 'NaN') &&
                    <Text>{rlName + ' unlocks ' + depLoc}</Text>
                }
                {(rlId === 'NaN') &&
                    <Text>{'(' + starttime + " - " + endtime + ') unlocks ' + locList.find(obj => obj.locationid === dependentlocationid).name}</Text>
                }
            </View>

            <View style={Con.main}>
                <View style={{padding: 10}}>
                    <Text style={{textAlign: 'center'}}>RequiredLocation: {rlName}</Text>
                    <Text style={{textAlign: 'center'}}>Start Time: {starttime}</Text>
                    <Text style={{textAlign: 'center'}}>End Time: {endtime}</Text>
                </View>

                <Button title="Update Conditions" onPress={() => {setUpdating(true)}}/>

                <Modal visible={updating}>
                    <View style={Con.modal}>
                        <View style={{borderColor: 'black', borderWidth: 2, width: Dimensions.get('window').width * .6}}>
                            <Text style={{textAlign:"center", padding: 10}}>New Condition: </Text>
                            <View>
                                <Text style={{alignSelf: 'center'}}>{'\<--Location   Time--\>'}</Text>
                                <Switch style={{alignSelf: 'center'}} value={addingTime} onValueChange={toggleAddingTime}/>
                            </View>

                            {!addingTime &&
                                <View>
                                    <Text style={{textAlign: 'center'}}>Required Location:</Text>
                                    <Picker selectedValue={chosenLoc} onValueChange={(itemValue, itemIndex) => setChosenLoc(itemValue)}>
                                        <Picker.Item key={0} label='' value=''/>
                                        {locList
                                            .filter(location => (location.locationid !== dependentlocationid && location.locationid !== rlId))
                                            .map((location, index) => (
                                            <Picker.Item key={index+1} label={location.name} value={location.locationid} />
                                        ))}
                                    </Picker>
                                    <View style={{flexDirection:'row', alignSelf:'center', }}>
                                        <Button title='Cancel' onPress={() => setUpdating(false)}/>
                                        <Button title='Update' onPress={async () => {
                                            if (chosenLoc != '') {
                                                await apiCall('updateCondition.php', {conditionid: conditionid, token:token, requiredlocationid: chosenLoc, starttime:null, endtime:null});
                                            }
                                            setUpdating(false);
                                            setrlId(chosenLoc);
                                            setrlName(locList.find(obj => obj.locationid === chosenLoc).name);
                                            setStarttime("NaN");
                                            setEndtime("NaN");
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
                                        <Button title='Cancel' onPress={() => setUpdating(false)}/>
                                        <Button title='Add Condition' onPress={async () => {
                                            if (chosenStart > chosenEnd) {
                                                let start = chosenStart.getHours() + ':' + chosenStart.getMinutes() + ':00';
                                                let end = chosenEnd.getHours() + ':' + chosenEnd.getMinutes() + ':00';
                                                await apiCall('updateCondition.php', {conditionid: conditionid, token:token, starttime: start, endtime: end, requiredlocationid: null});
                                                setUpdating(false);
                                                setrlId("NaN");
                                                setrlName("NaN");
                                                setStarttime(start);
                                                setEndtime(end);
                                            }
                                        }}/>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </Modal>
            </View>

            <View style={Con.footer}>
                <Text style={{color: 'red'}}>{err}</Text>
                {!delCon &&
                    <View>
                        <Button title='Delete Condition' onPress={() =>{
                            setDelCon(true);
                        }}/>
                    </View>
                }
                {delCon &&
                    <View >
                        <Text style={{fontWeight: 'bold'}}>Are you sure you want to delete this condition?</Text>

                        <Button title='Yes' onPress={async () => {
                            const result = await apiCall('deleteCondition.php', {conditionid: conditionid, token: token});
                            if (result.status == "okay") {
                                navigation.goBack();
                            }
                            else {
                                setErr(result.error);
                                setDelCon(false);
                            }
                        }}/>

                        <Button title='No' onPress={() => {
                            setDelCon(false);
                        }}/>

                    </View>
                }
                {/* Back & Home Buttons */}
                <View style={[{flexDirection: 'row', alignSelf:'center'}]}>
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
)};