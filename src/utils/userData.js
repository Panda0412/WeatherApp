import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserData = async user => {
  const avatar = ['avatar', user.picture.large];
  const name = [
    'name',
    `${user.name.title} ${user.name.first} ${user.name.last}`,
  ];
  const birthDay = ['birthDay', user.dob.date.slice(0, 10).replace(/-/g, '.')];
  const phone = ['phone', user.phone];
  const email = ['email', user.email];
  const address = [
    'address',
    JSON.stringify({
      postcode: user.location.postcode,
      country: user.location.country,
      city: user.location.city,
      street: (user.location.street && user.location.street.name) || '',
      house: (user.location.street && user.location.street.number) || '',
    }),
  ];

  try {
    await AsyncStorage.multiSet([
      avatar,
      name,
      birthDay,
      phone,
      email,
      address,
    ]);
  } catch (e) {
    console.log('saving user', e);
  }
};

export const getUserData = async () => {
  try {
    return await AsyncStorage.multiGet([
      'name',
      'birthDay',
      'phone',
      'email',
      'address',
    ]);
  } catch (e) {
    console.log('getting user', e);
  }
};

export const getUserAvatar = async () => {
  try {
    return await AsyncStorage.getItem('avatar');
  } catch (e) {
    console.log('getting userAvatar', e);
  }
};

export const updateUserData = async (key, newValue) => {
  try {
    await AsyncStorage.setItem(key, newValue);
  } catch (e) {
    console.log('updating user', key, e);
  }
};
