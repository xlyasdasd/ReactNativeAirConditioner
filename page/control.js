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
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';
import { StackNavigator } from 'react-navigation';
import {setRoom ,operationDevice} from '../net/net'
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
     power:0,//0关机 1开机
     wind:1,//0自动 1低速 2中速 3 高速
     mode: 1,//0制热 1制冷 2除湿 3通风 4地暖 5地暖+制热
     visible:true,
     sign_id:this.props.navigation.state.params.sign_id,
     currentRoomId:this.props.navigation.state.params.device_room[0].room_id,
     currentDevice:this.props.navigation.state.params.device_room[0].name
  };
  }

  componentDidMount() {
    getUser().then(ret => {
        this.setState({userId:ret.userId,token:ret.token})
        console.log("获取用户数据成功")
        this.selectRoom(this.state.currentRoomId,this.state.currentDevice);
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

  powerOnChecked = (power)=>{
    console.log("nowPower===> "+power)
      this.setState({power:power}, () => {
        operationDevice(1,this.state).catch((e)=>{
          console.log(e)
        });
    // Do something here.
})
  }
  powerOffChecked = (power)=>{
      this.setState({power:power},() => {
        operationDevice(1,this.state).catch((e)=>{
          console.log(e)
        });
    // Do something here.
})
  }
  setWind = (wind)=>{
    this.setState({wind:wind},() => {
      operationDevice(4,this.state).catch((e)=>{
        console.log(e)
      });
  // Do something here.
})
  }
  setMode = (mode)=>{
    this.setState({mode:mode},() => {
      operationDevice(2,this.state).catch((e)=>{
        console.log(e)
      });
  // Do something here.
})
  }
  tempUp = ()=>{
    let temp = this.state.temp;
    if (temp<32) {
      temp++;
      this.setState({temp:temp},() => {
        operationDevice(8,this.state).catch((e)=>{
          console.log(e)
        });
      })
    }
    }
    tempDown = ()=>{
      let temp = this.state.temp;
      if (temp>16) {
        temp--;
        this.setState({temp:temp},() => {
          operationDevice(8,this.state).catch((e)=>{
            console.log(e)
          });
        })
      }
    }
    // 设置当前房间
  selectRoom = (room_id,name)=>{
      // console.log(name);
        this.setState({visible:true,currentDevice:name});
        this.setState({currentRoomId:room_id})
        const api = 'set'
        let params = {token:this.state.token,sign_id:this.state.sign_id}
        setRoom('set',room_id,params).then((res)=>{
          this.setState({visible:false,temp:res.data.temp,power:res.data.power,mode:res.data.mode,wind:res.data.wind})
          console.log(res)
        }).catch((e)=>{
          this.setState({visible:false})
          Alert.alert('设备不在线')
          console.log(e)
        });
  }
  render() {

    const { params } = this.props.navigation.state;
    let temp = this.state.temp;
    let powerOff = this.state.power === 0?true:false;
    let powerOn = this.state.power === 1?true:false;
    let autoWind = this.state.wind === 0?true:false;
    let lowWind = this.state.wind === 1?true:false;
    let midWind = this.state.wind === 2?true:false;
    let highWind = this.state.wind === 3?true:false;
    let hot = this.state.mode === 0?true:false;
    let cold = this.state.mode === 1?true:false;
    let dry = this.state.mode === 2?true:false;
    let wind = this.state.mode === 3?true:false;
    let floorHot = this.state.mode === 4?true:false;
    let warmHot = this.state.mode === 5?true:false;

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
                        onChange={()=>{this.powerOnChecked(1)}}
                        checked={powerOn}
                        underlayColor = '#44BBA3'
                      />
                      <CheckBox
                        label='关机'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.powerOffChecked(0)}}
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
                        onChange={()=>{this.setWind(0)}}
                        underlayColor = '#44BBA3'
                        checked={autoWind}
                      />
                      <CheckBox
                        label='低速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setWind(1)}}
                        checked={lowWind}
                      />
                      <CheckBox
                        label='中速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setWind(2)}}
                        checked={midWind}
                      />
                      <CheckBox
                        label='高速'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={()=>{this.setWind(3)}}
                        checked={highWind}
                        underlayColor = '#44BBA3'
                      />
                </View>
                {/* 风速 */}
                      <View style={{marginTop:10,bottom:10,width:1,backgroundColor:'#FFF'}}/>
                {/* 模式 */}
                <View style={styles.bottomViewContainer}>
                      <CheckBox
                        label='制热'
                        labelStyle={{color:'#FFF'}}
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        onChange={()=>{this.setMode(0)}}
                        underlayColor = '#44BBA3'
                        checked={hot}
                      />
                      <CheckBox
                        label='制冷'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setMode(1)}}
                        checked={cold}
                      />
                      <CheckBox
                        label='除湿'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setMode(2)}}
                        checked={dry}
                      />
                      <CheckBox
                        label='通风'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setMode(3)}}
                        checked={wind}
                      />
                      <CheckBox
                        label='地暖'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        underlayColor = '#44BBA3'
                        onChange={()=>{this.setMode(4)}}
                        checked={floorHot}
                      />
                      <CheckBox
                        label='热暖'
                        underlayColor = '#44BBA3'
                        checkedImage={require('../img/radioOn.png')}
                        uncheckedImage={require('../img/radioOff.png')}
                        labelStyle={{color:'#FFF'}}
                        onChange={()=>{this.setMode(5)}}
                        checked={warmHot}
                      />
                </View>
                {/* 模式 */}
            <View/>
        </View>
      </View>
      {/* 最外层 */}
      <Spinner visible={this.state.visible} textContent={""} textStyle={{color: '#FFF'}} />
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
