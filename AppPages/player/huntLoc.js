import { View, Text, Button, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { UH } from "../../styles";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import { apiCall } from "../../functions";
import MapView, { Marker } from "react-native-maps";


export function HuntLocationScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const [locPerm, setLocPerm] = useState(route.params.locPerm);
    const [completed, setCompleted] = useState(route.params.location.completed);
    const name = route.params.location.name;
    const locationid = route.params.location.locationid;
    const description = route.params.location.description;
    const clue = route.params.location.clue;
    const position = {lat: route.params.location.latitude, long: route.params.location.longitude};
    const [subscription, setSubscription] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const mapWidth = Dimensions.get('window').width * .7;
    const mapHeight = Dimensions.get('window').width * .7;
    const [region, setRegion] = useState({latitude: lat, longitude: lat,  latitudeDelta: 0.02, longitudeDelta: 0.02});
    

    useEffect(() => {
        const getLoc = async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
            return ({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02});
        };
        if (!(region.latitude && region.longitude)) {
            (async () => {
                setRegion(await getLoc());
            })();
        }
    },[]);


    const getCurrentLoc = async () => {
        console.log('getting location...');
        const result = await Location.watchPositionAsync({accuracy: Location.Accuracy.Highest, distanceInterval: 5}, watchLoc);
        setSubscription(result);
    };
    
    const watchLoc = (location) => {
        setLat(location.coords.latitude);
        setLong(location.coords.longitude);
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

        getCurrentLoc();

        return () => {
            setSubscription(null);
            console.log('              STOPPED TRACKING');
            setLat(null);
            setLong(null);
        };
    }, []));
    
    const getDistance = () => {
        const deg2rad = (deg) => deg * (Math.PI / 180);
        //Learned something new: Haversine formula :D
        const R = 6371000; // Earth's radius in meters

        const dLat = deg2rad(lat - position.lat);
        const dLon = deg2rad(long - position.long);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position.lat)) * Math.cos(deg2rad(lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.floor(R * c);
    };

    const setColor = (dist) => (dist > 20) ? 'rgba(0,0,0,0)' : (dist > 9) ? 'yellow' : 'green';

    const dist = getDistance();
    const color = setColor(dist);

    

    return(
        <View style={UH.container}>
            <View style={UH.header}>
                <Text style={{fontSize: 20}}>{name}</Text>
            </View>


            <View style={UH.main}>
                <Text style={{textAlign: 'center', padding: 10}}>Clue: {clue}</Text>

                <View>
                    <Text style={{backgroundColor: color, textAlign:'center'}}>Distance: {(dist > 50) ? 'Far Away' : (dist > 9) ? 'Closer' : 'On it!'}</Text>
                </View>

                {completed && 
                    <Text style={{textAlign: 'center'}}>{description}</Text>
                }

                {!completed &&
                    <Button title='Complete Location' onPress={async () => {
                        let lati = parseFloat(lat.toFixed(6));
                        let longi = parseFloat(long.toFixed(6));
                        console.log(lati);
                        console.log(longi);
                        let result = await apiCall('completeLocation.php', {token: token, locationid: locationid, latitude: lati, longitude: longi});
                        if (!result || result.status != 'okay') {
                            if (result.status == 'toofar') {
                                alert("You are too far away!");
                                console.log('too far');
                                return;
                            }
                            else {
                                console.log(result);
                                console.log('received error: ' + result.error);
                                return;
                            }
                        }
                        console.log('completed location')
                        setCompleted(true);
                    }}/>
                }

                {dist < 20 && mapHeight && mapWidth &&
                    <MapView style={{width: mapWidth, height: mapHeight, alignSelf:'center'}} initialRegion={region}>
                        <Marker
                            key={locationid}
                            identifier={locationid}
                            coordinate={region}
                            title={name}
                            description={clue}
                        />
                    </MapView>
                }
            </View>


        <View style={UH.footer}>
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
        </View>
    )
}