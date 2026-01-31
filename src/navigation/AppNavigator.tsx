import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from "react-error-boundary";
import { NavigationContainer } from '@react-navigation/native';

// Your App Context (Keep this!)
import AppContextProvider from './src/context/AppContextProvider'; 
// Your new Native Navigator (Create this next)
import RootNavigator from './src/navigation/RootNavigator'; 
import { ErrorFallback } from './src/components/ErrorFallback';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppContextProvider>
          <NavigationContainer>
            {/* This replaces your <Routes> and <HashRouter> */}
            <RootNavigator />
          </NavigationContainer>
        </AppContextProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
