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

export function operationDevice(operation_id,state){
  const url = 'http://localhost:8080/device/'+room_id+'/operation'
  const headers = new Headers();
  var params = {
    room_id:state.room_id,
    operation_id:operation_id,
    power:state.power,
    mode:state.mode,
    wind:state.wind,
    power:state.power
  }
  headers.append('Content-Type','application/x-www-form-urlencoded');
  const init = {
    method: "POST",
    headers,
    mode:"cors",
    body:qs.stringify(params)
  }
  return fetch(url,init).then((response) => response.json())
}

export function setRoom(api,room_id,params){
  const url = 'http://localhost:8080/device/'+room_id+'/'+api
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
