import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';

export default React.createClass({
  componentDidMount() {
    // We can use the public context API to open/close/toggle the menu.
    //setInterval(() => {
    //  this.refs.MenuContext.toggleMenu('menu1');
    //}, 2000);
  },
  getInitialState() {
    return {
      message: 'Try clicking the top-right menus',
      firstMenuDisabled: false,
      dropdownSelection: '-- Choose --'
    };
  },
  setMessage(value) {
    if (typeof value === 'string') {
      this.setState({ message: `You selected "${value}"` });
    } else {
      this.setState({ message: `Woah!\n\nYou selected an object:\n\n${JSON.stringify(value)}` });
    }
    return value !== 'do not close';
  },
  setFirstMenuDisabled(enabled) {
    this.setState({
      message: `First menu is ${enabled ? 'disabled' : 'enabled'}`,
      firstMenuDisabled: enabled
    });
    return false;
  },
  render() {
    return (
        <View style={styles.topbar}>
          <Menu style={styles.dropdown} onSelect={(value) => this.setState({ dropdownSelection: value })}>
            <MenuTrigger>
              <Text>{this.state.dropdownSelection}</Text>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
              marginTop: 30,
              borderColor: '#ccc',
              borderWidth: 2,
              width: 300,
              height: 200}}
              renderOptionsContainer={(options) => <ScrollView><Text>CHOOSE SOMETHING....</Text>{options}</ScrollView>}>
              <MenuOption value="Option One">
                <Text>Option One</Text>
              </MenuOption>
              <MenuOption value="Option Two">
                <Text>Option Two</Text>
              </MenuOption>
              <MenuOption value="Option Three">
                <Text>Option Three</Text>
              </MenuOption>
              <MenuOption value="Option Four">
                <Text>Option Four</Text>
              </MenuOption>
              <MenuOption value="Option Five">
                <Text>Option Five</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
    );
  }
});

const styles = StyleSheet.create({
  topbar: {
    flexDirection:'row',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  menuTriggerText: {
    color: 'lightgrey',
    fontWeight: '600',
    fontSize: 20
  },
  disabled: {
    color: '#ccc'
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  contentText: {
    fontSize: 18
  },
  dropdown: {
    width: 300,
    borderColor: '#fff',
    padding: 5
  },
  dropdownOptions: {

  }
});
