import { View, Button, Dimensions, Text } from "react-native";
import { useEffect, useState } from "react";
import { Map } from "../styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from 'expo-location';



export function MapScreen({route, navigation}) {
    const location = route.params.loc;
    const locList = route.params.locList;
    const mapWidth = Dimensions.get('window').width * .9;
    const mapHeight = Dimensions.get('window').height * ((location.latitude && location.longitude) ? .8 : .75);
    const [region, setRegion] = useState({latitude: location.latitude, longitude: location.longitude,  latitudeDelta: 0.05, longitudeDelta: 0.05});
    const [warn, setWarn] = useState('');

    useEffect(() => {
        const getLoc = async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
            return ({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05});
        };
        if (!(region.latitude && region.longitude)) {
            (async () => {
                setWarn("Caution: this location has no position.\nShowing other Locations:");
                setRegion(await getLoc());
            })();
        }
    },[]);

    const getRandomHexColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <View style={Map.container}>
            <View style={Map.header}>
                <Text style={{color: 'red', textAlign:'center'}}>{warn}</Text>
            </View>

            <View style={[Map.main, {paddingBottom: 50}]}>

            {region.latitude &&
                <View>
                    <MapView
                    style={{width: mapWidth, height: mapHeight, alignSelf:'center'}}
                    initialRegion={region}
                >
                    <Marker
                        key={location.locationid}
                        identifier={location.locationid}
                        coordinate={region}
                        title={location.name}
                        description={location.description}
                    />
                    {locList
                        .filter(loc => (loc.locationid !== location.locationid && loc.latitude && loc.longitude))
                        .map((loc) => (
                            <Marker
                            key={loc.locationid}
                            identifier={loc.locationid}
                            coordinate={{latitude: loc.latitude, longitude: loc.longitude}}
                            title={loc.name}
                            description={loc.description}
                            pinColor={getRandomHexColor()}
                            />
                    ))}
                    </MapView>
                </View>
            }
            {!region.latitude &&
                <View>
                    <Text style={{textAlign: 'center'}}>Loading...</Text>
                </View>
            }

            </View>

            <View style={Map.footer}>
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
)};