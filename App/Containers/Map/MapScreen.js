import React,{Component} from 'react';
import {Image,ScrollView, ImageBackground, Modal} from 'react-native';
import {Content, View, Container, Header, Title, Button, Left, Right, Body, Icon, H3} from "native-base";

import {RefreshControl, Platform, Dimensions} from 'react-native';

import {connect} from 'react-redux';
import ShopActions from "../../Redux/ShopRedux";
import LinearGradient from 'react-native-linear-gradient';
import IconIonic from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

import supercluster from 'supercluster';
import Marker from '../../Components/Marker';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import Search from '../Search/SearchScreen';

import { connectStyle } from 'native-base';

// import Points from '../../Resources/Images/Points.json';

class MapScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      active: 'false',
      modalSearchVisible: false
    };
    this._createCluster.bind(this)
    this._convertPoints.bind(this)
    this._getZoomLevel.bind(this)
    this._createRegions.bind(this)

    this.createMarkersForRegion_Places.bind(this)
    this.onChangeRegionComplete.bind(this)
    this.onChangeRegion.bind(this)
  }

  componentDidMount () {
    this.watchID = navigator.geolocation.getCurrentPosition((position) => {
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        //latitude:       34.074453,
        //longitude:      -118.27822,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00922*1.5*ASPECT_RATIO
      }
      this.setState({
        region: region,
        lastLat: position.coords.latitude,
        lastLong: position.coords.longitude
        //lastLat: 34.074453,
        //lastLong: -118.27822
      })
      // let data = this.props.shops;
      // data = data.shops;
      // let props = {}
      // props = this._convertPoints(data)
      // props.mapPoints = props.features;
      // //console.log(props.mapPoints);
      // // let prop = {}
      // // prop.mapPoints = Points;
      // this.componentWillReceiveProps(props);
      this.map.animateToRegion(region, 100);
    });
  }

  componentWillReceiveProps(nextProps) {
    const nears = this.props.shops.nears;
    const next_nears = nextProps.shops.nears;
    if(nears.length != next_nears.length){
      this.props.getShopList(next_nears);
    }
    let data = nextProps.shops;
    data = data.shops;
    let props = {}
    if(data.length>0){
      props = this._convertPoints(data)
      props.mapPoints = props.features;
    }
    if(props.mapPoints){
      const markers = this.createMarkersForLocations(props);
      if (markers && Object.keys(markers)) {
        const clusters = {};
        this.setState({
          mapLock: true
        });
        Object.keys(markers).forEach(categoryKey => {
          // Recalculate cluster trees
          const cluster = supercluster({
            radius: 60,
            maxZoom: 16,
          });
  
          cluster.load(markers[categoryKey]);
  
          clusters[categoryKey] = cluster;
        });
        this.setState({
          clusters,
          mapLock: false
        });
      }
    }
  }

  getZoomLevel(region = this.state.region) {
    const angle = region.longitudeDelta;
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }


  createMarkersForRegion_Places() {
    const padding = 0.25;
    if (this.state.clusters && this.state.clusters["places"]) {
      const markers = this.state.clusters["places"].getClusters([
        this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
        this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
      ], this.getZoomLevel());
      const returnArray = [];
      const { clusters, region } = this.state;
      const onPressMaker = this.onPressMaker.bind(this);
      markers.map(function(element ) {
        returnArray.push(
            <Marker
              key={element.properties._id || element.properties.cluster_id}
              onPress={onPressMaker}
              feature={element}
              clusters={clusters}
              region={region}
            />
        );
      });
      return returnArray;
    }
    return [];
  }

  onPressMaker(data) {
    console.log(data)
    if (data.options.isCluster) {
      if (data.options.region.length > 0) {
        this.goToRegion(data.options.region, 100)
      } else {
        console.log("We can't move to an empty region");
      }
    } else {
      const shopId = data.feature.properties._id;
      this.props.gotoDetailShop(shopId);
    }
    return;
  }

  goToRegion(region, padding) {
    this.map.fitToCoordinates(region, {
      edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
      animated: true,
    });
  }

  onChangeRegionComplete(region) {
    this.setRegion(region);
    this.setState({
      moving: false,
    });
    this.props.refreshShopList('', region.latitude, region.longitude);
  }


  onChangeRegion(region) {
    this.setState({
      moving: true,
    });
  }

  createMarkersForLocations(props) {
    return {
      places: props.mapPoints
    };
  }

  setRegion(region) {
    if(Array.isArray(region)) {
      region.map(function(element) { 
        if (element.hasOwnProperty("latitudeDelta") && element.hasOwnProperty("longitudeDelta")) {
          region = element;
          return;
        }
      })
    }
    if (!Array.isArray(region)) {
      this.setState({
        region: region
      });
    } else {
      console.log("We can't set the region as an array");
    }
  }

  _createCluster(data) {
    const index = supercluster({
      radius: 60,
      maxZoom: 15, // Default: 16     
      nodeSize: 128, 
    });
    index.load(data.features);
    return index;
  }

  _convertPoints(data) {
    const results = {
      type: 'MapCollection',
      features: [],
    };
    index = 0
    data.map((value, key) => {
      if(value.location){
        index++;
        array = {
          type: 'Feature',
          properties: {
            _id: value.id,
            index: index,
            featureclass: "A",
            name: value.name,
            lat_x: (value.location) ? value.location.lat : 0,
            long_x: (value.location) ? value.location.lng : 0
          },
          geometry: {
            type: 'Point',
            coordinates: [
              value.location.lng,
              value.location.lat
            ],
          },
        };
        results.features.push(array);
      }
    });
    return results;
  }

  _getZoomLevel(region = this.state.region) {
      const angle = region.longitudeDelta;
      const level = Math.round(Math.log(360 / angle) / Math.LN2);    
      return level;
  }

  _createRegions() {
    const padding = 0;
    const markers = this.state.clusters.getClusters([
      this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
      this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
      this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
      this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
    ], this._getZoomLevel());
    return markers.map(marker => this.renderMarkers(marker));
  }

  setModalVisible(visible) {
		this.setState({modalSearchVisible: visible});
	}

	setModalSearchVisible(visible) {
		this.setState({modalSearchVisible: visible});
	}
	
	onSearch() {
		this.modalSearchVisible(false);
  }
  
  onCloseSearchModal() {
		this.setModalVisible(false);
	}
  
  render(){
    const nears = this.props.shops.nears;
    return(
      <Container style={{backgroundColor:'#2e2d2e'}}>            
        <LinearGradient colors={['#2e2d2e','#434343','#4d4d4d']} style={styles.headerStyle}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="md-menu" style={{backgroundColor:'transparent', color:'white'}}/>
            </Button>
          </Left>            
          <View style={{flexDirection:'row', justifyContent:'flex-start', flexDirection:'row'}}>
            <Button transparent style={styles.btnmenu}>
              <Image source={require('../../Resources/Images/list.png')} style={styles.listicon}/>
            </Button>
            <Button transparent style={styles.btnmenu} onPress={() => this.props.navigation.navigate("Search")}>
              <Icon name='ios-search' style={styles.searchicon}/>
            </Button>
            <Button transparent style={styles.btnmenu}>
              <IconEvilIcons name='location' style={[styles.locationicon, {color: 'yellow'}]}/>
            </Button>
          </View>
      </LinearGradient>
        <Content style={styles.content} scrollEnabled={false}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.mapview}
            initialRegion={this.state.region}
            //initialPosition={this.state.region}
            onRegionChange={region =>this.onChangeRegion(region)}
            onRegionChangeComplete={region =>this.onChangeRegionComplete(region)}
            showsUserLocation={true}
            fitToElements={true}
          >
            {
              this.createMarkersForRegion_Places()
            }
          </MapView>
        </Content>
        <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalSearchVisible}
          onRequestClose={() => {}}
          onClose={() => this.onCloseSearchModal()}
				>
					<Search onClose={() => {this.onCloseSearchModal()}} onSearch={() => {this.onSearch()}}/>
				</Modal>
      </Container>
      )
  }
}
const mapStateToProps = state => {
  return {
    shops:state.shops
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshShopList: (search, lat, lng) => dispatch(ShopActions.refreshRequest(search, lat, lng)),
    getShopList: (shops) => dispatch(ShopActions.getShopsRequest(shops)),
    gotoDetailShop: (shopId) =>{ 
      dispatch(ShopActions.gotoDetailShop(shopId));
    },
  };
};

const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)
const containerHeight = height-toolBarHeight;

const styles = {
  headerStyle:{
    height:toolBarHeight,
    paddingTop: Platform.OS === "ios" ? 15 : 0,
    flexDirection:'row',
    alignItems:'center'
  },
  contentContainer:{
    height:height
  },
  btnmenu: {
    paddingHorizontal:2,
    paddingLeft: 5,
    paddingRight: 5
  },
  searchicon: {
    color: '#fff',
    fontSize: 25
  },
  locationicon: {
		color: '#fff',
		fontSize: 30
  },
  listicon: {
    width: 30,
    height: 30
  },
  content: {
		backgroundColor: '#4d4d4d',
		flex: 1,
  },
  locationicon: {
    color: '#fff',
    fontSize: 30
  },
  fillParent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mapview: {
    flex: 1,
    width: width,
    height: height,
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
