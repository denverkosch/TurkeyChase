import { Button, FlatList, Text, TextInput, TouchableWithoutFeedback, View, Keyboard, Modal } from 'react-native';
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
    const [activeHunts, setActiveHunts] = useState([]);
    const [searching, setSearching] = useState(false);
    const [filter, setFilter] = useState('');
    const [searchedHunts, setSearchedHunts] = useState([]);

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
    
    const getActives = async () => {
        const result = await apiCall('findActiveHunts.php', {token: token});
        if (result) {
            if (result.hunts) {
                setActiveHunts(result.hunts);
            }
            else {
                console.log("error: failed to recieve hunts properly (returned: " + result.error);
            }
        }
    }

    const searchHunts = async () => {
        const result = filter == '' ? (await apiCall('findHunts.php', {token: token})) : (await apiCall('findHunts.php', {token: token, filter: filter}));
        if (result) {
            if (result.hunts) {
                setSearchedHunts(result.hunts);
            }
            else {
                console.log("error: failed to recieve hunts properly (returned: " + result.error);
            }
        }
    }
    
    useFocusEffect(useCallback(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return;
            setLocPerm(true);
        })();
        
        
        getList();
        getActives();
        searchHunts();
    },[]));
    
    const hunt = ({item}) => {
        const {name, active} = item;
        return (
            <View style={ScavHunt.huntObj}>
                <FontAwesome name="circle" size={20} color={(active) ? "green" : "red"} />
                <Text> {name} </Text>
                <Button title='Details' onPress={() => {
                    navigation.navigate('Hunt Details', {hunt: item, locPerm: locPerm});
                }}/>
            </View>
        )
    }
    
    const activeHunt = ({item}) => {
        const {name, completed} = item;

        const ProgressBar = ({ completedPercentage }) => {
            return (
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20,}}>
                <View style={{ width: `${completedPercentage}%`, height: 20, backgroundColor: '#3498db', borderRadius: 10, overflow: 'hidden', }} />
              </View>
            );
          };          
    
        return (
            <View style={ScavHunt.huntObj}>
                <Text style={{textAlign:'center'}} onPress={() => navigation.navigate('ActiveHunt', {hunt: item, locPerm: locPerm})}> {name} ({completed}% Done)</Text>
                {/* Add Progress Bar here */}
                <ProgressBar completedPercentage={completed}/>
            </View>
        )
    };

    const searchedHunt = ({item}) => {
        const {name} = item;
        return (
            <View style={ScavHunt.huntObj}>
                <Text onPress={() => {
                    setSearching(false);
                    navigation.navigate('StartHunt', {hunt: item});
                }}> {name} </Text>
            </View>
        )
    };

    const completedHunt = ({item}) => {
        const {name} = item;
        return (
            <View style={ScavHunt.huntObj}>
                <Text onPress={() => navigation.navigate('ActiveHunt', {hunt: item, locPerm: locPerm})}> {name} </Text>
            </View>
        )
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={ScavHunt.container}>
                <View style={ScavHunt.header}>
                    <Text style={ScavHunt.welcome}>Welcome to TurkeyChase</Text>
                </View>

                <View style={ScavHunt.main}>

                    {/* Add Scavenger Hunt */}
                    <View>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Make New Scavenger Hunt:</Text>
                        <TextInput
                        placeholder='Hunt Name'
                        inputMode='text'
                        value={huntName}
                        style={ScavHunt.inputField}
                        onChangeText={text => setHuntName(text)}
                        />
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

                    {/* Owned Hunts */}
                    <View style={{maxHeight: '50%'}}>
                        <Text style={{fontWeight: 'bold', paddingTop: '10%', textAlign: 'center'}}>Scavenger Hunts You Own:</Text>
                        <FlatList
                            data= {huntList}
                            renderItem={ (item) => hunt(item)}
                            keyExtractor={ (item, index) => index }
                            style={{borderColor: 'black', borderWidth: 2, flexGrow: 0}}
                        />
                    </View>

                    {/* Active Hunts */}
                    <View style={{padding: 10, alignSelf:'center', maxHeight: '50%'}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Your Active Hunts:</Text>
                        <FlatList
                            data= {activeHunts.filter(hunt => hunt.completed != 100)}
                            renderItem={ (item) => activeHunt(item)}
                            keyExtractor={ (item, index) => index }
                            style={{borderColor: 'black', borderWidth: 2, width: 'auto', flexGrow: 0}}
                        />
                    </View>

                    <Button style={{}} title='Find Hunts' onPress={() => setSearching(true)}/>


                    {/* Completed Hunts List */}
                    <View style={{maxHeight: '30%', paddingTop: '10%'}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Hunts you've completed:</Text>
                        <FlatList
                            data = {activeHunts.filter(hunt => hunt.completed == 100)}
                            renderItem= {item => completedHunt(item)}
                            keyExtractor={ (item, index) => index }
                            style={{borderColor: 'black', borderWidth: 2, flexGrow: 0}}
                        />
                    </View>
                </View>


                <View style={ScavHunt.footer}>
            
                <Button title="Log Out" onPress={() =>{
                    dispatch(clearAll());
                    navigation.reset({
                    index: 0,
                    routes: [{ name: 'Register/Log-In' }],
                    })
                }}/>
                </View>

                {/* Search Modal */}
                <Modal visible={searching}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={ScavHunt.modalContainer}>
                        <Text style={{textAlign:'center'}}>Find Hunts:</Text>

                        <View style={{flexDirection: 'row', padding: 5, alignSelf:'center'}}>
                            <Text>Filter:</Text>
                            <TextInput
                            inputMode='text'
                            value={filter}
                            style={{width: '50%', borderWidth: 1, borderColor: 'gray'}}
                            onChangeText={text => setFilter(text)}
                            />
                        </View>
                        <Button title='Submit' onPress={() => searchHunts()}/>

                        <View style={{borderColor: 'black', borderWidth: 2, width: '100%'}}>
                            <FlatList
                            data= {searchedHunts}
                            renderItem={ (item) => searchedHunt(item)}
                            keyExtractor={ (item, index) => index }
                            style={{borderColor: 'black', borderWidth: 2, width: 'auto', flexGrow: 0}}
                            />
                        </View>

                        <Button title='Back' onPress={() => setSearching(false)}/>
                    </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    )
}