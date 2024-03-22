import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUpForm from './src/components/screens/SignUp/SignUpForm';
import LoginForm from './src/components/screens/Login/LoginForm';
import Home from './src/components/screens/Home/Home';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignUp"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SignUp"
          component={SignUpForm}
          options={{title: 'Sign Up'}}
        />
        <Stack.Screen
          name="Login"
          component={LoginForm}
          options={{title: 'Login'}}
        />
        <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
