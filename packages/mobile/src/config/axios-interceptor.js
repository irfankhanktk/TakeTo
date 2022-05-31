
import TAKE_2_API from '@khan_ahmad786/common/api/API';
import services from '@khan_ahmad786/common/api/services';
import axios from '@khan_ahmad786/common/utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CancelToken = axios.CancelToken;
source = CancelToken.source();
client = axios.create({
  baseURL: services.base_url,
});
messangerClient = axios.create({
  baseURL: services.chat_base_url,
});

//Axios Interceptors
client.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@token');
    config.headers = {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'multipart/form-data, application/json',
    };

    config.params = config.params || {};
    config.cancelToken = source.token || {};
    if (JSON.parse(token)) {
      config.headers['Authorization'] =
        `Bearer ` + JSON.parse(token)?.access_token;
    }
    return config;
  },
  error => {
    console.log('I am here');
    Promise.reject(error);
  },
);

client.interceptors.response.use(
  response => {
    // AsyncStorage.clear();

    console.log('RESPONSE INTERCPTOR : ', response?.status);
    return response;
  },
  async function (error) {
    console.log('INTERCEPTOR ERROR RESPONSE : ', error?.response?.status);
    console.log('INTERCEPTOR ERROR RESPONSE CONFIG: ', error?.config);
    const token = await AsyncStorage.getItem('@token');


    const originalRequest = error.config;
    if (error?.response?.status === undefined && error?.config === undefined) {
      return Promise.reject('Hi Dude');
    } else if (error?.response?.status === 401) {
      originalRequest._retry = true;
      const tokenInfo = await TAKE_2_API.tokenRefresh(
        JSON.parse(token)?.refresh_token,
      );
      console.log("Token info: ", tokenInfo)
      if (tokenInfo) {
        await AsyncStorage.setItem('@token', JSON.stringify(tokenInfo));
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + tokenInfo?.access_token;
        return client(originalRequest);
      } else {
        // source.cancel('Operation canceled by the user.');
        AsyncStorage.multiRemove(['@token']).then(res => {
          // props.navigation.navigate('signIn');
          setTimeout(() => {
            global.navLinking.reset({ index: 0, routes: [{ name: 'login' }] });
          }, 1000);

        });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);


//Axios Interceptors
messangerClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@token');
    config.headers = {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'multipart/form-data, application/json',
    };

    config.params = config.params || {};
    config.cancelToken = source.token || {};
    if (JSON.parse(token)) {
      config.headers['Authorization'] =
        `Bearer ` + JSON.parse(token)?.access_token;
    }
    return config;
  },
  error => {
    console.log('I am here');
    Promise.reject(error);
  },
);

messangerClient.interceptors.response.use(
  response => {
    // AsyncStorage.clear();

    console.log('RESPONSE INTERCPTOR : ', response?.status);
    return response;
  },
  async function (error) {
    console.log('INTERCEPTOR ERROR RESPONSE : ', error?.response?.status);
    console.log('INTERCEPTOR ERROR RESPONSE CONFIG: ', error?.config);
    const token = await AsyncStorage.getItem('@token');
    const originalRequest = error.config;
    console.log('INTERCEPTOR ERROR : ', error);

    if (error?.response?.status === undefined && error?.config === undefined) {
      return Promise.reject('Hi Dude');
    } else if (error?.response?.status === 401) {
      originalRequest._retry = true;
      const tokenInfo = await TAKE_2_API.tokenRefresh(
        JSON.parse(token)?.refresh_token,
      );
      console.log("Token info: ", tokenInfo)
      if (tokenInfo) {
        await AsyncStorage.setItem('@token', JSON.stringify(tokenInfo));
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + tokenInfo?.access_token;
        return client(originalRequest);
      } else {
        // source.cancel('Operation canceled by the user.');
        AsyncStorage.multiRemove(['@token']).then(res => {
          // props.navigation.navigate('signIn');
          setTimeout(() => {
            global.navLinking.reset({ index: 0, routes: [{ name: 'login' }] });
          }, 1000);

        });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
