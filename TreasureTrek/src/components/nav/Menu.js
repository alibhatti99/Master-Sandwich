import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Text,
  View,
  AsyncStorage,
  AlertIOS,
  TouchableHighlight,
  Image
} from 'react-native';

import Auth from '../auth/Auth';
import MenuButton from './MenuButton';
import MyAdventures from '../MyAdventures/myAdventuresContainer';
import AllAdventures from '../AllAdventures/AllAdventuresContainer';
import MyCreatedAdventures from '../myCreatedAdventures/myCreatedAdventures';
import UserProfile from '../UserProfile/ProfileMain';
import sbContainer from '../Scoreboard/sbContainer';
import UserButton from './UserButton';


var STORAGE_KEY = 'id_token';

class Menu extends Component {


  toAllAds () {
    this.props.resetToRoute({
      name: "All Adventures",
      component: AllAdventures,
      leftCorner: MenuButton,
      rightCorner: UserButton
    });
  }

  toMyAds () {
    this.props.resetToRoute({
      name: "My Adventures",
      component: MyAdventures,
      leftCorner: MenuButton,
      rightCorner: UserButton
    });
  }

  toCreateAds () {
    this.props.resetToRoute({
      name: "Create Adventures",
      component: MyCreatedAdventures,
      leftCorner: MenuButton,
      rightCorner: UserButton
    });
  }

  toMyProfile () {
    this.props.resetToRoute({
      name: "My Profile",
      component: UserProfile,
      leftCorner: MenuButton
    });
  }

   toScoreboard () {
    this.props.resetToRoute({
      name: "Scoreboard",
      component: sbContainer,
      leftCorner: MenuButton,
      rightCorner: UserButton
    });
  }

  async userLogout() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        AlertIOS.alert("Logout Success!");
        this.props.resetToRoute({
          name: "Login",
          component: Auth,
          hideNavigationBar: true
        })
    } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
    }
  }

  render() {

    return (
      <View>
        <TouchableHighlight style={styles.button} onPress={this.toMyAds.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>My Adventures</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.toAllAds.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>All Adventures</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.toCreateAds.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Create Adventures</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.toMyProfile.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>My Profile</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.toScoreboard.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>High Score</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.userLogout.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableHighlight>

      </View>
    );
  }


}


const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    paddingTop: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2 },
    shadowOpacity: 0.9,
    elevation: 2,
    position: 'relative'
  },
  textStyle1: {
    fontSize: 12,
  },
  textStyle2: {
    fontSize: 8,
  },
  submitStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    backgroundColor: '#48BBEC',
    borderColor: 'white',
    borderWidth: 1,

    alignSelf: 'stretch',
    justifyContent: 'center',
    zIndex: 1
  },

}

export default Menu;
