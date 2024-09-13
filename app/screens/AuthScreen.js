import styles from "../styles";
import { Button, Text, TextInput, View } from "react-native";
import { useState } from "react";
import axios from "axios";

function AuthScreen({ navigation }) {
  const [technicianid, setTechnicianId] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    navigation.navigate("Home");
    if (!technicianid || !password) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.150:8000/technicianlogin",
        {
          tid: technicianid,
          tpassword: password,
        }
      );

      const data = response.data;
      if (data.message === "Login successful") {
        console.log("Login successful");
        navigation.navigate("Home");
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
      <Text>Earthing Tracking Alert System</Text>
      <Text>LOGIN PORTAL</Text>

      <TextInput
        style={styles.inputcontainer}
        placeholder="Enter your ID..."
        value={technicianid}
        onChangeText={setTechnicianId}
      />

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
  );
}

export default AuthScreen;
