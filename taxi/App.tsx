

import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import React from 'react';


const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 53.47771591617534,
  longitude:-2.243148101784448,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};


type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: "AIzaSyAsS0rUpAjtwQ7TzKQJgwcXNQlS4wss8yU",
          language: "en",
        }}
      />
    </>
  );
}

export default function App() {
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<MapView>(null);



  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args: any) => {
    if (args) {
      
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
        showsUserLocation={true} 
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        rotateEnabled={true} 
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={"AIzaSyAsS0rUpAjtwQ7TzKQJgwcXNQlS4wss8yU"}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
           
          />
        )}
        
      </MapView>
      <View style={styles.searchContainer}>
        <InputAutocomplete
          label="Pick up"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <InputAutocomplete
          label="Destination"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
        />
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Show my route</Text>
        </TouchableOpacity>
        {distance && duration ? (
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 100
  
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
});

// import React, {Component} from 'react';
// import {StyleSheet, View, Text,} from 'react-native';
// import MapView, {Marker, Callout, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import Geolocation from "react-native-geolocation-service";

// export default function App() {
//      const [pin, setPin] = React.useState
//    ({ latitude: 53.48101168016125,
//     longitude: -2.237021364258539,})
    
  
//     return (
//       <View style={styles.container}>
//         <GooglePlacesAutocomplete
//       placeholder='Search'
//       minLength={2} 
//       autoFocus={false}
//       returnKeyType={'search'} 
//       listViewDisplayed='auto'    
//       fetchDetails={true}
//       onPress={(data, details = null) => {
//         // 'details' is provided when fetchDetails = true
//         console.log(data, details);}}
        
//       query={{
//         key: "AIzaSyAsS0rUpAjtwQ7TzKQJgwcXNQlS4wss8yU",
//         language: 'en', // language of the results
//         types: '(cities)' // default: 'geocode'
//       }}
      

//         />
//         <MapView
//           style={styles.map}
//           initialRegion={{
//                 latitude: 53.48101168016125,
//                 longitude: -2.237021364258539,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//           }}
              // showsUserLocation={true} 
              // provider="google"
              // followsUserLocation={true}
              // showsMyLocationButton={true}
              // showsCompass={true}
              // toolbarEnabled={true}
              // //  zoomEnabled={true}
              // rotateEnabled={true} 
//           >
        //    <Marker
        // coordinate={pin}
        //   draggable={true}
        //   onDragStart={(e) => {
        //     console.log("Drag start", e.nativeEvent.coordinate)
        //   }}
        //   onDragEnd={(e) => {
        //     setPin({
        //       latitude: e.nativeEvent.coordinate.latitude,
        //       longitude: e.nativeEvent.coordinate.longitude
        //     })
        //   }}

        //   >
        //     <Callout>
        //       <Text> Im here </Text>
        //     </Callout>
        // </Marker>
        //  <Circle center={pin} 
        //   radius={1000}
        //   ></Circle>
//           </MapView>
//       </View>
//     );
//     }




