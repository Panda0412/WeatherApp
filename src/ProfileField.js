import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {getUserData, updateUserData} from './utils/userData';

const styles = StyleSheet.create({
  field: {
    borderWidth: 0.5,
    borderColor: '#535399',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  headerText: {
    color: '#535399',
    fontSize: 22,
    marginTop: 10,
    marginLeft: 10,
  },
  defaultText: {
    color: '#535399',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default function ProfileField(props) {
  const [value, setValue] = useState();
  const [postcode, setPostcode] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [street, setStreet] = useState();
  const [house, setHouse] = useState();

  useEffect(() => {
    getUserData().then(data => {
      const result = Object.fromEntries(data)[props.field];
      // console.log('data', data);
      // console.log('result', result);
      if (props.field === 'address' && result) {
        // console.log(result);
        setPostcode(JSON.parse(result).postcode);
        setCountry(JSON.parse(result).country);
        setCity(JSON.parse(result).city);
        setStreet(JSON.parse(result).street);
        setHouse(JSON.parse(result).house);
      } else {
        setValue(result);
      }
    });
  }, [props]);

  useEffect(() => {
    if (!props.edit && (value || country)) {
      props.field === 'address'
        ? updateUserData(
            'address',
            JSON.stringify({
              postcode: postcode,
              country: country,
              city: city,
              street: street,
              house: house,
            }),
          )
        : updateUserData(props.field, value);
    }
  }, [props.edit]);

  const fieldBackground = {
    backgroundColor: props.edit ? 'white' : 'rgba(171, 172, 204, 0.2)',
  };

  const biggerField = {width: '70%'};
  const smallerField = {width: '28%'};

  return (
    <>
      <Text style={styles.headerText}>{props.title}</Text>
      {props.title !== 'Адрес' ? (
        <TextInput
          style={[styles.field, styles.defaultText, fieldBackground]}
          onChangeText={setValue}
          value={value}
          placeholder={`Введите ${props.title.toLowerCase()}`}
          placeholderTextColor="#ABACCC"
          editable={props.edit}
        />
      ) : (
        <>
          <View style={styles.row}>
            <TextInput
              style={[
                styles.field,
                styles.defaultText,
                fieldBackground,
                smallerField,
              ]}
              onChangeText={setPostcode}
              value={postcode && postcode.toString()}
              placeholder={'Индекс'}
              placeholderTextColor="#ABACCC"
              editable={props.edit}
            />
            <TextInput
              style={[
                styles.field,
                styles.defaultText,
                fieldBackground,
                biggerField,
              ]}
              onChangeText={setCountry}
              value={country}
              placeholder={'Страна'}
              placeholderTextColor="#ABACCC"
              editable={props.edit}
            />
          </View>
          <TextInput
            style={[styles.field, styles.defaultText, fieldBackground]}
            onChangeText={setCity}
            value={city}
            placeholder={'Город'}
            placeholderTextColor="#ABACCC"
            editable={props.edit}
          />
          <View style={styles.row}>
            <TextInput
              style={[
                styles.field,
                styles.defaultText,
                fieldBackground,
                biggerField,
              ]}
              onChangeText={setStreet}
              value={street}
              placeholder={'Улица'}
              placeholderTextColor="#ABACCC"
              editable={props.edit}
            />
            <TextInput
              style={[
                styles.field,
                styles.defaultText,
                fieldBackground,
                smallerField,
              ]}
              onChangeText={setHouse}
              value={house && house.toString()}
              placeholder={'Дом'}
              placeholderTextColor="#ABACCC"
              editable={props.edit}
            />
          </View>
        </>
      )}
    </>
  );
}
