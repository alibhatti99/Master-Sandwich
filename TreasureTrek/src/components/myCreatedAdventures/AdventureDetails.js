import React from 'react';
import { Text, View, Image, Linking } from 'react-native';


const AdventureDetail = ({ singleAdventure }) => {
  const { id, title, creator, adventure, date, completedAll, startingLocation } = singleAdventure;
  const {
    viewStyle, detailsStyle, titleStyle, dateStyle, arrowsStyle, arrowsContainer
  } = styles;

  return (
    <View style={viewStyle}>
      <View style={detailsStyle}>
        <Text style={titleStyle}>{title}</Text>
      </View>
      <View style={arrowsContainer}>
        <Image style={arrowsStyle} source={require('../../resources/double-arrows.png')} />
      </View>
    </View>
  );
};

const styles = {
  viewStyle: {
    //marginTop: 20,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#ed1558'
  },
  detailsStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 12,
    width: 285
  },
  titleStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  arrowsStyle: {
    height: 25,
    width: 25
  },
  arrowsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default AdventureDetail;