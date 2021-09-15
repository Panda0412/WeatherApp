import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  WEATHER_API_ENDPOINT,
  WEATHER_API_KEY,
  CITIES_API_ENDPOINT,
  CITIES_API_KEY,
} from '@env';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WeatherView from './WeatherView';
import Geolocation from 'react-native-geolocation-service';
import ModalView from './ModalView';
import {getSavedCities} from './utils/savedCities';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'aliceblue',
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#535399',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    backgroundColor: 'white',
    width: 45,
    aspectRatio: 1,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: '#535399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    height: 45,
    borderWidth: 0.5,
    borderColor: '#535399',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  list: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: '#535399',
  },
  listItem: {
    padding: 10,
  },
  listItemText: {
    color: '#535399',
  },
  separator: {
    height: 0.5,
    borderBottomWidth: 0.2,
    borderColor: '#535399',
  },
  icon: {
    width: 25,
    height: 25,
  },
  modal: {
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: '#FFD6B0',
    borderWidth: 0.5,
    borderColor: '#CCB6AB',
    borderRadius: 30,
    padding: 15,
  },
  modalButton: {
    backgroundColor: 'rgba(204, 182, 171, 0.6)',
    width: '40%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CCB6AB',
    borderRadius: 15,
    padding: 7,
    alignItems: 'center',
  },
});

export default function WeatherScreen() {
  const [weather, setWeather] = useState();
  const [coords, setCoords] = useState({});
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState();
  const [savedCities, setSavedCities] = useState();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showAPIModal, setShowAPIModal] = useState(false);

  const showWeather =
    weather && !showSuggestions && !showSaved && !showGeoModal && !showAPIModal;

  useEffect(() => {
    if (!coords.latitude || !coords.longitude) {
      return;
    }

    (async function getWeather() {
      const weatherResponse = await fetch(
        `${WEATHER_API_ENDPOINT}&appid=${WEATHER_API_KEY}&lat=${coords.latitude}&lon=${coords.longitude}`,
      );

      if (weatherResponse.ok) {
        setWeather(await weatherResponse.json());
      } else {
        setShowAPIModal(true);
      }
    })();
  }, [coords]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);

      return;
    }

    (async function getCitiesList() {
      const cities = await fetch(`${CITIES_API_ENDPOINT}&q=${query}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'spott.p.rapidapi.com',
          'x-rapidapi-key': `${CITIES_API_KEY}`,
        },
      });

      if (cities.ok) {
        setSuggestions(await cities.json());
      } else {
        setShowAPIModal(true);
      }
    })();
  }, [query]);

  return (
    <View style={{...styles.body, paddingTop: useSafeAreaInsets().top + 20}}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => {
            (async () =>
              await getSavedCities().then(result => setSavedCities(result)))();
            setShowSaved(!showSaved);
            setShowSuggestions(false);
          }}>
          <Image
            style={styles.icon}
            source={require('./images/fillStar.png')}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.headerText]}
          onChangeText={setQuery}
          value={query}
          placeholder="Введите название"
          placeholderTextColor="#ABACCC"
          onFocus={() => {
            setShowSuggestions(true);
            setShowSaved(false);
          }}
        />
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => {
            Platform.OS === 'ios' &&
              Geolocation.requestAuthorization('whenInUse');
            setTimeout(() => {
              console.log('getting');
              Geolocation.getCurrentPosition(
                info => {
                  console.log(info);
                  setShowGeoModal(false);
                  setCoords(info.coords);
                  setQuery('');
                },
                e => {
                  console.log(e);
                  setShowGeoModal(true);
                },
                {timeout: 3000},
              );
            }, 1000);
          }}>
          <Image style={styles.icon} source={require('./images/locator.png')} />
        </TouchableOpacity>
      </View>
      {showSuggestions && (
        <FlatList
          data={suggestions}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setShowSuggestions(false);
                setQuery(item.localizedName || item.name);
                setCoords(item.coordinates);
              }}>
              <Text style={styles.listItemText}>
                {item.localizedName || item.name} (
                {item.country &&
                  (item.country.localizedName || item.country.name)}
                )
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item, index): string => index.toString()}
        />
      )}
      {showSaved && (
        <FlatList
          data={savedCities}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setShowSaved(false);
                setQuery(item.localizedName || item.name);
                setCoords(item.coords);
              }}>
              <Text style={styles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item, index): string => index.toString()}
        />
      )}
      {showGeoModal && (
        <ModalView
          mainText={
            'Чтобы посмотреть погоду в вашей точке, необходим доступ к геопозиции'
          }
          buttonTexts={['Отмена', 'Настройки']}
          buttonCallbacks={[Linking.openSettings]}
          visible={showGeoModal}
          setVisible={setShowGeoModal}
        />
      )}
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
      {showWeather && <WeatherView weatherData={weather} cityName={query} />}
    </View>
  );
}
