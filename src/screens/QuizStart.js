import React from 'react';
import { ScrollView, StatusBar, Text, View, TouchableOpacity, StyleSheet, SafeAreaView,ActivityIndicator } from 'react-native';
import { getKey, setKey } from '../utilities/storage';

// import {RowItem} from '../components/RowItem';
import { Button, ButtonContainer } from '../components/Button';
import { CURRENT_QUIZ, CURRENT_TEST_ID } from '../utilities/constant';

export default class QuizStart extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      questions: [],
      isLoading:true,
    };
    this.getQuizQuestions = this.getQuizQuestions.bind(this);
    this.startTest = this.startTest.bind(this);
  }

  getQuizQuestions() {
    getKey(CURRENT_TEST_ID).then(async currentTest => {
      if (currentTest) {
        const questions = await getKey(CURRENT_QUIZ);
        this.setState({ questions });
      } else {
        await fetch('https://opentdb.com/api.php?amount=10')
          .then(response => response.json())
          .then(responseJson => {
            const { results } = responseJson;


            let answersArray = [];


            answersArray = results.map((item, index) => {
              let answers = [...item.incorrect_answers, item.correct_answer]
              var currentIndex = answers.length, temporaryValue, randomIndex;
              while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = answers[currentIndex];
                answers[currentIndex] = answers[randomIndex];
                answers[randomIndex] = temporaryValue;
              }
              return answers;
            })
            const questions = responseJson.results.map((question,index) => ({
              ...question,
              answers: answersArray[index],
            }));
            
            this.setState({ questions,isLoading:false });
            return responseJson.results;
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }

  async componentDidMount() {
    await this.getQuizQuestions();
  }

  async componentDidUpdate(prevProps, prevState) {
    await this.getQuizQuestions()
  }

  startTest() {
    const { questions } = this.state;
    const { navigation } = this.props;
    setKey(CURRENT_TEST_ID, Date.now()).then(async () => {
      await setKey(CURRENT_QUIZ, questions);
      navigation.navigate('Quiz', {
        title: 'Quiz',
        questions,
        color: '#36b1f0',
      });
    });
  }

  render() {
    const { navigation } = this.props;
    const { questions,isLoading } = this.state;
    return (
      <SafeAreaView style={styles.container} >
        <StatusBar barStyle="dark-content" />
        <ButtonContainer>
          <View>
          {isLoading ? 
          <View style={{backgroundColor:'#36b1f0',paddingHorizontal:65,paddingVertical:18,borderRadius: 7}} >
          <ActivityIndicator size='small' color='#FFFFFF'  /> 
          </View>
          :
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Quiz', {
                  title: 'Quiz',
                  questions,
                  color: '#36b1f0',
                })}
              style={{ backgroundColor: '#36b1f0', padding: 10, borderRadius: 7 }} >
              <Text style={{fontSize:28,fontWeight:'bold'}} >{'Start Quiz'}</Text>
            </TouchableOpacity>
          }
          </View>
        </ButtonContainer>
      </SafeAreaView>
    );
  }
}


export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
})