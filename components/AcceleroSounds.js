import React from 'react';
import {StyleSheet,Image, Text, TouchableOpacity, View} from 'react-native';
import {Accelerometer, Audio} from 'expo';

export default class AccelerometerSensor extends React.Component {
    state = {
        accelerometerData: {},
        filterColor: 'fff',
    };

    componentDidMount() {
        this._subscribe();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getBackground() {
      return fetch('http://www.colr.org/json/color/random')
        .then((response) => response.json())
        .then((responseJson) => {
          var tata = responseJson.colors[0].hex;
          this.state.filterColor = tata;
          alert(tata);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    _subscribe = async () => {
        let status = true;
        const soundObject = new Audio.Sound();

        await soundObject.loadAsync(require('../assets/sounds/holy.mp3'));
        // Your sound is playing!

        this._subscription = Accelerometer.addListener(async accelerometerData => {
            console.log(accelerometerData.z);
            if (accelerometerData.z < 0 && status === true) {
                Accelerometer.setUpdateInterval(1000);
                status = !status;
                try {
                    await soundObject.stopAsync();
                    await soundObject.playAsync();
                    // Your sound is playing!

                    this.getBackground();
                } catch (error) {
                    console.log(error);
                    // An error occurred!
                }
            } else if (accelerometerData.z > 0 && status === false) {
                status = !status;
                Accelerometer.setUpdateInterval(16);
            }
            this.setState({accelerometerData});
        });
    };

    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };

    render() {
        let {x, y, z} = this.state.accelerometerData;

        return (
            <View style={styles.sensor}>
                <Text>Accelerometer:</Text>
                <Text>x: {round(x)} y: {round(y)} z: {round(z)} #{this.state.filterColor}</Text>
                <Image resizeMode='contain' style={[styles.meuuuh , {backgroundColor: `#${this.state.filterColor}`}]} source={require('../assets/images/boite-meuh.png')}/>

            </View>
        );
    }
}

function round(n) {
    if (!n) {
        return 0;
    }

    return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 15,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
    },
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    sensor: {
        marginTop: 15,
        paddingHorizontal: 10,
    },
    meuuuh: {
        width: '80%',
        marginLeft: '10%',
    },
});