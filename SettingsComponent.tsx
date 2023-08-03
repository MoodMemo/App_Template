import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Divider, Text } from 'react-native-paper';

import Modal from "react-native-modal";


const SettingsComponent = ({settingsOptions} : any) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <ScrollView>
            {settingsOptions.map(({title,onPress}:any) => (
                <View key={title}>
                    <TouchableOpacity onPress={() => {
                        onPress();
                        setIsModalVisible(!isModalVisible);
                        }}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingBottom: 25,
                                paddingTop: 25,
                            }}>
                            <Text style={{fontSize: 17}}>{title}</Text>
                        </View>
                        <Modal isVisible={isModalVisible}
                        animationIn={"fadeIn"}
                        animationInTiming={200}
                        animationOut={"fadeOut"}
                        animationOutTiming={200}
                        onBackdropPress={() => {
                            setIsModalVisible(!isModalVisible);
                        }}
                        backdropColor='#ADADAD'
                        backdropOpacity={0.1}>
                            <View style={{
                                flex: 1,
                                backgroundColor: "#FFFFFF",
                                width: '80%',
                                }}>
                                <Text>I am the modal content!</Text>
                            </View>
                        </Modal>
                    </TouchableOpacity>
                    <Divider style={{backgroundColor:"#737373"}}/>
                </View>
            ))}
        </ScrollView>
    );
}


export default SettingsComponent;