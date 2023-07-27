import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Divider, Text } from 'react-native-paper';

const SettingsComponent = ({settingsOptions} : any) => {
    return (
        <ScrollView>
            {settingsOptions.map(({title,onPress}:any) => (
                <View key={title}>
                    <TouchableOpacity onPress={onPress}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingBottom: 25,
                                paddingTop: 25,
                            }}>
                            <Text style={{fontSize: 17}}>{title}</Text>
                        </View>
                    </TouchableOpacity>
                    <Divider style={{backgroundColor:"#737373"}}/>
                </View>
            ))}
        </ScrollView>
    );
}


export default SettingsComponent;