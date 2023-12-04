import { View, Text, Button } from "react-native";
import { UH } from "../../styles";
import { apiCall } from "../../functions";
import { useSelector } from "react-redux";


export function StartHuntScreen({route, navigation}) {
    const token = useSelector((state) => state.userInfo.token);
    const huntid = route.params.hunt.huntid;
    const name = route.params.hunt.name;

    return (
        <View style={UH.container}>
            <View style={UH.header}>
                <Text style={UH.HuntName}>{name}</Text>
            </View>

            <View style={UH.main}>
                <Button title='Start Hunt' onPress={ async () => {
                    await apiCall('startHunt.php', {huntid: huntid, token: token});
                    navigation.goBack();
                }}/>
            </View>

            <View style={UH.footer}>
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
        </View>
    )
}