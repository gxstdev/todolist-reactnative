import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({route, navigation}) => {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  const date = new Date();

  let weekDay = date.getDay();
  let monthDay = date.getDate();
  let month = date.getMonth();

  let arrayUsersData = [];

  const [show, setShow] = useState(false);

  const [taskTime, setTaskTime] = useState();

  const [taskDescription, setTaskDescription] = useState();

  const showTimePicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedTime) => {
    const time = {
      hour: selectedTime.getHours(),
      minutes: selectedTime.getMinutes(),
    };
    setShow(false);
    setTaskTime(time);
  };

  const checkInputs = () => {
    if (!taskTime || !taskDescription) {
      Alert.alert(
        'Dados não inseridos!',
        'Por favor, adicione uma descrição e selecione um horário para a tarefa.',
        [{text: 'OK'}],
      );
      return false;
    }
    return true;
  };
  const userData = {user: route.params.user, userTasks: []};

  const [taskList, setTaskList] = useState();

  const getTasksUser = () => {
    for (const element of arrayUsersData) {
      if (element.user === route.params.user) {
        return setTaskList(element.userTasks);
      }
    }
    return false;
  };

  const getStorageUsersData = async () => {
    try {
      const storage = await AsyncStorage.getItem('usersTaskData');
      if (storage) {
        arrayUsersData = JSON.parse(storage);
      }
    } catch (error) {}
  };

  const task = {
    id: taskList ? taskList.length : 0,
    description: taskDescription,
    time: taskTime,
    completed: false,
  };

  const addTask = async () => {
    for (const element of arrayUsersData) {
      if (element.user === route.params.user) {
        element.userTasks.push(task);
        return await AsyncStorage.setItem(
          'usersTaskData',
          JSON.stringify(arrayUsersData),
        );
      }
    }
    userData.userTasks.push(task);
    arrayUsersData.push(userData);
    await AsyncStorage.setItem('usersTaskData', JSON.stringify(arrayUsersData));
  };

  const [showTask, setShowTask] = useState(false);

  getStorageUsersData();

  getTasksUser();

  const [selectedId, setSelectedId] = useState();
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#e0aaff', '#c77dff', '#9d4edd']}
        style={styles.header}>
        <Text style={styles.headerText}>
          {days[weekDay]}, {monthDay} de {months[month]}
        </Text>
      </LinearGradient>
      <View style={styles.addTask}>
        <TextInput
          placeholder="descrição tarefa"
          style={styles.input}
          onChangeText={text => setTaskDescription(text)}
        />

        <TouchableOpacity onPress={showTimePicker} style={styles.btnTime}>
          <Icon name="schedule" size={50} color="#5a189a" />
        </TouchableOpacity>
        {show && (
          <RNDateTimePicker
            value={date}
            mode="time"
            onChange={onChange}
            display="spinner"
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          if (checkInputs()) {
            addTask();
            setShowTask(true);
            getTasksUser();
          }
        }}>
        <Text style={styles.btnText}>Adicionar</Text>
      </TouchableOpacity>
      {showTask && (
        <FlatList
          data={taskList}
          renderItem={({item}) => {
            return (
              <SafeAreaView style={styles.listContainer}>
                <View style={styles.itemList}>
                  <View>
                    <Text>
                      {item.time.hour}: {item.time.minutes}
                    </Text>
                    <Text
                      style={[
                        styles.itemText,
                        item.completed && styles.doneItem,
                      ]}>
                      {item.description}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={async () => {
                      setSelectedId(item.id);
                      for (const element of taskList) {
                        if (element.id === item.id) {
                          element.completed = true;
                        }
                      }
                    }}>
                    <Icon name="done" size={50} color="#5a189a" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            );
          }}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      )}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Icon name="logout" size={30} color="#3c096c" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#edf2f4',
    flex: 1,
    gap: 20,
    alignItems: 'center',
  },
  header: {
    padding: 15,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    color: '#3c096c',
    fontSize: 26,
    fontWeight: '500',
  },
  input: {
    width: 320,
    borderWidth: 1,
    borderColor: '#5a189a',
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
  btnTime: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#5a189a',
    borderWidth: 1,
    backgroundColor: '#e0aaff',
  },
  addTask: {
    padding: 5,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemList: {
    padding: 20,
    margin: 8,
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 10,
    borderColor: '#9d4edd',
  },
  listContainer: {
    flex: 1,
    gap: 5,
  },
  itemTime: {
    fontSize: 26,
    color: '#c77dff',
  },
  itemText: {
    fontSize: 26,
    color: '#9d4edd',
  },
  doneItem: {
    color: '#9d4edd',
    textDecorationLine: 'line-through',
  },
  logoutBtn: {
    position: 'absolute',
    right: 5,
    bottom: 0,
    backgroundColor: '#e0aaff',
  },
});

export default Home;
