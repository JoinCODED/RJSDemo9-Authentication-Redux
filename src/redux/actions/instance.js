import axios from "axios";

const instance = axios.create({
  baseURL: "https://precious-things.herokuapp.com"
});

export default instance;
