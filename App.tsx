/**
 * Vehicle Maintenance Tracker App
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens (will create them)
import HomeScreen from './screens/HomeScreen';
import AddEditServiceScreen from './screens/AddEditServiceScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './theme';

const Stack = createStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
                elevation: 0, // Android shadow
                shadowOpacity: 0, // iOS shadow
                borderBottomWidth: 0, // Remove hairline border
              },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: {
                fontWeight: '600',
                color: theme.colors.primary,
              },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="AddEditService" component={AddEditServiceScreen} options={{ title: 'Service Entry' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// const styles = StyleSheet.create({
//   // Add styles if needed
// });

export default App;
