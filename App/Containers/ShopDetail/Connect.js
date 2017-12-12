import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, Linking } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import openMap from 'react-native-open-maps';
import call from 'react-native-phone-call';
import SendSMS from 'react-native-sms';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';

import {
	shareOnFacebook,
	shareOnTwitter,
  } from 'react-native-social-share';
import styles from "./styles";

const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)

class Connect extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'CONNECT',
        tabBarIcon: ({ tintColor }) => (
            <IconEvilIcons name='location' style={styles.icon} />
        ),
    };

	constructor(props) {
		super(props);
		this.openMap = this.openMap.bind(this);
		this.callPhone = this.callPhone.bind(this);
		this.shareFB = this.shareFB.bind(this);
		this.shareTW = this.shareTW.bind(this);
		this.shareSMS = this.shareSMS.bind(this);
		this.openURL = this.openURL.bind(this);
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

	callPhone() {
		const {shop} = this.props.shops;
		const phonenumber = shop.phonenumber;
		const args = {
			number: phonenumber,
			prompt: true
		  }
		   
		  call(args)
	}

	shareSMS() {
		const {shop} = this.props.shops;
		let address = shop.address;
		address = address.street+", "+address.city+", "+address.state+", "+address.zipcode;
		let body = 'Check out this place I found through Moon:'+address;
		SendSMS.send({
			body: body,
			recipients: [],
			successTypes: ['sent', 'queued']
		}, (completed, cancelled, error) => {
		});
	}

	shareFB() {
		const {shop} = this.props.shops;
		let address = shop.address;
		address = address.street+", "+address.city+", "+address.state+", "+address.zipcode;
		let body = 'Check out this place I found through Moon:'+address;
		shareOnFacebook({
			'text':body,
			// 'link':'https://artboost.com/',
			// 'imagelink':'https://artboost.com/apple-touch-icon-144x144.png',
			// //or use image
			// 'image': 'artboost-icon',
		  },
		  (results) => {
			
		  }
		);
	}

	shareTW() {
		const {shop} = this.props.shops;
		let address = shop.address;
		address = address.street+", "+address.city+", "+address.state+", "+address.zipcode;
		let body = 'Check out this place I found through Moon:'+address;
		shareOnTwitter({
			'text':body,
			// 'link':'https://artboost.com/',
			// 'imagelink':'https://artboost.com/apple-touch-icon-144x144.png',
			// //or use image
			// 'image': 'artboost-icon',
		  },
		  (results) => {
			if(results=='not_available'){
				alert('Please login to a Twitter account to share.');
			}
		  }
		);
	}

	openURL() {
		const {shop} = this.props.shops;
		const url = shop.url;
		Linking.openURL(url);
	}

	render() {
		const {shop} = this.props.shops;
		let address = shop.address;
		if(address)
			address = address.city+" "+address.state+" "+address.street+" "+address.zipcode;
		return (
			<Container>
                <Image source={require('../../Resources/Images/background_transparent.png')} style={styles.bg}>
					<Header style={styles.header} iosBarStyle="light-content">
						<Left>
							<Button transparent onPress={() => this.props.navigation.navigate('Home')}>
								<Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
							</Button>
						</Left>
						<Body>
							<Title style={styles.headertitle}>Connect</Title>
						</Body>
						<Right/>
					</Header>
					<Content style={styles.content}>
						<View style={{marginTop: 30, marginLeft: 20, marginRight: 20}}>
							<Text style={{color:'white', fontWeight:'bold', fontSize: 12}}>ADDRESS</Text>
							<View style={{marginTop: 20}}>
								<TouchableOpacity onPress={this.openMap}>
									<Text style={{textDecorationLine: 'underline', color: 'white', fontSize: 18}}>{address}</Text>
								</TouchableOpacity>
								{/* <Text style={{color: 'white', fontSize: 18}}>Ballard, WA 98107</Text> */}
							</View>
						</View>
						<View style={{marginTop: 30, marginLeft: 20, marginRight: 20}}>
							<Text style={{color:'white', fontWeight:'bold', fontSize: 12}}>PHONE #</Text>
							<View style={{marginTop: 20}}>
								<TouchableOpacity onPress={this.callPhone}>
									<Text style={{textDecorationLine: 'underline', color: 'white', fontSize: 18}}>{shop.phonenumber}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Content>
					<View style={{position: 'absolute',left: 0, right: 0, bottom: toolBarHeight+50, backgroundColor: '#58cded', height: 90, paddingTop: 10, paddingLeft: 20, paddingBottom: 10, paddingRight: 10}}>
						<Text style={{color:'white', fontWeight:'bold', fontSize: 12}}>SHARE LOCATION</Text>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
							<Button bordered light style={{borderRadius: 0, width: 80, alignItems: 'center', justifyContent: 'center'}} onPress={this.shareSMS}>
								<Text style={{color: 'white'}}>TEXT</Text>
							</Button>
							<Button bordered light style={{borderRadius: 0, width: 80, alignItems: 'center', justifyContent: 'center'}} onPress={this.shareTW}>
								<IconEvilIcons name='sc-twitter' style={{color: 'white', fontSize: 20}}/>
							</Button>
							<Button bordered light style={{borderRadius: 0, width: 80, alignItems: 'center', justifyContent: 'center'}} onPress={this.shareFB}>
								<IconEvilIcons name='sc-facebook' style={{color: 'white', fontSize: 20}}/>
							</Button>
						</View>
					</View>
					<View style={{position: 'absolute',left: 0, right: 0, bottom: toolBarHeight, backgroundColor: 'yellow', height: 50, paddingLeft: 10, paddingRight: 10}}>
						<TouchableOpacity onPress={() => this.openURL()} style={styles.footertouch}>
							<Left>
								<Text style={{color:'#44b1c2'}}>TAKE ME SHARE</Text>
							</Left>
							<Right>
								<Image source={require('../../Resources/Images/onBoardingArrow.png')} />
							</Right>
						</TouchableOpacity>
					</View>
          </Image>
          <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle}>
				  </LinearGradient>

				{/* <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle}>
					<Image source={require('../../Resources/Images/menuIcon3.png')} style={{width: 18, height: 25, resizeMode: 'stretch'}}/>
					<Text style={{color: 'white', backgroundColor: 'transparent',fontSize: 13, marginTop: 10}}>Menu</Text>
				</LinearGradient> */}
			</Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        shops: state.shops
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
        attemptShopInfo: (shopId) => dispatch(ShopActions.shopInfoRequest(shopId)),
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(Connect)
