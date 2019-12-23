import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';
export const Styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-between',
  },
});

export const Button = ({text, onPress = () => {}}) => (
  <TouchableOpacity onPress={onPress} style={Styles.button}>
    {/* <Text style={Styles.text}>{text}</Text> */}
    <HTML baseFontStyle={{fontSize : 18,color:'#FFFFFF'}} html={text}  />
  </TouchableOpacity>
);

export const ButtonContainer = ({children}) => (
  <View style={Styles.buttonContainer}>{children}</View>
);
