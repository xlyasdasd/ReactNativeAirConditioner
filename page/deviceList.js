import React from 'react';
import {
  View,
  Button,
  AppRegistry,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { doPost } from '../net/net';
import {saveUser, getUser,saveInstance} from '../storage/SWCStorage';
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator ,TabNavigator} from 'react-navigation';


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: '设备列表',
  };

  constructor(props) {
      super(props);
      this.state = {
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      };
    }

    componentDidMount() {
      this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
      const { page, seed } = this.state;
      this.setState({ loading: true });
      var params = {userID:'',token:''}
      var user = getUser().then(ret => {
      		params.userID = ret.userId,
      		params.token = ret.token,
        doPost('device/findDevice',params)
        .then((responseJson)=>{
          if(responseJson.status === 1){
            this.setState({
              data: page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
              error: responseJson.error || null,
              loading: false,
              refreshing: false
            });
          }
          console.log(responseJson)
        })
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

    //   // doPost('device/findDevice',user.userId)
    //   fetch(url)
    //     .then(res => res.json())
    //     .then(res => {
          // this.setState({
          //   data: page === 1 ? res.results : [...this.state.data, ...res.results],
          //   error: res.error || null,
          //   loading: false,
          //   refreshing: false
          // });
    //     })
    //     .catch(error => {
    //       this.setState({ error, loading: false });
    //     });
    // };

    handleRefresh = () => {
      this.setState(
        {
          page: 1,
          seed: this.state.seed + 1,
          refreshing: true
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };

    handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          // this.makeRemoteRequest();
        }
      );
    };

    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "86%",
            backgroundColor: "#CED0CE",
            marginLeft: "14%"
          }}
        />
      );
    };



    renderFooter = () => {
      if (!this.state.loading) return null;

      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };




    render() {
       const { navigate } = this.props.navigation;
      return (
        <List containerStyle={{ flex:1,flexDirection:'row',backgroundColor:'#FFFFFF', borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            style={{flex:1,backgroundColor:'#FFFFFF'}}
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                // roundAvatar
                title={`${item.name}`}
                subtitle={'远程id:'+item.sign_id}
                onPress= {()=>navigate('ControlScreen',{ name:item.name,device_room:item.deviceRooms,sign_id:item.sign_id})}
                avatarStyle={{backgroundColor:'#FFF'}}
                avatar={require('../img/aircondition.png')}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )}
            keyExtractor={item => item.sign_id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onPress= {()=>navigate('Login')}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        </List>
      );
    }

}
const DeviceList = HomeScreen;

export default DeviceList;
