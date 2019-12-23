import React from 'react';
import { View, StyleSheet, StatusBar, Text, SafeAreaView } from 'react-native';

import { Button, ButtonContainer } from '../components/Button';
import { Alert } from '../components/Alert';
import _ from 'lodash';
import { removeKey, setKey, getKey } from '../utilities/storage';
import { CURRENT_QUIZ, CURRENT_TEST_ID, CURRENT_QUESTION } from '../utilities/constant';
import Modal from '../components/Modal';
let StartTime;
let EndTime;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36B1F0',
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: -0.02,
    fontWeight: '600',
  },
  safearea: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'space-between',
  },
});

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    console.log('cunstructer --->');
    const questions = this.props.navigation.getParam('questions', []);
    let currentQuestion = _.findLastIndex(questions, 'answer');
    StartTime = new Date();
    this.state = {
      correctCount: 0,
      questions,
      totalCount: questions.length ? questions.length : 0,
      activeQuestionIndex: currentQuestion === -1 ? 0 : currentQuestion,
      answered: false,
      answerCorrect: false,
      isModal: false,
      SpendTime: 0
    };
    this.onAnswer = this.onAnswer.bind(this);
    // this.UpdateCurrentQuestion(currentQuestion === -1 ? 0 : currentQuestion);
  }


  // async UpdateCurrentQuestion(index) {
  //   await setKey(CURRENT_QUESTION, index);
  // }

  async onAnswer(answer, currentQuestionId) {

    let { questions, activeQuestionIndex } = this.state;
    questions[activeQuestionIndex].answer = answer;
    const answerCorrect =
      questions[activeQuestionIndex].correct_answer === answer;
    questions[activeQuestionIndex].correct = answerCorrect;
    await setKey(CURRENT_QUIZ, questions);
    //  this.UpdateCurrentQuestion(this.state.activeQuestionIndex + 1);
    this.setState(
      state => {
        const nextState = { answered: true };
        if (answerCorrect) {
          nextState.correctCount = state.correctCount + 1;
          nextState.answerCorrect = true;
        } else {
          nextState.answerCorrect = false;
        }
        return nextState;
      },
      () => {
        setTimeout(() => this.nextQuestion(), 750);
      },
    );
  }

  nextQuestion = async () => {
    const { totalCount, activeQuestionIndex } = this.state;
    console.log('total count', totalCount, activeQuestionIndex)
    const nextIndex = activeQuestionIndex + 1;
    const quizFinished = nextIndex >= totalCount;
    console.log('----', quizFinished)
    // if (quizFinished) {
    //   console.log('clear storage');
    //  // await removeKey(CURRENT_QUIZ);
    //   await removeKey(CURRENT_TEST_ID);
    // //  await removeKey(CURRENT_QUESTION);
    // }

    this.setState(state => {
      if (quizFinished) {
        console.log('clear state');
        EndTime = new Date();
        console.log('Start End', StartTime, EndTime);
        let diffTime = EndTime-StartTime;
        console.log("diff time --->",diffTime);
      //  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // var minutes = Math.floor(diffTime / 60) % 60;
        // diffTime -= minutes * 60;
        var seconds = diffTime/1000;

        console.log(seconds);

        return {
          isModal: true,
          SpendTime: seconds,
          answered: false,
        }
        //this.props.navigation.navigate('Home');
        // this.props.navigation.goBack();
        // this.props.navigation.popToTop();
      } else {
        return {
          activeQuestionIndex: nextIndex,
          answered: false,
        };
      }
    });
  };

  onPressPlayAgain = async () => {
    console.log('onPress Play Again');
    await fetch('https://opentdb.com/api.php?amount=10')
      .then(response => response.json())
      .then(async responseJson => {
        console.log('onPress play again response');
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
        console.log('answer Array', answersArray)
        const questions = responseJson.results.map((question, index) => ({
          ...question,
          answers: answersArray[index],
        }));
        console.log('------ Questions', questions, questions.length);
        this.setState({ questions, totalCount: questions.length });
        setKey(CURRENT_TEST_ID, Date.now()).then(async () => {
          await setKey(CURRENT_QUIZ, questions);
        });
        //   await setKey(CURRENT_QUIZ, questions);
        return responseJson.results;
      })
      .catch(error => {
        console.error(error);
      });
    console.log('response end');
    StartTime = new Date();
    this.setState({
      isModal: false,
      activeQuestionIndex: 0,
      correctCount: 0,
      SpendTime: 0,
    })
  }

  onPressHome = async () => {
    await removeKey(CURRENT_TEST_ID);
   // await removeKey(CURRENT_QUIZ);
    this.setState({
      isModal: false,
    })
    this.props.navigation.goBack();
  }


  render() {
    let {
      questions,
      activeQuestionIndex,
      totalCount,
      correctCount,
      answerCorrect,
      answered,
      SpendTime
    } = this.state;
    const question = questions[activeQuestionIndex];
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.props.navigation.getParam('color') },
        ]}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safearea}>
          {question && (
            <View>
              <Text style={styles.text}>{question.question}</Text>
              <ButtonContainer>
                {question.answers.map((answer, index) => (
                  <Button
                    key={answer}
                    text={answer}
                    onPress={() => this.onAnswer(answer, index)}
                  />
                ))}
              </ButtonContainer>
            </View>
          )}
          <Text style={styles.text}>{`${correctCount}/${totalCount}`}</Text>
        </SafeAreaView>
        <Alert correct={answerCorrect} visible={answered} />
        <Modal
          SpendTime={`${Math.floor(SpendTime/60)} min ${Math.floor(SpendTime%60)} sec`}
          CorrectAnswer={`${correctCount}/${totalCount}`}
          isVisible={this.state.isModal}
          onPressPlayAgain={() => this.onPressPlayAgain()}
          onPressGoHome={() => this.onPressHome()}
        />
      </View>
    );
  }
}

export default Quiz;
