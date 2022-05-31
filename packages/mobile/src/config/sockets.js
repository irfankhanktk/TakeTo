import Echo from 'laravel-echo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pusher from 'pusher-js/react-native';



let anotherEcho;
export const connectEcho = async (userId) => {

    const token = await AsyncStorage.getItem('@token');

    Pusher.logToConsole = true;
    let push = new Pusher('11c01f9e26f24ccd6063', {
      wsHost: '88.198.152.58',
      wsPort: '6001',
      wssPort: '6001',
      cluster: 'us2',
      enabledTransports: ['ws'],
      forceTLS: false,
      authEndpoint: 'https://api.taketo.exodevs.com/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(token)?.access_token,
        },
      },
    });

      anotherEcho = new Echo({
      broadcaster: 'pusher',
      client: push,
      key: '11c01f9e26f24ccd6063',
      disableStats: true,
      forceTLS: false,
      authEndpoint: 'https://api.taketo.exodevs.com/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(token)?.access_token,
        },
      },
    });
    
    anotherEcho.connect();
   
    //alert(anotherEcho?.socketId)
    let newChannel = anotherEcho.private('messenger.user.' + userId);
    const echo = {
      newChannel : newChannel,
      anotherEcho : anotherEcho 
    }
    
    return echo
}

export const disconnectEcho = async () => {
  console.log('antoher echo::',anotherEcho);
  anotherEcho.disconnect();
}

export const echo= {
anotherEcho
}