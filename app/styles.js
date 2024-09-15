import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import '@fontsource/montserrat'; // Defaults to weight 400.

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  heading: {
    width: "95%",
    height: "30%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headingInnerContainer: {
    height: "50%",
    width: "100%",
  },
  content: {
    height: "70%",
    width: "87%",
    flexDirection: "column",
  },
  headingText: {
    fontSize: "40vw",
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  inputcontainer: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  contentLogin: {
    padding : "2vh",
    backgroundColor: "red",
  },
  contentLoginText: {
    fontSize: "30vw",
    fontWeight: "600",
    color: "#888888",
    marginBottom: "5vh",
  },
  contentText: {
    fontSize: "20vw",
  },
});

export default styles;
