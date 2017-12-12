import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "./styles";
const {width, height} = Dimensions.get('window');

import { connect } from 'react-redux';

class Address extends React.Component {
	
	constructor(props) {
		super(props);
		this.state={
            country: this.props.address.country,
            street: this.props.address.street,
            zipcode: this.props.address.zipcode,
            city: this.props.address.city,
            state: this.props.address.state
		}
	}
	
	render() {
		return (
            <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
                <Container>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left/>
                        <Body>
                            <Title style={styles.headertitle}>Address</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress = {()=>this.props.onClose(this.state)} style={styles.menubtn}>
                                <Text style={styles.whiteinput}>Done</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <Form>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Street</Label>
                                <Input style={styles.whiteinput} value={this.state.street} onChangeText={(street)=>this.setState({street:street})} />
                            </Item>
                            <Item stackedLabel last>
                                <Label style={styles.label}>City</Label>
                                <Input style={styles.whiteinput} value={this.state.city} onChangeText={(city)=>this.setState({city:city})} />
                            </Item>
                            <Item stackedLabel last>
                                <Label style={styles.label}>State</Label>
                                <Input style={styles.whiteinput} value={this.state.state} onChangeText={(state)=>this.setState({state:state})} />
                            </Item>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Zip Code</Label>
                                <Input style={styles.whiteinput} value={this.state.zipcode} onChangeText={(zipcode)=>this.setState({zipcode:zipcode})} />
                            </Item>
                        </Form>
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
export default connect(mapStateToProps, mapDisaptchToProps)(Address)
