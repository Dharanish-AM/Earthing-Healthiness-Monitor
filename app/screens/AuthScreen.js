import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP } from "@env";
import { TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { useFonts } from "expo-font";

function AuthScreen({ navigation }) {
  const [technicianId, setTechnicianId] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const technician = await AsyncStorage.getItem("technician");
      if (technician) {
        navigation.replace("HomeScreen");
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  async function handleSubmit() {
    if (!technicianId || !password) {
      console.log("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://${IP}:8000/technicianlogin`, {
        tid: technicianId,
        tpassword: password,
      });

      const data = response.data;
      if (data.message === "Login successful") {
        console.log("Login successful");
        await AsyncStorage.setItem(
          "technician",
          JSON.stringify(data.technician)
        );
        navigation.replace("HomeScreen");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.heading}>
          <Text style={styles.headingText}>
            Earthing Healthiness Monitoring
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentLoginText}>LOGIN PORTAL</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>TECHNICIAN ID</Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="Enter your ID..."
              value={technicianId}
              onChangeText={setTechnicianId}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputText}>PASSWORD</Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="Enter your Password..."
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: "6%",
  },
  heading: {
    marginBottom: "10%",
    alignItems: "center",
  },
  headingText: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  contentLoginText: {
    color: "#888888",
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  inputText: {
    color: "#888888",
    fontSize: 27,
  },
  inputContainer: {
    paddingLeft: "2%",
    width: "100%",
    borderColor: "grey",
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 4,
    textAlign: "left",
    fontSize: 18,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#A52A2A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
  },
  forgotPassword: {
    color: "grey",
    fontSize: 15,
    marginTop: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 18,
  },
});

export default AuthScreen;
