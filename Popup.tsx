import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as amplitude from './AmplitudeAPI';

const Popup = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.upArea}>
            <Image source={require('./assets/check-circle-featured.png')}></Image>
            <Text style={styles.popUpText}>스탬프 등록 완료!</Text>
          </View>
          <View style={styles.downArea}>
            <TouchableOpacity style={styles.button} onPress={() => {onClose(); amplitude.confirmPushedStampFinModal();} }>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'  // 흐린 배경 설정
  },
  popup: {
    width: 343,
    boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.04)',
    // padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  upArea: {
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  downArea: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  popUpText: {
    color: '#101828',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#72D193',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
  },
});

export default Popup;
