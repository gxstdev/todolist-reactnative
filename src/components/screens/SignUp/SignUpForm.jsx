import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const SignUpForm = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const user = {email: email, name: name, password: password};

  let arrayUsers = [];

  const setUser = async () => {
    await AsyncStorage.setItem('users', JSON.stringify(arrayUsers));
  };

  const getStorageUsers = async () => {
    const arrayStorageUsers = await AsyncStorage.getItem('users');
    if (arrayStorageUsers) {
      arrayUsers = JSON.parse(arrayStorageUsers);
      return JSON.parse(arrayStorageUsers);
    }
    return false;
  };

  const checkEmail = value => {
    const isValidEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
    if (value.match(isValidEmail)) {
      setEmail(value);
    } else {
      setEmail('');
    }
  };

  const errorInput = () => {
    if (name.length < 3 || password.length < 6 || email === '' || !email) {
      return true;
    }
  };

  getStorageUsers();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#e0aaff', '#c77dff', '#9d4edd']}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput
          placeholder="nome"
          keyboardType="default"
          value={name}
          onChangeText={text => {
            setName(text);
          }}
          style={styles.input}
        />
        {name.length < 3 && name !== '' ? (
          <View>
            <Text>Nome inválido! Por favor, digite novamente.</Text>
          </View>
        ) : null}

        <TextInput
          placeholder="e-mail"
          keyboardType="email-address"
          ref={input => {
            this.textInput = input;
          }}
          style={styles.input}
          onChangeText={text => {
            checkEmail(text);
          }}
        />
        {email === '' ? (
          <View>
            <Text>
              E-mail inválido. Não está dentro do padrão text@email.com
            </Text>
          </View>
        ) : null}
        <TextInput
          placeholder="senha"
          secureTextEntry={true}
          value={password}
          style={styles.input}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        {password.length < 6 && password !== '' ? (
          <View>
            <Text>A senha deve ter 6 ou mais caracteres.</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (errorInput()) {
              Alert.alert(
                'Dados inválidos!',
                'Por favor verifique os dados digitados.',
                [{text: 'OK'}],
              );
            } else {
              arrayUsers.push(user);
              setUser();
              setName('');
              setPassword('');
              this.textInput.clear();
              navigation.navigate('Login');
            }
          }}>
          <Text style={styles.btnText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
            setUser();
            setName('');
            setPassword('');
            this.textInput.clear();
          }}>
          <Text style={styles.btnText}>Ou entre na sua conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cdb4db',
    flex: 1,
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
  btnStorage: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default SignUpForm;
