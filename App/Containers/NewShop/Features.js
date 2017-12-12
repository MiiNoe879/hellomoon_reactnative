import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner, ListItem, Switch, List } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from "./styles";
const {width, height} = Dimensions.get('window');

import { connect } from 'react-redux';

class Features extends React.Component {
	constructor(props) {
		super(props);
		this.state={
            features: this.props.features
        }
    }
    
    renderFeatures() {
        let items = [];
        let index = 0;
        for (let feature of this.state.features) {
            let i = index;
            items.push(<ListItem icon key={i}>
                <Left>
                    {this.renderIcon(index)}
                </Left>
                <Body>
                  <Text style={styles.whiteinput}>{feature.title}</Text>
                </Body>
                <Right>
                  <Switch value={feature.selected} onChange={()=>this.onChangeFeature(feature, i)}/>
                </Right>
              </ListItem>);
            index++;
        }
        return (
            items
        );
    }

    onChangeFeature(feature, index) {
        if(feature.selected)
            feature.selected = false;
        else
            feature.selected = true;
        let features = this.state.features;
        features[index] = feature;
        this.setState({features: features});
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
	
	render() {
		return (
            <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
                <Container>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left/>
                        <Body>
                            <Title style={styles.headertitle}>Features</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress = {()=>this.props.onClose(this.state.features)} style={styles.menubtn}>
                                <Text style={styles.whiteinput}>Done</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <List>
                            {this.renderFeatures()}
                        </List>
                    </Content>
                </Container>
            </ImageBackground>
		);
	}
}

const mapStateToProps = state => {
    return {
        shops: state.shops,
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(Features)
