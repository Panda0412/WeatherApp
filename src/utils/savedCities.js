import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSavedCities = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('savedCities');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log('getting savedCities', e);
  }
};

export const saveCity = async (name, country, coords) => {
  getSavedCities()
    .then(savedCities => {
      if (
        savedCities.findIndex(
          city => city.country === country && city.name === name,
        ) === -1
      ) {
        savedCities.push({
          name: name,
          country: country,
          coords: {latitude: coords.lat, longitude: coords.lon},
        });
      }

      return savedCities;
    })
    .then(async newSavedCities => {
      try {
        const jsonValue = JSON.stringify(newSavedCities);
        await AsyncStorage.setItem('savedCities', jsonValue);
      } catch (e) {
        console.log('saving city', e);
      }
    });
};

export const removeCityFromSaved = async (name, country) => {
  getSavedCities()
    .then(savedCities => {
      savedCities.splice(
        savedCities.findIndex(
          city => city.country === country && city.name === name,
        ),
        1,
      );

      return savedCities;
    })
    .then(async newSavedCities => {
      try {
        const jsonValue = JSON.stringify(newSavedCities);
        await AsyncStorage.setItem('savedCities', jsonValue);
      } catch (e) {
        console.log('removing city', e);
      }
    });
};

export async function isInSaved(name, country) {
  return await getSavedCities().then(
    savedCities =>
      savedCities.findIndex(
        city => city.country === country && city.name === name,
      ) !== -1,
  );
}
