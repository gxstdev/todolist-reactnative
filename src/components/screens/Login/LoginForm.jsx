import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const LoginForm = ({navigation}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const getArrayUsers = async () => {
    const user = await AsyncStorage.getItem('users');
    return JSON.parse(user);
  };

  const checkUserData = async () => {
    const arr = await getArrayUsers();
    for (const element of arr) {
      if (element.email === emailInput && element.password === passwordInput) {
        return element.email;
      }
    }
    return false;
  };

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#e0aaff', '#c77dff', '#9d4edd']}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Entre na sua conta</Text>
        <TextInput
          placeholder="e-mail"
          keyboardType="email-address"
          style={styles.input}
          onChangeText={text => setEmailInput(text)}
        />
        <TextInput
          placeholder="senha"
          secureTextEntry={true}
          style={styles.input}
          onChangeText={text => setPasswordInput(text)}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            const response = await checkUserData();
            if (response) {
              navigation.navigate('Home', {user: response});
            } else {
              Alert.alert(
                'Dados incorretos!',
                'Verifique e digite novamente.',
                [{text: 'OK'}],
              );
            }
          }}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.btnText}>Ou crie uma conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cdb4db',
    flex: 1,
    gap: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#fff',
    width: 300,
    gap: 10,
    padding: 20,
    borderRadius: 40,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7b2cbf',
  },
  input: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#c77dff',
    width: '100%',
  },
  btn: {
    width: 100,
    backgroundColor: '#e0aaff',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3c096c',
  },
});
export default LoginForm;
