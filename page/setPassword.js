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
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AndroidSMS from './module/AndroidSMSModule'
import { EventEmitter } from 'events';
import {doPost} from '../net/net'
import {Headers,fetch} from 'fetch'
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator ,TabNavigator,NavigationActions} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'


import Storage from 'react-native-storage';

var Dimensions = require('Dimensions');
//获取屏幕宽度
var screenWidth = Dimensions.get('window').width;

const {MobSMS} = NativeModules;
// Event emitter to dispatch request and response from WeChat.
const emitter = new EventEmitter();

const smsNativeEvent = new NativeEventEmitter(MobSMS);  //创建自定义事件接口

let smsListener = smsNativeEvent.addListener('mobSMSEvent', (resp) => emitter.emit('commitVerificationCode.Resp',resp));  //对应了原生端的名字

export default class SetPasswordScreen extends React.Component {
  static navigationOptions = {
    title:'设置密码',
  };

  constructor(props){
    super(props);
   this.state = {
     username:this.props.navigation.state.params.username,
     checkPassword: '',
     password:'',
     code:'获取验证码',
     isPassword:true,
     visible:false,
     loading: false
   };
  }

  makeRegister=()=>{
    this.setState({visible:true})
    const {navigate} = this.props.navigation
    if (this.state.password === '') {
      this.setState({visible:false})
      this.refs.toast.show('密码不一致');
    }else if (this.state.password === this.state.checkPassword) {
      var params = {
        phoneNum:this.state.username,
        option:'regist',
        password:this.state.password
      }
      console.log(params)
      doPost('user/registOption',params)
      .then((responseJson) => {
        this.setState({visible:false})
        console.log(responseJson);
        if(responseJson.status === 1){
          navigate('LoginScreen');
        }else {
          this.refs.toast.show(responseJson.message);
        }

      })
      .catch((error) => {
        this.setState({visible:false})
        console.error(error);
      });

    }else {
      this.setState({visible:false})
      this.refs.toast.show('密码输入不一致');
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
        placeholder="请输入密码"
        value={this.state.password}
        onChangeText={(password) => this.setState({password:password})}
      />

      </View>

      <View style={styles.textInputContianer}>
      <TextInput
      style = {{flex:1,marginLeft:10}}
        placeholder="请确认密码"
        value={this.state.checkPassword}
        onChangeText={(checkPassword) => this.setState({checkPassword:checkPassword})}
      />
      </View>

      {/** 用于与登录相关的按钮 */}
          {/**立即注册*/}
          <TouchableHighlight onPress={this.makeRegister} style={styles.loginByPhoneBtnContianer}>
              <Text style={styles.loginByPhoneBtnTitle}>立即注册</Text>
          </TouchableHighlight>
          <Spinner visible={this.state.visible} textContent={""} textStyle={{color: '#FFF'}} />
          <Toast position='center' ref="toast"/>
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
