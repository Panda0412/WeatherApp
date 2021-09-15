import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfileField from './ProfileField';
import ModalView from './ModalView';
import {getUserAvatar, getUserData, setUserData} from './utils/userData';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  header: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    backgroundColor: 'rgba(171, 172, 204, 0.6)',
    width: '150%',
    aspectRatio: 1,
    borderRadius: Dimensions.get('screen').width,
  },
  avatar: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: Dimensions.get('screen').width,
    alignSelf: 'center',
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    right: 40,
    backgroundColor: 'aliceblue',
    width: 45,
    aspectRatio: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
  form: {
    padding: 20,
  },
});

export default function ProfileScreen() {
  const [user, setUser] = useState();
  const [avatarUri, setAvatarUri] = useState();
  const [edit, setEdit] = useState(false);
  const [showAPIModal, setShowAPIModal] = useState(false);

  useEffect(() => {
    getUserData()
      .then(data => !!Object.fromEntries(data).name)
      .then(isUserDefined => {
        if (!isUserDefined) {
          (async function getCitiesList() {
            const userResponse = await fetch('https://randomuser.me/api/');

            if (userResponse.ok) {
              const data = await userResponse.json();
              console.log('user', data.results[0]);
              setUser(data.results[0]);
              await setUserData(data.results[0]);
            } else {
              setShowAPIModal(true);
            }
          })();
        }
      });
    getUserAvatar().then(uri => setAvatarUri(uri));
  }, []);

  return (
    <View style={{...styles.body, paddingTop: useSafeAreaInsets().top + 20}}>
      <View>
        <View style={styles.header} />
        <Image
          style={styles.avatar}
          source={{uri: user ? user.picture.large : avatarUri}}
        />
        <TouchableOpacity style={styles.button} onPress={() => setEdit(!edit)}>
          <Image
            style={styles.icon}
            source={
              edit
                ? require('./images/save.png')
                : require('./images/update.png')
            }
          />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}>
          <ProfileField title={'Имя'} field={'name'} edit={edit} />
          <ProfileField
            title={'Дата рождения'}
            field={'birthDay'}
            edit={edit}
          />
          <ProfileField title={'Номер телефона'} field={'phone'} edit={edit} />
          <ProfileField title={'E-mail'} field={'email'} edit={edit} />
          <ProfileField title={'Адрес'} field={'address'} edit={edit} />
        </ScrollView>
      </KeyboardAvoidingView>
      {showAPIModal && (
        <ModalView
          mainText={
            'Проверьте подключение к интернету или повторите попытку позднее'
          }
          buttonTexts={['Хорошо']}
          visible={showAPIModal}
          setVisible={setShowAPIModal}
        />
      )}
    </View>
  );
}
