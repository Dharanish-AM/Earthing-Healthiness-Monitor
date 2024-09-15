import { useEffect, useState } from "react";
import styles from "../styles";
import { View, Text, Button } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MainScreen({ navigation }) {
  const [errorpole, setErrorPole] = useState([]);

  useEffect(() => {
    async () => {
      const storedTechnician = await AsyncStorage.getItem("technician");
      if (storedTechnician == null) {
        navigation.navigate("AuthScreen");
      }
      console.log("Stored Technician:", storedTechnician);
    };
    async function getPoleHistoryData() {
      try {
        const response = await axios.get("http://192.168.1.150:8000/gettask", {
          params: {
            technician_id: storedTechnician.name,
          },
        });
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
      <Button
        title="LOGOUT !"
        onPress={() => {
          AsyncStorage.removeItem("technician");
          navigation.navigate("AuthScreen");
        }}
      />
    </View>
  );
}

export default MainScreen;
