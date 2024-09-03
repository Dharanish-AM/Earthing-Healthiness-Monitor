const axios = require("axios");

const CHIRPSTACK_API_URL = "http://localhost:8080/api";
const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6ImE0NjgzMmVhLTgzYWQtNGEwZi1hNGJhLTdhYzc0ZDkxMTAxYyIsInR5cCI6ImtleSJ9.guLasOHCM5WxnaEwnFrI8vj3idSWOb5Zf8-18W6cVk8"; // Replace with your ChirpStack API Key

const api = axios.create({
  baseURL: CHIRPSTACK_API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

async function getApplications() {
  try {
    const response = await api.get("/applications");
    console.log("Applications:", response.data);
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
}
setInterval(getApplications, 5000);
