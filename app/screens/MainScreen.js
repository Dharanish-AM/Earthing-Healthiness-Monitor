import { useEffect, useState } from "react";
import styles from "../styles";
import { View, Text, Button } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP } from "@env";

function MainScreen({ navigation }) {
  const [errorpole, setErrorPole] = useState([]);
  const [task, settask] = useState({});

  useEffect(() => {
    let intervalId;

    async function getTechnicianAndData() {
      const storedTechnician = await AsyncStorage.getItem("technician");

      if (!storedTechnician) {
        navigation.navigate("AuthScreen");
        return;
      }

      const technician = JSON.parse(storedTechnician);

      const getPoleHistoryData = async () => {
        try {
          const response = await axios.get(`http://${IP}:8000/gettask`, {
            params: {
              technician_id: technician.technician_id,
            },
          });
          console.log(response.data.task);
          settask(response.data.task);
        } catch (error) {
          setErrorPole(error.message);
        }
      };

      await getPoleHistoryData();
      intervalId = setInterval(getPoleHistoryData, 60000);
    }

    getTechnicianAndData();

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
      <View>
        <Text style={styles.title}>Tasks</Text>
        <Text>{task.pole_id}</Text>
      </View>
    </View>
  );
}

export default MainScreen;
