import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

//import Expo from 'expo';
import MapView from 'react-native-maps';
const offset_map_small = 0.0001;
import ImageMarker from '../Images/marker.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import markerImg from '../Images/placeIcon.png';

export default class Marker extends React.Component {

  state = {
    colorByCategory: {
      A: "violet",
      B: "yellow",
      C: "blue",
      D: "pink",
      E: "green",
      "Cluster": "red"
    }
  }

  onPress() {
    if (!this.props.feature.properties.featureclass) {
      //  Calculer l'angle
      const { region } = this.props;
      const category = this.props.feature.properties.featureclass || "Cluster";
      const angle = region.longitudeDelta || 0.0421/1.2;
      const result =  Math.round(Math.log(360 / angle) / Math.LN2);
      //  Chercher les enfants
      const markers = this.props.clusters["places"].getChildren(this.props.feature.properties.cluster_id, result);
      const newRegion = [];
      const smallZoom = 0.05;
      //  Remap
      markers.map(function (element) {
        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] - region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] - region.longitudeDelta * smallZoom,
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1],
          longitude: offset_map_small + element.geometry.coordinates[0],
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] + region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] + region.longitudeDelta * smallZoom,
        });
      });
      //  Préparer the retour
      const options = {
        isCluster: true,
        region: newRegion,
      };
      //  Ensuite envoyer l'événement
      if (this.props.onPress) {
        this.props.onPress({
          type: category,
          feature: this.props.feature,
          options: options,
        });
      }
    }
    else{
      if (this.props.onPress) {
        const options = {
          isCluster: false
        };
        this.props.onPress({
          feature: this.props.feature,
          options: options,
        });
      }
    }
  }


  render() {
    const latitude = this.props.feature.geometry.coordinates[1];
    const longitude = this.props.feature.geometry.coordinates[0];
    const category = this.props.feature.properties.featureclass || "Cluster";
    const text = (category  == "Cluster" ? this.props.feature.properties.point_count : 1);
    const size = 37;
    const id = this.props.feature.properties.id;
    return (
      <MapView.Marker
        coordinate={{
          latitude,
          longitude,
        }}
        //onPress={this.onPress.bind(this)}
        identifier={id}
        image={markerImg}
      >
        {
          (category == 'Cluster') ? 
            (<View>
              <Image
                style={{
                  tintColor: this.state.colorByCategory[category],
                }}
                source={ImageMarker}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {
                    text
                  }
                </Text>
              </View>
             </View>) :
            (<MapView.Callout>
              <View>
                {
                    (<View style={{flexDirection: 'row'}}>
                      <Text style={{lineHeight: 30}}>{this.props.feature.properties.name}</Text>
                      <TouchableOpacity onPress={this.onPress.bind(this)}>
                        <Ionicons name='ios-information-circle-outline' style={{fontSize: 30, marginLeft: 10, color: 'blue'}}/>
                      </TouchableOpacity>
                    </View>)
                }
              </View>
            </MapView.Callout>)
        }
      </MapView.Marker>
    );
  }
}
