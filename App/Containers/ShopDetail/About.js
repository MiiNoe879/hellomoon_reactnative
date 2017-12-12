import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Geocoder from 'react-native-geocoding';
var geolib = require("geolib");
import openMap from 'react-native-open-maps';

import ShopActions from "../../Redux/ShopRedux";
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import ImageLoad from '../../Components/ImageLoad/ImageLoad';
import SwipeALot from 'react-native-swipe-a-lot';

import InfiniteScroll from 'react-native-infinite-scroll';
import Instagram from './Instagram';
import ImageDetail from './ImageDetail'

import styles from "./styles";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56);

var TimeFormat = require('hh-mm-ss');

class About extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'ABOUT',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name='ios-list-outline' style={styles.icon} />
        ),
    };

	constructor(props) {
        super(props);
        this.state={
            selectedShopId: '',
            distance: '',
            images: [],
            max_id: '',
            modalVisible: false,
            uri: '',
            date: '',
        }
    }

    componentWillMount() {
        const {selectedShopId} = this.props.shops;
        this.props.attemptShopInfo(selectedShopId);
        this.openMap = this.openMap.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.props.attemptInstagramFetch(this.props.shops.shop.instagram);
    }

    componentWillReceiveProps(nextProps) {
        let current = this.props.shops.instagram;
        let next = nextProps.shops.instagram;
        if(current.end_cursor !== next.end_cursor){
            if(next.images.length>0){
                let images = this.state.images;
                images = images.concat(next.images);
                this.setState({images: images});
                this.setState({count: next.count});
            }
        }
        current = this.props.shops.shop;
        next = nextProps.shops.shop;
        if(current.instagram != next.instagram){
            this.props.attemptInstagramFetch(next.instagram);
        }
    }

    componentDidMount() {
        this.setState({distance: ''});
    }

    componentWillUnmount() {
        //this.props.attemptShopInfo(0);
    }

    openMap() {
		const {shop} = this.props.shops;
		let address = shop.address;
		address = address.street+", "+address.city+", "+address.state+", "+address.country;
		//address = '3850 Wilshire Boulevard, Los Angeles, CA, United States';
		Geocoder.getFromLocation(address).then(
			json => {
				var location = json.results[0].geometry.location;
				openMap({ latitude: location.lat, longitude: location.lng })
			},
			error => {
				alert(error);
			}
		);
	}
    
    checkFeatures() {
        const {shop} = this.props.shops;
        const features = shop.features;
        let items = [];
        let flag = false;
        if(features){
            for (let feature of features) {
                if(feature.selected){
                    flag = true;
                }
            }
        }
        return flag;
    }

    renderFeatures() {
        const {shop} = this.props.shops;
        const features = shop.features;
        let items = [];
        if(features){
            let index = 0;
            for (let feature of features) {
                if(feature.selected){
                    items.push(
                        <View style={{marginTop: 10, marginBottom: 10, flexDirection: 'row'}} key={index}>
                            {this.renderIcon(index)}
                            <Text style={{color: 'white', lineHeight: 30, marginLeft: 10}}>{feature.title}</Text>
                        </View>
                    );
                }
                index++;
            }
        }
        return (
            items
        );
    }

    renderHours() {
        var d = new Date();
        var n = d.getDay();
        const {shop} = this.props.shops;
        const hours = shop.hours;
        return (
            <View style={{alignItems:'center',marginTop: 20}}>
                {this.renderProgress()}
                {
                    (hours) ?
                        (
                            <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: deviceWidth-40}}>
                                <Text style={{color: 'white', fontSize: 15}}>{hours[n].open}</Text>
                                <Text style={{color: 'white', fontSize: 15}}>{hours[n].close}</Text>
                            </View>
                        )
                        :
                        (<View style={{height: 0}}></View>)
                }
            </View>
        );
    }

    renderProgress() {
        var d = new Date();
        var n = d.getDay();
        const {shop} = this.props.shops;
        const hours = shop.hours;
        if(hours){
            let start = hours[n].open_real;
            let end = hours[n].close_real;
            if(start && end){
                start = TimeFormat.toS(start, 'hh:mm');
                end = TimeFormat.toS(end, 'hh:mm');
                let current = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
                
                current = TimeFormat.toS(current, 'hh:mm');
                let status = 'Open';
                let progress = 1;
                if(current<start){
                    status = 'Closed';
                    progress = 0;
                }
                else if(current>end){
                    status = 'Closed';
                    progress = 1;
                }
                else if(current>=start && current<=end){
                    status = 'Open';
                    progress = Math.abs((current-start)/(end-start));
                }
                return (
                    <View style={{alignItems: 'center'}}>
                        <Text style={{color: 'white',marginBottom: 5, fontSize: 15}}>{status}</Text>
                        <Progress.Bar progress={progress} width={deviceWidth-40} color={'white'} borderRadius={0}/>
                    </View>
                );
            }
            else{
                return (<View style={{height: 0}}></View>);
            }
        }
        else{
            return (<View style={{height: 0}}></View>);
        }
    }

    renderIcon(index) {
        switch(index) {
            case 0:
                return (
                    <Image source={require('../../Resources/Images/bone.png')} style={{width: 30, height: 30, marginLeft: 10}}/>
                );
                break;
            case 1:
                return (
                    <Image source={require('../../Resources/Images/card.png')} style={{width: 30, height: 30, marginLeft: 10}}/>
                );
                break;
            case 2:
                return (
                    <Image source={require('../../Resources/Images/seat.png')} style={{width: 30, height: 30, marginLeft: 10, resizeMode: 'stretch'}}/>
                );
                break;
            case 3:
                return (
                    <IconFeather name="wifi" style={{color: "white", fontSize: 30, marginLeft: 10}}/>
                );
                break;
            case 4:
                return (
                    <Image source={require('../../Resources/Images/parking.png')} style={{width: 30, height: 30, marginLeft: 10}}/>
                );
                break;
            case 5:
                return (
                    <IconEntypo name="light-up" style={{fontSize: 30, color: "white", marginLeft: 10}}/>
                );
                break;
            case 6:
                return (
                    <IconMaterialIcons name="flight" style={{fontSize: 30, color: "white", marginLeft: 10}}/>
                );
                break;
        }
    }

    getDistance(){
        const {shop} = this.props.shops;
        let address = shop.address;
        if(address){
            address = address.street+", "+address.city+", "+address.state+", "+address.country;
            //address = '3850 Wilshire Boulevard, Los Angeles, CA, United States';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                  Geocoder.getFromLocation(address).then(
                    json => {
                        var location = json.results[0].geometry.location;
                        //location.lat location.lng
                        let distance = geolib.getDistance(position.coords, location);
                        distance = distance/1609.344;
                        distance = distance.toFixed(2);
                        this.setState({distance: distance});
                    },
                    error => {
                        this.setState({distance: ''});
                    }
                  );
                },
                (error) => { this.setState({distance: ''}); },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            );
        }
    }

    loadMore(){
        let images = this.state.images;
        let max_id = images[images.length-1].id;
        let current = this.props.shops.shop;
        this.props.attemptInstagramFetch(current.instagram, max_id);
    }

    renderInstagram(  ) {
        if(this.state.images.length==0)
            return (<View></View>);
        else{
            return (
                <View style={styles.instagramview}>
                    <View style={{marginTop: 10, marginBottom: 20, marginLeft: 20}}>
                        <Text>{this.state.count} Instagram Photos</Text>
                    </View>
                    <InfiniteScroll
                        horizontal={true}
                        onLoadMoreAsync={this.loadMore}
                    >
                        <Instagram images={this.state.images} openDetail={this.openDetail} />
                    </InfiniteScroll>
                </View>
            )
        }
    }

    setModalVisible(visible) {
		this.setState({modalVisible: visible});
    }
    
    onCloseModal() {
		this.setModalVisible(false);
    }
    
    openDetail(uri, date) {
        this.setState({uri: uri});
        this.setState({date: date});
        this.setModalVisible(true);
    }

	render() {
        const { userinfo } = this.props.login;
        const { shop, selectedShopId, instagram } = this.props.shops;
        this.getDistance();
        const features = shop.features;

		return (
			<Container>
                <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                                <Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title style={styles.headertitle}>About</Title>
                        </Body>
                        <Right>
                            {
                                (userinfo.role==2) ? 
                                    (<Button transparent onPress={() => this.props.gotoEditShop(selectedShopId)}>
                                        <Text style={{color: 'white'}}>Edit</Text>
                                    </Button>) : (<View></View>)
                            }
                        </Right>
                    </Header>
                    <Content style={styles.content}>
                        {
                            (shop.shopImage=='') ?
                                (
                                    <ImageLoad 
                                        style={{width: deviceWidth, height: deviceHeight/2}}
                                        imageStyle={{resizeMode: 'stretch'}}
                                        source={require('../../Resources/Images/background.png')}
                                        loadingStyle={{ size: 'small', color: 'grey' }} 
                                        placeholderSource={require('../../Resources/Images/background.png')}
                                        placeholderStyle={{width: deviceWidth, height: deviceHeight/2, resizeMode: 'stretch'}}
                                    />
                                )
                                : 
                                (
                                    <ImageLoad 
                                        style={{width: deviceWidth, height: deviceHeight/2}} 
                                        imageStyle={{resizeMode: 'stretch'}}
                                        source={{ uri: shop.shopImage }}
                                        placeholderSource={require('../../Resources/Images/background.png')}
                                        placeholderStyle={{width: deviceWidth, height: deviceHeight/2, resizeMode: 'stretch'}}
                                    />
                                )
                        }
                        <Image style={[styles.detailbg, {height: 'auto', marginTop: 10}]} source={require('../../Resources/Images/background_transparent.png')}>
                            <View style={styles.subview}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>{shop.name}</Text>
                                        <View>
                                            <TouchableOpacity onPress={this.openMap} style={{flexDirection: 'row'}}>
                                                <IconEvilIcons name='location' style={{color: 'white', fontSize: 20}} />
                                                <Text style={{color: 'white', fontSize: 15}}> {this.state.distance} miles</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 15, color: '#34ebe5'}}>4</Text>
                                        <Ionicons name="ios-heart-outline" style={{color: '#34ebe5', fontSize: 25}}/>
                                    </View> */}
                                </View>
                                {this.renderHours()}
                            </View>
                        </Image>
                        {
                            (instagram.is_private === -1) ?
                                (<View></View>) : 
                                (instagram.is_private) ? 
                                    (<View style={{width: deviceWidth-20, backgroundColor: 'white',marginTop: 10, marginLeft: 10, marginRight: 10}}>
                                        <View style={{marginTop: 10, marginBottom: 10, marginLeft: 20}}>
                                            <Text>Instagram Photos</Text>
                                        </View>
                                        <View style={{height:50, alignItems: 'center', justifyContent: 'center', marginTop: 0, marginLeft: 10, marginRight: 10}}>
                                            <Text style={{color: 'grey', fontSize: 20}}>Private Instagram Account</Text>
                                        </View>
                                    </View>) :
                                    (this.renderInstagram())
                        }
                        {
                            (this.checkFeatures()) ?
                                (
                                    <ImageBackground style={[styles.detailbg, {marginTop: 10}]} source={require('../../Resources/Images/background_transparent.png')}>
                                        <View style={styles.subview}>
                                            <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>STORE FEATURES</Text>
                                            {this.renderFeatures()}
                                        </View>
                                    </ImageBackground>
                                ) :
                                (<View></View>)
                        }
                    </Content>
                    <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle}>
                    </LinearGradient>
                </ImageBackground>
                <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
				>
					<ImageDetail onClose={() => {this.onCloseModal()}} uri={this.state.uri} handle={shop.instagram} date={this.state.date}/>
				</Modal>
			</Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        shops: state.shops,
        login: state.login
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
        attemptShopInfo: (shopId) => dispatch(ShopActions.shopInfoRequest(shopId)),
        gotoEditShop: (shopId) => dispatch(ShopActions.gotoEditShop(shopId)),
        attemptInstagramFetch: (instagramid, max_id) => dispatch(ShopActions.instagramFetchRequest(instagramid, max_id)),
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(About)
