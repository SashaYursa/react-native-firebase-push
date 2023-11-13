import { View, Text, Alert, Button, TextInput } from "react-native";
import { useEffect, useState } from "react";
import {PermissionsAndroid} from 'react-native';
import messaging from "@react-native-firebase/messaging";
import firestore from '@react-native-firebase/firestore';
async function saveTokenToDatabase(token: string) {
  await firestore()
  .collection('tokens')
  .where('token', '==', token)
  .get()
  .then(async res => {
    const oldTokens = res.docs
    if(oldTokens.length === 0){
      await firestore()
      .collection('tokens')
      .add({token});      
    }
    else{
      console.log('token is exist')
    }
  })
}


const App = () => {
  const [userName, setUserName] = useState('')
  const [message, setMessage] = useState('')
  const [tokens, setTokens] = useState([])
  const getToken =  async () => {
    const token = await messaging().getToken();
    await saveTokenToDatabase(token)
  }

  const getPermission = async () => {
    const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    console.log(permission)
  }
  
  const getTokens = async () => {
  return await firestore()
  .collection('tokens')
  .get().then(data => {
    const tokensData = data.docs.map(tokenData => tokenData.data())
    setTokens(tokensData)
  })
  }

  const sendMessage  = async ({token}) => {
    const data =  JSON.stringify({
      token,
      body: userName,
      title: message,
    }) 
    await fetch('http://192.168.0.111:5000/send', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: data
    })
  } 


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
    });
    getToken();
    getTokens();
    return unsubscribe;

  }, []);
  return(
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <TextInput placeholder="username..." style={{marginBottom: 20, width: 300, backgroundColor: '#eaeaea'}} value={message} onChangeText={setMessage} />        
      <TextInput placeholder="data..." style={{marginBottom: 20, width: 300, backgroundColor: '#eaeaea'}} value={userName} onChangeText={setUserName} />        
      {tokens.map((token, id) => {
        return(
          <View style={{marginBottom: 10}}>
            <Button onPress={() => sendMessage(token)} title={`${id + 1} send message`}></Button>
          </View>
        )
      })}
    </View>
  )
}

export default App;