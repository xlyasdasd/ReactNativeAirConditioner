import React from 'react';
import qs from 'qs';
import {
  View,
  Button,
  AppRegistry,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  AsyncStorage,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AndroidSMS from './module/AndroidSMSModule'
import { EventEmitter } from 'events';
import {doPost} from '../net/net'
import {Headers,fetch} from 'fetch'
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator ,TabNavigator} from 'react-navigation';
import {SetPasswordScreen} from './setPassword'

import Storage from 'react-native-storage';

var Dimensions = require('Dimensions');
//获取屏幕宽度
var screenWidth = Dimensions.get('window').width;

const {MobSMS} = NativeModules;
// Event emitter to dispatch request and response from WeChat.
const emitter = new EventEmitter();

const smsNativeEvent = new NativeEventEmitter(MobSMS);  //创建自定义事件接口

let smsListener = smsNativeEvent.addListener('mobSMSEvent', (resp) => emitter.emit('commitVerificationCode.Resp',resp));  //对应了原生端的名字

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title:'注册',
  };

  constructor(props){
    super(props);
   this.state = {
     username: '',
     password:'',
     code:'获取验证码',
     isPassword:true,
     loading: false
   };
  }

  componentDidMount(){
    if (Platform.OS == 'android') {
    AndroidSMS.registerSMS()
    }
  }
  componentWillUnmount(){
    if (Platform.OS == 'android') {
      AndroidSMS.unRegisterSMS()
    }else {
      smsListener.remove();
    }
  }

  sendCode=()=>{
    var params = {
        "phoneNum": this.state.username,
        "option": 'get',
    };

    doPost('user/registOption',params)//判断用户注册情况
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.status === 1){//用户未注册
        if (Platform.OS == 'android') {
          AndroidSMS.sendSMS('86',this.state.username)//Android发送验证码
        }else if(Platform.OS == 'ios'){
          MobSMS.getVerificationCodeByMethod(0,this.state.username,'86',() => {});  //IOS发送验证码
        }
      }else {
        alert(responseJson.message)
      }

    })
    .catch((error) => {
      console.error(error);
    });

  }

  makeRegister=()=>{
     const { navigate } = this.props.navigation;
    if (Platform.OS == 'android') {
      AndroidSMS.confirmSMS('86',this.state.username,this.state.password)
    }else if(Platform.OS == 'ios'){
        MobSMS.commitVerificationCode(this.state.password,this.state.username,'86',() => {});
        emitter.once('commitVerificationCode.Resp', (resp) => {
            if (resp.code === 0) {
              navigate('SetPasswordScreen')
            }else {
              Alert.alert('验证码错误')
            }
        });
    //
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      {/** 用于放置顶部的大图片 */}
      <View style={styles.textInputContianer}>
      <TextInput
      style = {{flex:1,marginLeft:10}}
        placeholder="请输入账号"
        value={this.state.username}
        onChangeText={(username) => this.setState({username:username})}
      />

      </View>

      <View style={{
          flexDirection:'row',
          marginTop:10,
          marginLeft:15}}>
        <View style={{
          width:screenWidth -130,
          height:40,
          flexDirection:'row',
          alignItems: 'center',
          borderRadius:5,
          borderColor:'#272B3C',
          borderWidth:0.5,
          }}>
        <TextInput
          style = {{flex:1,marginLeft:10}}
           value={this.state.password}
          password = {this.state.isPassword}
          placeholder="请输入验证码"
          onChangeText={(password) => this.setState({password})}
        />
        </View>

        <Button onPress={this.sendCode} title={this.state.code} style={{width:100,backgroundColor:'#44BBA3'}}></Button>
      </View>

      {/** 用于与登录相关的按钮 */}
          {/**立即注册*/}
          <TouchableHighlight onPress={this.makeRegister} style={styles.loginByPhoneBtnContianer}>
              <Text style={styles.loginByPhoneBtnTitle}>确认</Text>
          </TouchableHighlight>

  </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex:1
    },
    //顶部样式
    topViewContainer: {
        //距离顶部高度
        marginTop:22,
        alignItems:'center',

    },
    //底部样式
    bottomViewContainer: {
        flex:2,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    //顶部图片的样式
    topImageStyle:{
        width:screenWidth * 0.5,
        height:screenWidth * 0.3,
    },
    //手机号登录容器样式
    loginByPhoneBtnContianer:{
        backgroundColor:'#44BBA3',
        width:screenWidth -30,
        height:40,
        marginTop:20,
        marginLeft:15,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    //按钮文字样式
    loginByPhoneBtnTitle:{
        color:'white',
        fontSize:18
    },
    //立即注册按钮容器样式
    registeredBtnContianer:{
        width:screenWidth -30,
        height:40,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        borderColor:'#44BBA3',
        borderWidth:0.5,
        marginLeft:15,
        marginTop:10
    },
    //输入框容器样式
    textInputContianer:{
        width:screenWidth -30,
        height:40,
        flexDirection:'row',
        alignItems: 'center',
        borderRadius:5,
        borderColor:'#272B3C',
        borderWidth:0.5,
        marginTop:10,
        marginLeft:15
    },
    //立即注册按钮文字样式
    registeredBtnTitle:{

        color:'#44BBA3',
        justifyContent:'center',
        fontSize:18,
        alignItems:'center',
        textAlign: 'center',

    },
    //其他登录方式的容器
    loginByOtherContianer:{
        width:screenWidth,
        position:'absolute',
        bottom:20,
        alignItems:'center',
        justifyContent:'center',

    },
    //横线
    loginByOtherLine:{
        backgroundColor:'#999999',
        height:1,
        width:screenWidth*0.25,
        marginLeft:10,
        marginRight:10
    },
    //第三方登录按钮容器
    socialLoginBtnContianer:{
        flexDirection:'row',
        marginTop:10

    },
    //第三方登录按钮的样式
    socialLoginBtnStyle:{
        width:40,
        height:40,
        margin:5
    },
    //其他登录方式的提示
    otherLoginHintLabel:{
        color: '#505050',
        fontSize:13
    }
});
