import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Container, Text} from 'native-base'
import {Image, View} from 'react-native';

class SplashScreen extends Component {
	componentDidMount(){
		setTimeout(()=>{
			this.props.navigation.navigate('NavigationDrawer')
		},2000);		
	}

	render(){
		return(
			<Container>
				<Image source={require('../Resources/Images/splashScreenBg.png')} style={{width:'100%', height:'100%', resizeMode:'cover'}}/>
				<View style={{flex:1, position:'absolute', justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}}>
					<Image source={require('../Resources/Images/splashScreenLogo.png')}/>
				</View>				
			</Container>
			)
	}
}

export default connect()(SplashScreen);
