import axios from "axios";
import Qs from "qs";
import Router from "../router";

axios.defaults.timeout = 5000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.baseURL = "http://127.0.0.1:8081";

axios.interceptors.request.use(
  config => {
    let token = localStorage["token"];
    // console.log(token);

    if (token != undefined) {
      config.headers["Authorization"] = token;
    }

    if (config.method === "get") {
      config.params["t"] = Math.random();
      // console.log(config);
      config.data = Qs.stringify(config.params);
      //   config.data = JSON.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  res => {
    if (res.data.code !== 200) {
      console.error(res.data.message);
      if (res.data.code == 401) {
        console.log("logger");

        Router.replace("/Login");
      }
    }
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export function post(api, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(api, params)
      .then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}

export function get(api, data) {
  return new Promise((resolve, reject) => {
    axios
      .get(api, { params: data })
      .then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
