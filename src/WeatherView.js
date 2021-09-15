import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {isInSaved, removeCityFromSaved, saveCity} from './utils/savedCities';

const styles = StyleSheet.create({
  weatherView: {
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: '#FFD6B0',
    borderWidth: 0.5,
    borderColor: '#CCB6AB',
    borderRadius: 30,
  },
  header: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#CCB6AB',
    marginBottom: 10,
    justifyContent: 'center',
  },
  headerText: {
    color: '#535399',
    fontSize: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  separator: {
    borderTopWidth: 0.5,
    borderColor: '#CCB6AB',
    borderRadius: 15,
  },
  verticalSeparator: {
    borderRightWidth: 0.5,
    borderColor: '#CCB6AB',
  },
  block: {
    flex: 1,
    paddingHorizontal: 15,
  },
  defaultText: {
    color: '#535399',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
  },
  icon: {
    backgroundColor: '#CCB6AB',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 5,
  },
  starButton: {
    backgroundColor: '#FFD6B0',
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    alignSelf: 'center',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    width: 20,
    height: 20,
  },
});

export default function WeatherView(props) {
  let precipitation = props.weatherData.rain ? props.weatherData.rain['1h'] : 0;
  precipitation += props.weatherData.snow ? props.weatherData.snow['1h'] : 0;
  const [saved, setSaved] = useState();

  useEffect(() => {
    isInSaved(
      props.cityName || props.weatherData.name,
      props.weatherData.sys.country,
    ).then(result => setSaved(result));
  }, [props]);

  return (
    <View style={styles.weatherView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {props.cityName || props.weatherData.name}
        </Text>
        <TouchableOpacity
          style={styles.starButton}
          onPress={() => {
            saved
              ? removeCityFromSaved(
                  props.cityName,
                  props.weatherData.sys.country,
                )
              : saveCity(
                  props.cityName || props.weatherData.name,
                  props.weatherData.sys.country,
                  props.weatherData.coord,
                );
            setSaved(!saved);
          }}>
          <Image
            style={styles.star}
            source={
              saved
                ? require('./images/fillStar.png')
                : require('./images/emptyStar.png')
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={[styles.block, styles.verticalSeparator]}>
          <View style={styles.row}>
            {props.weatherData.weather[0].icon && (
              <Image
                style={styles.icon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${props.weatherData.weather[0].icon}@2x.png`,
                }}
              />
            )}
            <Text style={styles.headerText}>
              {props.weatherData.clouds.all}%
            </Text>
          </View>
          <Text style={styles.defaultText}>
            {props.weatherData.weather[0].description[0].toUpperCase() +
              props.weatherData.weather[0].description.slice(1)}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.headerText}>{props.weatherData.main.temp}°C</Text>
          <Text style={styles.defaultText}>
            Ощущается как {props.weatherData.main.feels_like}°C
          </Text>
        </View>
      </View>

      <View style={[styles.row, styles.separator]}>
        <View style={[styles.row, styles.block]}>
          <Image
            style={{
              ...styles.icon,
              width: 30,
              transform: [{rotate: `${props.weatherData.wind.deg}deg`}],
            }}
            source={require('./images/windArrow.png')}
          />
          <Text style={styles.headerText}>
            {props.weatherData.wind.speed || 0} м/с
          </Text>
        </View>
        <Text style={[styles.defaultText, styles.block]}>
          Порывы до {props.weatherData.wind.gust || 0} м/с
        </Text>
      </View>

      <View style={[styles.row, styles.separator]}>
        <View style={[styles.block, styles.verticalSeparator]}>
          <Text style={styles.headerText}>Давление</Text>
          <Text style={styles.defaultText}>
            {(props.weatherData.main.pressure * 3) / 4} мм рт. ст.
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.headerText}>Влажность</Text>
          <Text style={styles.defaultText}>
            {props.weatherData.main.humidity}%
          </Text>
        </View>
      </View>

      {!!precipitation && (
        <View
          style={{
            ...styles.separator,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}>
          <Text style={styles.headerText}>Осадков за последний час выпало</Text>
          <Text style={styles.defaultText}>{precipitation} мм</Text>
        </View>
      )}
    </View>
  );
}
