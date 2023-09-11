import React, { useEffect, useState } from 'react';
import {StyleSheet, Text} from 'react-native';


const CustomText = (props:any) => {
    return (
        <Text style={[styles.defaultFontText, props.style]}>{props.children}</Text>
    );
};

const styles = StyleSheet.create({
    defaultFontText: {
      fontFamily: 'Pretendard-Medium',
    },
  })

export default CustomText;