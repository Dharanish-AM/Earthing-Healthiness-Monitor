import styles from "../styles";
import { Button, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AuthScreen({ navigation }) {
  const [technicianId, setTechnicianId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkUser() {
      const technician = await AsyncStorage.getItem("technician");
      console.log(technician);
      if (technician) {
        navigation.navigate("HomeScreen");
      }
    }
    checkUser();
  }, []);

  async function handleSubmit() {
    if (!technicianId || !password) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.150:8000/technicianlogin",
        {
          tid: technicianId,
          tpassword: password,
        }
      );

      const data = response.data;
      if (data.message === "Login successful") {
        console.log("Login successful");
        await AsyncStorage.setItem(
          "technician",
          JSON.stringify(data.technician)
        );

        navigation.navigate("HomeScreen");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingInnerContainer}>
          <Text style={styles.headingText}>Earthing Tracking Alert System</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.contentLogin}>
          <Text style={styles.contentLoginText}>LOGIN PORTAL</Text>
        </View>

        <Text style={styles.contentText}>TECHNICIAN ID</Text>
        <TextInput
          style={styles.inputcontainer}
          placeholder="Enter your ID..."
          value={technicianId}
          onChangeText={setTechnicianId}
        />
        <Text>PASSWORD</Text>
        <TextInput
          style={styles.inputcontainer}
          placeholder="Enter your Password..."
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={handleSubmit} />

        <Text>Forgot Password? Click Here</Text>
      </View>
    </View>
  );
}

export default AuthScreen;
