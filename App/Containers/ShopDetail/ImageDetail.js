import * as React from "react";
import { Image, Dimensions, TouchableOpacity, Platform, Linking } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';
import ImageLoad from '../../Components/ImageLoad/ImageLoad';
const datesBetween = require('dates-between');

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56);

export default class ImageDetail extends React.Component {
	
	constructor(props) {
		super(props);
		const today = new Date();
		const dest = new Date(this.props.date*1000);
		
		let mils = today.getTime() - this.props.date*1000;
		var seconds = (mils / 1000) | 0;
		mils -= seconds * 1000;
		
		var minutes = (seconds / 60) | 0;
		seconds -= minutes * 60;
		
		var hours = (minutes / 60) | 0;
		minutes -= hours * 60;
		
		var days = (hours / 24) | 0;
		hours -= days * 24;
		
		var weeks = (days / 7) | 0;
		days -= weeks * 7;
		this.state = {
			date: weeks
		};
	}

	openURL(handle) {
		Linking.openURL('https://www.instagram.com/'+handle);
	}

	render() {
		return (
			<Container>
				<Header iosBarStyle="light-content" style={{backgroundColor: 'black', borderBottomColor: 'transparent'}}>
					<Left>
                        <Button transparent onPress = {this.props.onClose} >
							<IconFeather name="minimize-2" style={{color: 'white', fontSize: 30}}/>
						</Button>
                    </Left>
					<Body>
						<Title></Title>
					</Body>
					<Right/>
				</Header>
				<Content style={{backgroundColor: 'black'}} scrollEnabled={false}>
                    <View style={{width: deviceWidth, height: deviceHeight-toolBarHeight, marginTop: deviceHeight/4-toolBarHeight}}>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginLeft: 10, marginRight: 10}}>
							<TouchableOpacity onPress = {() => this.openURL(this.props.handle)} style={{flexDirection: 'row'}}>
								<IconFeather name="instagram" style={{color: 'white', fontSize: 30, marginRight: 10}}/>
								<Text style={{ color: 'white', lineHeight: 30 }}>{this.props.handle}</Text>
							</TouchableOpacity>
							<View style={{flexDirection: 'row'}}>
								<IconIonic name="ios-time-outline" style={{color: 'white', fontSize: 30, marginRight: 10}}/>
								<Text style={{color: 'white', lineHeight: 30}}>{this.state.date}W</Text>
							</View>
						</View>
                        <ImageLoad 
                            style={{width: deviceWidth, height: deviceHeight/2}}
                            imageStyle={{resizeMode: 'stretch'}}
                            source={{uri: this.props.uri}}
                            placeholderStyle={{width: deviceWidth, height: deviceHeight/2, resizeMode: 'stretch'}}
                        />
                    </View>
				</Content>
			</Container>
		);
	}
}
