import React, { useState } from 'react';
import { Image, View, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Divider, Text } from 'react-native-paper';

export const tmpMooStamps =[
  { id: 1, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 2, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 3, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 4, image: require('./assets/colorMooMedium.png'), sold: false},
  { id: 5, image: require('./assets/colorMooMedium.png'), sold: false},
];

export const tmpGiftStamps =[
  { id: 1, image: require('./assets/awakening_0904.png'), name: '스타벅스', remaining: 3},
  { id: 2, image: require('./assets/awakening_0904.png'), name: '스타벅스', remaining: 4},
  { id: 3, image: require('./assets/awakening_0904.png'), name: '스타벅스', remaining: 5},
  { id: 4, image: require('./assets/awakening_0904.png'), name: '스타벅스', remaining: 5},
  { id: 5, image: require('./assets/awakening_0904.png'), name: '스타벅스', remaining: 7},
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