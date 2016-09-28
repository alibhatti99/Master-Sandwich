import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';

// App components
import TempAcceptView from './TempAcceptView'

const AdvenCard = (props) => {
  console.log(props)

  var routeAcceptView = {
    name: "You accepted " + props.adven.title,
    component: TempAcceptView,
    passProps: {
      adven: props.adven
    }
  }

  var toAcceptView = function (){
    props.toRoute(routeAcceptView)
  }

  return (
      <View style={{ margin: 70 }}>
        <Text>{props.adven.adventure[0].riddle}</Text>
        <Text>{props.adven.adventure[0].location}</Text>
        <TouchableHighlight style={style.button} onPress={toAcceptView}>
          <Text style={style.text}>Accept</Text>
        </TouchableHighlight>
      </View>
    );
};

var style = {
  button: {
    alignItems: 'center'
    // color: '#ffffff'
  },
  text: {
    color: '#0000ff'
  }
}

export default AdvenCard
