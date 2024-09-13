import { useEffect, useState } from "react";
import styles from "../styles";
import { View, Text } from "react-native";
import axios from "axios";

function MainScreen() {
  const [errorpole, setErrorPole] = useState([]);

  useEffect(() => {
    async function getPoleHistoryData() {
      try {
        const response = await axios.get(
          "http://192.168.1.150:8000/gethistoryinfo"
        );
        console.log(response.data);
      
      } catch (error) {
        setErrorPole(error.message);
      }
    }

    getPoleHistoryData();

    const intervalId = setInterval(getPoleHistoryData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the app</Text>
    </View>
  );
}

export default MainScreen;
