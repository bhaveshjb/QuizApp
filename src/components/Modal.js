import React from 'react';
import { Modal, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import {Button,ButtonContainer,Styles} from './Button';

const ModalUI = ({ isVisible, CorrectAnswer, SpendTime,onPressPlayAgain,onPressGoHome }) => (
    <Modal transparent={true} visible={isVisible} >
        <View style={styles.container} >
            <View style={styles.childContainer} >
                <View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={styles.Text} >{'Correct Answers:'}</Text>
                        <View style={{backgroundColor:'#FFFFFF',paddingHorizontal:5,borderRadius:5}} >
                        <Text style={{...styles.Text,color:'#000000',fontWeight:'normal'}} >{CorrectAnswer}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row',top:10 }} >
                        <Text style={styles.Text}>{'Spend Time:'}</Text>
                        <View style={{backgroundColor:'#FFFFFF',paddingHorizontal:5,borderRadius:5}} >
                        <Text style={{...styles.Text,color:'#000000',fontWeight:'normal'}}>{SpendTime}</Text>
                        </View>
                    </View>
                </View>
                <ButtonContainer>
                    <TouchableOpacity  onPress={onPressPlayAgain}  style={Styles.button} >
                        <Text style={styles.Text} >{'Play Again!'}</Text>
                    </TouchableOpacity>
                </ButtonContainer>
                <ButtonContainer>
                    <TouchableOpacity  onPress={onPressGoHome}  style={{...Styles.button,marginTop:0}} >
                        <Text style={styles.Text} >{'Home'}</Text>
                    </TouchableOpacity>
                </ButtonContainer>
            </View>
        </View>
    </Modal>
)

export default ModalUI;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000099'
    },
    childContainer: {
        alignSelf: 'center',
        backgroundColor: '#36b1f0',
     //   height: '30%',
      //  width: '90%',
        borderRadius: 7,
        padding: 10,
        paddingHorizontal:15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Text: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        
    }
})