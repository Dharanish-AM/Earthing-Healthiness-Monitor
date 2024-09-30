import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP } from "@env";

function MainScreen({ navigation }) {
  const [errorPole, setErrorPole] = useState("");
  const [task, setTask] = useState(null);

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
          setTask(response.data.task);
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

  if (errorPole) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {errorPole}</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the app</Text>
      <Button
        title="LOGOUT"
        onPress={() => {
          AsyncStorage.removeItem("technician");
          navigation.navigate("AuthScreen");
        }}
      />
      <View>
        <Text style={styles.title}>Tasks</Text>
        <Text>Pole ID: {task.pole_id}</Text>
        <Text>Location: {task.location}</Text>
        <Text>Severity: {task.severity}</Text>
        <Text>Status: {task.status}</Text>
        <Text>Technician ID: {task.technician_id}</Text>
        <Text>Task Start Date: {task.taskstart_date}</Text>
        <Text>
          Task End Date: {task.taskend_date ? task.taskend_date : "N/A"}
        </Text>
        <Text>
          Coordinates:{" "}
          {Array.isArray(task.coordinates)
            ? task.coordinates.join(", ")
            : "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default MainScreen;
