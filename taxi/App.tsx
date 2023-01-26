
import React, {Component} from 'react';
import {StyleSheet, View, Text,} from 'react-native';
import MapView, {Marker, Callout, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from "react-native-geolocation-service";

export default function App() {
     const [pin, setPin] = React.useState
   ({ latitude: 53.48101168016125,
    longitude: -2.237021364258539,})
    
  
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} 
      autoFocus={false}
      returnKeyType={'search'} 
      listViewDisplayed='auto'    
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);}}
        
      query={{
        key: "AIzaSyAsS0rUpAjtwQ7TzKQJgwcXNQlS4wss8yU",
        language: 'en', // language of the results
        types: '(cities)' // default: 'geocode'
      }}
      
      styles={{
        textInputContainer: {
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        },
        listView: {
          color: 'black', //To see where exactly the list is
          zIndex: 1000, //To popover the component outwards
          position: 'absolute',
          top: 45
        },
      }}
 
 

  />
        <MapView
          style={styles.map}
          initialRegion={{
                latitude: 53.48101168016125,
                longitude: -2.237021364258539,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
          }}
              showsUserLocation={true} 
              provider="google"
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              toolbarEnabled={true}
              //  zoomEnabled={true}
              rotateEnabled={true} 
          >
           <Marker
        coordinate={pin}
          draggable={true}
          onDragStart={(e) => {
            console.log("Drag start", e.nativeEvent.coordinate)
          }}
          onDragEnd={(e) => {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }}

          >
            <Callout>
              <Text> Im here </Text>
            </Callout>
        </Marker>
         <Circle center={pin} 
          radius={1000}
          ></Circle>
          </MapView>
      </View>
    );
    }

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
  },
});


