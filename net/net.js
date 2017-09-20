import qs from 'qs'
import React from 'react';
import {fetch,Headers} from 'fetch'
import Storage from 'react-native-storage';

export function doPost(api,params){
  const url = 'http://115.28.242.24:8080/SWC_AC/'+api;
  const headers = new Headers();
  headers.append('Content-Type','application/x-www-form-urlencoded');
  const init = {
    method: "POST",
    headers,
    mode:"cors",
    body:qs.stringify(params)
  }
  return fetch(url,init).then((response) => response.json())
}


export function doGet(api,params){
  const url = 'http://115.28.242.24:8080/SWC_AC/'+api;
  const headers = new Headers();
  headers.append('Content-Type','application/x-www-form-urlencoded');
  const init = {
    method: "Get",
    headers,
    mode:"cors",
  }
  return fetch(url,init).then((response) => response.json())


  fetch(url, {
    method: "POST",
    mode:"cors",
    headers,
    body: qs.stringify(params)
}).then((response) => response.json())
  .then((responseJson) => {
    navigate('DeviceList');
  })
  .catch((error) => {
    console.error(error);
  });
}
