import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import {saveUser, getUser,saveInstance} from '../storage/SWCStorage';
import CheckBox from 'react-native-checkbox';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';
import { StackNavigator } from 'react-navigation';
import {operationDevice} from '../net/net'
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

class LoginScreen extends React.Component {

  static navigationOptions = ({ navigation })=>({
    title: `操作设备 ${navigation.state.params.name}`,
  });
  constructor(props){
    super(props);
   this.state = {
     userID:'',
     token:'',
     sign_id:'',
     temp: 18,
     power:true,//false关机 true开机
     wind:'1',//0自动 1低速 2中速 3 高速
     mode: '1',//0制冷 1制热 2新风 3除湿
     sign_id:this.props.navigation.state.params.sign_id,
     currentRoomId:this.props.navigation.state.params.device_room[0].room_id,
     currentDevice:this.props.navigation.state.params.device_room[0].name
  };
  }

  componentDidMount() {
    getUser().then(ret => {
        this.setState({userId:ret.userId,token:ret.token})
        this.selectRoom(this.state.currentRoomId,ret.token);
    }
  ).catch(err => {

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

  powerOnChecked = ()=>{
      this.setState({power:true})
  }
  powerOffChecked = ()=>{
      this.setState({power:false})
  }
  setWind = (wind)=>{

  }
  setMode = (mode)=>{

  }
  tempUp = ()=>{
    let temp = this.state.temp;
    if (temp<32) {
      temp++;
      this.setState({temp:temp})
    }
    }
    tempDown = ()=>{
      let temp = this.state.temp;
      if (temp>16) {
        temp--;
        this.setState({temp:temp})
      }
    }
    // 设置当前房间
  selectRoom = (room_id,name)=>{
      // console.log(name);
        this.setState({currentDevice:name});
        this.setState({currentRoomId:room_id})
        const api = 'set'
        let params = {token:this.state.token,sign_id:this.state.sign_id}
        operationDevice('set',room_id,params).then((responseJson)=>{
          console.log(responseJson)
        })
  }
  render() {

    const { params } = this.props.navigation.state;
    let temp = this.state.temp;
    let powerOff = !this.state.power;
    let powerOn = this.state.power;

    return (
      <MenuContext>
      <View style={{backgroundColor:'#44BBA3',flexDirection:'column',flex:1}}>
        <View style={{width:screenWidth,height:50}}>
          <Menu>
               <MenuTrigger style={{height:50,justifyContent:'center',alignItems:'center'}}>
                   <Text style={{color:'#FFF'}}>当前设备: {this.state.currentDevice}</Text>
               </MenuTrigger>
               <MenuOptions>
                 {params.device_room.map((menuOptionItem,i) => <MenuOption key = {i} onSelect={() => this.selectRoom(menuOptionItem.room_id,menuOptionItem.name)} text={menuOptionItem.name}/>)}
               </MenuOptions>
             </Menu>
          </View>
      <View style = {styles.container}>
        <View style = {{flex:2,alignItems:'center',flexDirection:'row'}}>
            <TouchableOpacity style = {styles.topViewContainer} onPress={this.tempUp}>
              <Text style = {{color:'#FFF',fontSize:25}}>
                +
              </Text>
            </TouchableOpacity>

            <View style = {styles.topViewContainer}>
              <Text style = {{color:'#FFF',fontSize:30}}>
                    {temp}度
              </Text>
            </View>
            <TouchableOpacity style = {styles.topViewContainer} onPress={this.tempDown}>
              <Text style = {{color:'#FFF',fontSize:25}}>
                -
              </Text>
            </TouchableOpacity>
        </View>
        <View style= {{width:screenWidth,height:1,backgroundColor:'#FFF'}}/>
            <View style={{flex:3,flexDirection:'row'}}>
              {/* 开关机 */}
                <View style={styles.bottomViewContainer}>
                      <CheckBox
                        label='开机'
                        labelStyle={{color:'#FFF'}}
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        onChange={this.powerOnChecked}
                        checked={powerOn}
                      />
                      <CheckBox
                        label='关机'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.powerOffChecked}
                        checked={powerOff}
                      />
                </View>
                {/* 开关机 */}
                <View style={{marginTop:10,bottom:10,width:1,backgroundColor:'#FFF'}}/>
                {/* 风速 */}
                <View style={styles.bottomViewContainer}>
                      <CheckBox
                        label='自动'
                        labelStyle={{color:'#FFF'}}
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        onChange={this.setWind(0)}
                        checked={powerOn}
                      />
                      <CheckBox
                        label='低速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setWind(1)}
                        checked={powerOff}
                      />
                      <CheckBox
                        label='中速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setWind(2)}
                        checked={powerOff}
                      />
                      <CheckBox
                        label='高速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setWind(3)}
                        checked={powerOff}
                      />
                </View>
                {/* 风速 */}
                      <View style={{marginTop:10,bottom:10,width:1,backgroundColor:'#FFF'}}/>
                {/* 模式 */}
                <View style={styles.bottomViewContainer}>
                      <CheckBox
                        label='制冷'
                        labelStyle={{color:'#FFF'}}
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        onChange={this.setMode(0)}
                        checked={powerOn}
                      />
                      <CheckBox
                        label='制热'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setMode(1)}
                        checked={powerOff}
                      />
                      <CheckBox
                        label='新风'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setMode(2)}
                        checked={powerOff}
                      />
                      <CheckBox
                        label='除湿'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={this.setMode(3)}
                        checked={powerOff}
                      />
                </View>
                {/* 模式 */}
            <View/>
        </View>
      </View>
      {/* 最外层 */}
    </View>
  </MenuContext>

    );


 
  }

}
const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        backgroundColor: '#44BBA3',
        flex:1
    },
    topViewContainer:{
      alignItems:'center',
      flex:1
    },
    bottomViewContainer:{
      marginTop:15,
      alignItems:'center',
      flex:1,
      flexDirection:'column'
    },
    checkBox:{

    }
});
const Login = LoginScreen
export default Login;
