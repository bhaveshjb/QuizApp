/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Quiz from './src/screens/Quiz';
import QuizStart from './src/screens/QuizStart';

const MainNavigator = createStackNavigator({
  Home: {screen: QuizStart},
  Quiz: {screen: Quiz},
});

const App = createAppContainer(MainNavigator);
export default App;
