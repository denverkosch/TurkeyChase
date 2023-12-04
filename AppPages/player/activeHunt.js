import { View, Text, Button, Modal, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";
import * as Location from 'expo-location';
import { useSelector } from "react-redux";
import { UH } from "../../styles";
import { apiCall } from "../../functions";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { parse } from "ipaddr.js";


export function ActiveHuntScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const huntid = route.params.hunt.huntid;
    const completed = route.params.hunt.completed;
    const name = route.params.hunt.name;
    const description = route.params.hunt.description;
    const [locPerm, setLocPerm] = useState(route.params.locPerm);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [abandoning, setAbandoning] = useState(false);
    const [aLocs, setaLocs] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [done, setDone] = useState(route.params.hunt.completed == 100);


    const completeLoc = ({item}) => {
        const {name, clue} = item;
        return (
            <TouchableOpacity onPress={() => navigation.navigate("AHLocation", {location: item, locPerm: locPerm})}>
                <View style={{backgroundColor: 'green'}}>
                    <Text style={{textAlign: 'center', textDecorationLine: 'underline', fontWeight: 'bold'}}>{name}</Text>
                    <Text style={{textAlign: 'center'}}>{clue}</Text>
                </View>
            </TouchableOpacity>
    )};


    const getCurrentLoc = async () => {
        console.log('getting location...');
        const result = await Location.watchPositionAsync(
            {accuracy: Location.Accuracy.Highest, distanceInterval: 5}, 
            watchLoc);
        setSubscription(result);
    };
    
    const watchLoc = (location) => {
        setLat(parseFloat(location.coords.latitude.toFixed(5)));
        setLong(parseFloat(location.coords.longitude.toFixed(5)));
        console.log('updated location');
    };
    
    useFocusEffect(useCallback(() => {
        if (!locPerm) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') return;
                setLocPerm(true);
            })();
        }

        const getaLocs = async () => {
            const result = await apiCall('getAvailableLocations.php', {token: token, huntid: huntid});
            if (result) {
                if (result.locations) {
                    setaLocs(result.locations);
                }
                else {
                    console.log("error: failed to recieve locations properly (returned: " + result.error);
                }
            }
        };

        getCurrentLoc();
        
        getaLocs();

        return () => {
            setSubscription(null);
            console.log('              STOPPED TRACKING');
            setLat(null);
            setLong(null);
        };
    }, []));

    const loc = (item) => {
        const {name, clue, latitude, longitude, completed} = item.item;
        if (completed) return completeLoc(item);

        const deg2rad = (deg) => deg * (Math.PI / 180);

        const getDistance = () => {
            //Learned something new: Haversine formula :D
            const R = 6371000; // Earth's radius in meters

            const dLat = deg2rad(lat - latitude);
            const dLon = deg2rad(long - longitude);

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(latitude)) * Math.cos(deg2rad(lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return Math.floor(R * c);
        };

        const setColor = (dist) => (dist > 50) ? 'rgba(0,0,0,0)' : (dist > 9) ? 'red' : 'yellow';

        const color = setColor(getDistance());
        return (
            <TouchableOpacity onPress={() => navigation.navigate("AHLocation", {location: item.item, locPerm: locPerm})}>
                <View>
                    <Text style={{textAlign: 'center', textDecorationLine: 'underline', fontWeight: 'bold', backgroundColor: color}}>{name}</Text>
                    <Text style={{textAlign: 'center', backgroundColor: color}}>{clue}</Text>
                </View>
            </TouchableOpacity>
    )};

    return (
        <View style={UH.container}>
            <View style={UH.header}>
                <Text style={UH.HuntName}>{name}</Text>
                <Text >{completed}% Complete</Text>
            </View>

            <View style={UH.main}>
                <Text style={{textAlign: 'center'}}>lat: {lat}</Text>
                <Text style={{textAlign: 'center'}}>long: {long}</Text>
                
                <Text style={{textAlign: 'center'}}>Available Locations to Visit:</Text>
                <View style={{maxHeight: '70%'}}>
                    <FlatList
                        data= {aLocs}
                        renderItem={ (item) => loc(item)}
                        keyExtractor={ (item, index) => index }
                        style={{borderColor: 'black', borderWidth: 2, width: 'auto',}}
                    />
                </View>
            </View>

            <View style={UH.footer}>
                <Button title='Abandon' onPress={() => setAbandoning(true)}/>
                {/* Back & Home Buttons */}
                <View style={{flexDirection: 'row', alignSelf:'center'}}>
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

            <Modal visible={abandoning}>
                <View style={UH.modal}>
                    <Text style={{textAlign:'center', color: 'red', fontSize: 20, fontWeight: 'bold', width: '90%'}}>
                        Are you sure that you want to abandon this hunt?{'\n'}
                        Any progress you have made on this hunt will be lost
                    </Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center', paddingTop: 10}}>
                        <Button title='Abandon' onPress={async () => {
                            await apiCall('abandonHunt.php', {huntid: huntid, token: token});
                            navigation.goBack();
                            }}/>
                        <Button title='Cancel' onPress={() => setAbandoning(false)}/>
                    </View>
                </View>
            </Modal>

            <Modal visible={done}>
                <View style={[UH.congrats, UH.container]}>
                    <Text style={{fontWeight: 'bold', fontSize: 47, textAlign: 'center', fontStyle:'italic', paddingBottom:40}}>
                        Congratulations!{'\n\n'}
                        You've succesfully completed this hunt!
                    </Text>
                    <Button title='View Hunt Locations' onPress={() => setDone(false)}/>
                </View>
            </Modal>
        </View>
    )
}