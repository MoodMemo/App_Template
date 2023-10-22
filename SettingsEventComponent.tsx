import React, { useState } from 'react';
import { Image, View, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Divider, Text } from 'react-native-paper';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

export const tmpMooStamps =[
  { id: 1, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 2, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 3, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 4, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 5, image: require('./assets/colorMooMedium.png'), sold: false},
];

export const tmpGiftStamps =[
  { id: 1, name: '스타벅스\n아이스아메리카노', key: 'coffee', cost:1},
  { id: 2, name: '배스킨라빈스\n파인트', key: 'ice', cost:1},
  { id: 3, name: '굽네\n고추바사삭', key: 'chicken_1', cost: 2},
  { id: 4, name: 'BHC\n뿌링클', key: 'chicken_2', cost: 60},
];

export const GiftStampDivider = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 5 }}>
        <View style={{flexDirection: 'column'}}>
            <Divider style={{backgroundColor:"#B7B7B7", width: 120,}}/>
            <Divider style={{backgroundColor:"#B7B7B7", width: 120,}}/>
        </View>
        <Text style={{color:"#B7B7B7", fontSize: 13, }}>상품</Text>
        <View style={{flexDirection: 'column'}}>
            <Divider style={{backgroundColor:"#B7B7B7", width: 120,}}/>
            <Divider style={{backgroundColor:"#B7B7B7", width: 120,}}/>
        </View>
    </View>
  );
}

export const MooStampDivider = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 5 }}>
        <View style={{flexDirection: 'column'}}>
            <Divider style={{backgroundColor:"#B7B7B7", width: 115,}}/>
            <Divider style={{backgroundColor:"#B7B7B7", width: 115,}}/>
        </View>
        <Text style={{color:"#B7B7B7", fontSize: 13, }}>스탬프</Text>
        <View style={{flexDirection: 'column'}}>
            <Divider style={{backgroundColor:"#B7B7B7", width: 115,}}/>
            <Divider style={{backgroundColor:"#B7B7B7", width: 115,}}/>
        </View>
    </View>
  );
}