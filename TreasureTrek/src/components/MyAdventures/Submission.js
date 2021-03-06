import React, {Component} from 'react';
import {Text, View, TextInput, AsyncStorage, TouchableHighlight, AlertIOS, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import t from 'tcomb-form-native';
import AdventureSolution from './AdventureSolution';
import MyAdventures from './myAdventuresContainer';
import MenuButton from '../nav/MenuButton';
import StarRating from 'react-native-rating-star';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Riddle Submission Form
var Form = t.form.Form;

var Solution = t.struct({solution: t.String});

var options = {
  fields: {
    solution: {
      error: 'Enter your answer!',
      placeholder: 'answer',
      autoCapitalize: 'none',
      autoCorrect: false
    }
  }
}

//console.log('$$$$$$$$$', this.props.id);

// Submission Component
class Submission extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showReviews: false,
      currentRating: 3
    };
  }

  componentWillMount() {
    this.setState({
      waiting: false
    });
  }

  setSpinner() {
    this.setState({
      waiting: !this.state.waiting
    })
  }

 clearForm() {
    this.setState({input: null});
  }

  toRiddles() {
    this.props.nav.toBack();
  }

 submitReview() {
   this.toRiddles();
   this.setSpinner();
   AsyncStorage.getItem('id_token')
     .then(token=>{
        fetch("https://treasure-trek.herokuapp.com/api/updateAdventureRating", {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({
            rating: this.state.currentRating,
            adventureid: this.props.id //Adventure ID
          })
        }).then(function(res){
          return res.json()
        }).then((data)=> {
          this.setSpinner();
          AlertIOS.alert( "Thanks for your review!" );
          this.toRiddles();
        }).catch((error)=> {
          console.error("ERROR: ", error);
          this.handleError();
        }).done();
      });
 }

 submitAnswer() {
    this.clearForm();
    var input = this.refs.form.getValue();
    if (input) {
      console.log('PROPS: ', this.props)
      console.log('answer ', this.props.answer)
      console.log('input ', input.solution)
      var riddleNumber = this.props.num - 1 ;

      if (input.solution === this.props.answer) {
        //if Riddles Complete, prompt user for review
        var numRiddlesCorrect = 0;
        this.props.completedArray.forEach(function(value){
          if (value === true) {
            numRiddlesCorrect++;
          }
        });
        //Check if last count of correct riddles 2,
        // if true then this was the 3rd and final riddle that's correct
        // and should prompt user to leave a review
        if (numRiddlesCorrect === 2) {
          this.setState({showReviews: true});
        }
        this.setSpinner();
        AsyncStorage.getItem('id_token')
          .then(token=>{
            fetch("https://treasure-trek.herokuapp.com/api/updateProgress", {
              method: "PUT",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
              },
              body: JSON.stringify({
                adventureid: this.props.id,    //Adventure ID
                riddleNumber: riddleNumber //Riddle # is zero index based
              })
            }).then(function(res){
              return res.json()
            }).then((data)=> {
              this.setSpinner();
              // Reroute Navigation To Home
              this.props.completion = true;
              this.props.updateCompletion();
              console.log('Points Data Response Object: ', data);
              AlertIOS.alert( "You scored \n \n " + data + " points. Keep up the great work!" );
              console.log('numRiddlesCorrect: ', numRiddlesCorrect)
              if (numRiddlesCorrect < 2) {
                this.toRiddles();
              }



              // console.log('Posted! Data Response: ', data);

            }).catch((error)=> {
              console.error("ERROR: ", error);
              this.handleError();
            }).done();
          });
      } else {
        AlertIOS.alert( "Nice guess, but wrong answer. Try again." );
      }
    }
  }



 handleError () {
  AsyncStorage.removeItem('id_token')
    .then(()=>{
      this.errorRedirectToLogin("No Session - Redirecting");
    }).catch(error => {
      console.log('AsyncStorage error: ' + error.message);
      this.errorRedirectToLogin("Internal Error - Redirecting")
    });
  }

  errorRedirectToLogin (message) {
    AlertIOS.alert(message);
    this.props.resetToRoute({
      name: "Login",
      component: Auth
    });
  }

  showInputField () {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
        <View style={styles.container}>

          <View style={styles.riddleContainer}>
            <Text style={styles.title}>Riddle Details</Text>
          </View>

          <View>
            <Text style={styles.riddle}> {this.props.riddle} </Text>
          </View>

          <View>
            <View>
              <Form
                ref="form"
                type={Solution}
                options={options}
              />
            </View>
            {this.state.waiting ?
              <ActivityIndicator /> :
              <View>
                <TouchableHighlight style={styles.button}
                  onPress={this.submitAnswer.bind(this)}
                  underlayColor='#99d9f4'
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableHighlight>
              </View>
            }
          </View>

        </View>
      </KeyboardAvoidingView>
    )
  }

  showAnswer () {
    return (
      <View style={styles.container}>
        <View style={styles.riddleContainer}>
          <Text style={styles.title}>Riddle Completed</Text>
        </View>
        <View>
          <Text style={styles.riddle}> {this.props.riddle} </Text>
        </View>
        <View>
          <Text style={styles.riddle}> Answer: </Text>
          <Text style={styles.riddle}> {this.props.answer} </Text>
        </View>
      </View>
    )
  }



  starsChanged(rating) {
    this.setState({'currentRating': rating});
    console.log('rating: ', rating);
    console.log('this.state.currentRating: ', this.state.currentRating);
  }

  promptReview() {
    return (
      <View style={styles.container}>

        <View>
          <Text style={styles.title}> Great Job! </Text>
        </View>

        <View>
          <Text style={styles.rating}> Rate Your Adventure </Text>

          <StarRating
            maxStars={5}
            rating={3}
            selectStar={require('../../resources/select_star.png')}
            unSelectStar={require('../../resources/unselect_star.png')}
            //valueChanged={this.starsChanged}
            valueChanged={this.starsChanged.bind(this)}
            starSize={50}
            interitemSpacing={15}
          />
        </View>
        <View>
          {this.state.waiting ?
            <ActivityIndicator /> :
            <View style={styles.row}>
              <TouchableHighlight style={styles.button}
                onPress={this.submitReview.bind(this)}
                underlayColor='#99d9f4'
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableHighlight>
            </View>
          }
        </View>

      </View>
    );
  }



  render() {
    return (
      // <View style={styles.container}>
      <View style={{flex: 1}}>

          {this.state.showReviews ? (this.promptReview()) : (this.props.completion ? this.showAnswer() : this.showInputField())}

      </View>
    );
  }
};


const styles = {
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    // marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
    flex: 1
  },
  riddleContainer: {
    justifyContent: 'center',
    // marginTop: 50,
    // marginBottom: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  riddle: {
    fontSize: 16,
    alignSelf: 'center',
    // marginBottom: 30,
    fontFamily: 'Helvetica',
    padding: 5
  },
  rating: {
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 30,
    fontFamily: 'Helvetica',
    padding: 5
  },
  title: {
    fontSize: 32,
    alignSelf: 'center',
    // marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
}

// Make componenet available for other parts of the app
export default Submission;

