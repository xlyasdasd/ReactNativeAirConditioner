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
  AsyncStorage,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {doPost} from '../net/net'
import {Headers,fetch} from 'fetch'
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator ,TabNavigator} from 'react-navigation';

import Storage from 'react-native-storage';

var Dimensions = require('Dimensions');
//获取屏幕宽度
var screenWidth = Dimensions.get('window').width;

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title:'注册',
  };
  constructor(props){
    super(props);
   this.state = {
     username: '',
     password:'',
     isPassword:true,
     loading: false
  };
  }

  makeRegister=()=>{

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
        onChangeText={(username) => this.setState({username})}
      />

      </View>

      <View style={styles.textInputContianer}>
      <TextInput
        style = {{flex:1,marginLeft:10}}
         value={this.state.password}
        password = {this.state.isPassword}
        placeholder="请输入密码"
        onChangeText={(password) => this.setState({password})}
      />

      </View>
      {/** 用于与登录相关的按钮 */}
          {/**立即注册*/}
          <TouchableHighlight onPress={this.makeRegister} style={styles.loginByPhoneBtnContianer}>
              <Text style={styles.loginByPhoneBtnTitle}>立即注册</Text>
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