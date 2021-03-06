import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Header from "./components/Header";
import GameOver from "./screens/GameOver";
import GameScreen from "./screens/GameScreen";
import StartGameScreen from "./screens/StartGameScreen";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

// Function returns promise
const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  }).catch((error) =>
    Alert.alert(
      "Font error!",
      `Error occurred while loading fonts in App.js. \nError message: ${error.message}`,
      [{ text: "OK", style: "destructive" }]
    )
  );
};

const App = () => {
  const [userNumber, setUserNumber] = useState();
  const [isGameOver, setIsGameOver] = useState(false);
  const [pastGuesses, setPastGuesses] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateLayout);

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  }, []);

  const handleGameStart = (enteredNumber) => {
    setUserNumber(enteredNumber);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleSameNumberGameRestart = () => {
    setPastGuesses([]);
    setIsGameOver(false);
  };

  const handleNewNumberGameRestart = () => {
    setUserNumber(null);
    setPastGuesses([]);
    setIsGameOver(false);
  };

  const handleNewGuess = (newGuess) => {
    setPastGuesses((prev) => [newGuess, ...prev]);
  };

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(error) => console.error(error)}
      />
    );
  }

  let content = <StartGameScreen onGameStart={handleGameStart} />;

  if (userNumber) {
    content = (
      <GameScreen
        userNumber={userNumber}
        onGameOver={handleGameOver}
        attemptCount={pastGuesses.length}
        onNewGuess={handleNewGuess}
        pastGuesses={pastGuesses}
        availableDeviceWidth={availableDeviceWidth}
        availableDeviceHeight={availableDeviceHeight}
      />
    );
  }
  if (isGameOver) {
    content = (
      <GameOver
        attemptCount={pastGuesses.length}
        onSameNumberGameRestart={handleSameNumberGameRestart}
        onNewNumberGameRestart={handleNewNumberGameRestart}
        availableDeviceWidth={availableDeviceWidth}
        availableDeviceHeight={availableDeviceHeight}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="GUESS A NUMBER!" subtitle="but by a phone" />
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginBottom: 8,
  },
});

export default App;
