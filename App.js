import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WeatherScreen from './src/WeatherScreen';
import ProfileScreen from './src/ProfileScreen';
import {Platform} from 'react-native';

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  const androidStyle = Platform.OS === 'android' && {
    marginBottom: -20,
    paddingBottom: 20,
    backgroundColor: 'white',
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Weather"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarInactiveTintColor: '#ABACCC',
          tabBarActiveTintColor: '#535399',
          tabBarLabelStyle: {fontSize: 20},
          tabBarItemStyle: {
            marginTop: 15,
            borderRightWidth: 0.2,
            borderLeftWidth: 0.2,
            borderColor: '#535399',
            ...androidStyle,
          },
          tabBarStyle: {
            elevation: 0,
            marginBottom: Platform.OS === 'android' ? 20 : 0,
            borderTopWidth: 0.4,
            borderTopColor: '#535399',
          },
        }}>
        <Tab.Screen
          name="Weather"
          component={WeatherScreen}
          options={{
            tabBarLabel: 'Погода',
            tabBarIcon: () => <></>,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Профиль',
            tabBarIcon: () => <></>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
