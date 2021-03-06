import React from 'react';
import qs from 'qs';
import {
    View,
    AppRegistry,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import {doPost} from './net/net'
import {Headers, fetch} from 'fetch'
import {StackNavigator, TabNavigator} from 'react-navigation';
import Control from './page/control';
import DeviceList from './page/deviceList';
import Register from './page/register';
import SetPasswordScreen from './page/setPassword'
import Spinner from 'react-native-loading-spinner-overlay';
import {saveUser, getUser} from './storage/SWCStorage.js'
import Toast, {DURATION} from 'react-native-easy-toast'

import dismissKeyboard from 'dismissKeyboard';




var Dimensions = require('Dimensions');
//获取屏幕宽度
var screenWidth = Dimensions.get('window').width;

class LoginScreen extends React.Component {
    static navigationOptions = {
        title: '登录',
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isPassword: true,
            visible: false,
            loading: false
        };
    }

    componentDidMount() {
        getUser().then(user => {
            this.setState({username: user.username, password: user.password})
        }).catch(err => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        // TODO;
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            }
        )
    }

    makeRegister = () => {
        this.props.navigation.navigate('Register');
    }
    makeLogin = () => {
        dismissKeyboard();
        this.setState({visible: true});
        const {username, password} = this.state;
        const {navigate} = this.props.navigation;
        var params = {
            "username": username,
            "password": password,
        };

        doPost('user/login', params)
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({visible: false});
                if (responseJson.status === 1) {
                    const token = responseJson.data[0].token
                    const userId = responseJson.data[0].user.id
                    var user = {token: token, userId: userId, username: username, password: password}
                    saveUser(user)
                    navigate('DeviceList');
                } else {
                    this.refs.toast.show('用户名或密码错误');
                }

            })
            .catch((error) => {
                this.setState({visible: false});
                console.error(error);
            });
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                {/** 用于放置顶部的大图片 */}
                <View style={styles.topViewContainer}>
                    <Image source={require('./img/logo.png')}
                           style={styles.topImageStyle}/>
                </View>

                <View style={styles.textInputContianer}>
                    <TextInput
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={{flex: 1, marginLeft: 10}}
                        placeholder="请输入账号"
                        value={this.state.username}
                        onChangeText={(username) => this.setState({username})}
                    />

                </View>

                <View style={styles.textInputContianer}>
                    <TextInput
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={{flex: 1, marginLeft: 10}}
                        value={this.state.password}
                        password={this.state.isPassword}
                        placeholder="请输入密码"
                        onChangeText={(password) => this.setState({password})}
                    />

                </View>
                {/** 用于与登录相关的按钮 */}

                {/**手机号登录*/}
                <TouchableHighlight style={styles.loginByPhoneBtnContianer} onPress={this.makeLogin}>
                    <Text
                        style={styles.loginByPhoneBtnTitle}
                    >手机号登录</Text>
                </TouchableHighlight>
                {/**立即注册*/}
                <TouchableHighlight onPress={this.makeRegister} style={styles.registeredBtnContianer}>
                    <Text style={styles.registeredBtnTitle}>立即注册</Text>
                </TouchableHighlight>

                <Spinner visible={this.state.visible} textContent={""} textStyle={{color: '#FFF'}}/>
                <Toast position='center' ref="toast"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    //顶部样式
    topViewContainer: {
        //距离顶部高度
        marginTop: 22,
        alignItems: 'center',

    },
    //底部样式
    bottomViewContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    //顶部图片的样式
    topImageStyle: {
        width: screenWidth * 0.5,
        height: screenWidth * 0.3,
    },
    //手机号登录容器样式
    loginByPhoneBtnContianer: {
        backgroundColor: '#44BBA3',
        width: screenWidth - 30,
        height: 40,
        marginTop: 20,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    //按钮文字样式
    loginByPhoneBtnTitle: {
        color: 'white',
        fontSize: 18
    },
    //立即注册按钮容器样式
    registeredBtnContianer: {
        width: screenWidth - 30,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#44BBA3',
        borderWidth: 0.5,
        marginLeft: 15,
        marginTop: 10
    },
    //输入框容器样式
    textInputContianer: {
        width: screenWidth - 30,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#272B3C',
        borderWidth: 0.5,
        marginTop: 10,
        marginLeft: 15
    },
    //立即注册按钮文字样式
    registeredBtnTitle: {

        color: '#44BBA3',
        justifyContent: 'center',
        fontSize: 18,
        alignItems: 'center',
        textAlign: 'center',

    },
    //其他登录方式的容器
    loginByOtherContianer: {
        width: screenWidth,
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    //横线
    loginByOtherLine: {
        backgroundColor: '#999999',
        height: 1,
        width: screenWidth * 0.25,
        marginLeft: 10,
        marginRight: 10
    },
    //第三方登录按钮容器
    socialLoginBtnContianer: {
        flexDirection: 'row',
        marginTop: 10

    },
    //第三方登录按钮的样式
    socialLoginBtnStyle: {
        width: 40,
        height: 40,
        margin: 5
    },
    //其他登录方式的提示
    otherLoginHintLabel: {
        color: '#505050',
        fontSize: 13
    }
});


const HomeNavi = StackNavigator({
    LoginScreen: {screen: LoginScreen},
    DeviceList: {screen: DeviceList},
    Register: {screen: Register},
    ControlScreen: {screen: Control},
    SetPasswordScreen: {screen: SetPasswordScreen}
});
export default HomeNavi;

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('SWCRN', () => HomeNavi);
