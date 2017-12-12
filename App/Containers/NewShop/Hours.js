import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner, ListItem } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from "./styles";
const {width, height} = Dimensions.get('window');

import { connect } from 'react-redux';

class Hours extends React.Component {
	constructor(props) {
		super(props);
		this.state={
            hours: this.props.hours
        }
        this.selectedIndex = 0;
        this._showOpenDateTimePicker = this._showOpenDateTimePicker.bind(this);
        this._hideOpenDateTimePicker = this._hideOpenDateTimePicker.bind(this);
        this._handleOpenDatePicked = this._handleOpenDatePicked.bind(this);
        this._showCloseDateTimePicker = this._showCloseDateTimePicker.bind(this);
        this._hideCloseDateTimePicker = this._hideCloseDateTimePicker.bind(this);
        this._handleCloseDatePicked = this._handleCloseDatePicked.bind(this);
    }
    
    _showOpenDateTimePicker(i){
        this.setState({ isOpenDateTimePickerVisible: true })
        this.selectedIndex = i;
    };
    
    _hideOpenDateTimePicker(){
        this.setState({ isOpenDateTimePickerVisible: false });
    }

    _handleOpenDatePicked(date){
        var d = new Date(date);
        var n = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let hours = this.state.hours;
        let hour = hours[this.selectedIndex];
        hour.open = n;
        n = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
        hour.open_real = n;
        hours[this.selectedIndex] = hour;
        this.setState({hours: hours});
        this._hideOpenDateTimePicker();
    }

    _showCloseDateTimePicker(i){
        this.setState({ isCloseDateTimePickerVisible: true });
        this.selectedIndex = i;
    }
    
    _hideCloseDateTimePicker() {
        this.setState({ isCloseDateTimePickerVisible: false });
    }

    _handleCloseDatePicked(date){
        var d = new Date(date);
        var n = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let hours = this.state.hours;
        let hour = hours[this.selectedIndex];
        hour.close = n;
        n = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
        hour.close_real = n;
        hours[this.selectedIndex] = hour;
        this.setState({hours: hours});
        this._hideCloseDateTimePicker();
    }

    renderHours() {
        let items = [];
        let index = 0;
        for (let hour of this.state.hours) {
            let i = index;
            items.push(
                <View key={index}>
                    <ListItem itemDivider>
                        <Text>{hour.title}</Text>
                    </ListItem>
                    <Item stackedLabel last>
                        <View style={{flexDirection:'row', width: width, paddingTop: 20, marginLeft: 15,marginBottom: 5, height: 45}}>
                            <View style={{flexDirection: 'row',flex: 0.5}}>
                                <TouchableOpacity onPress={()=>this._showOpenDateTimePicker(i)}>
                                    <Label style={styles.label}>Open : </Label>
                                </TouchableOpacity>
                                <Text style={styles.whiteinput}>{hour.open}</Text>
                            </View>
                            <View style={{marginRight: 35, flexDirection: 'row',flex: 0.5}}>
                                <TouchableOpacity onPress={()=>this._showCloseDateTimePicker(i)}>
                                    <Label style={styles.label}>Close : </Label>
                                </TouchableOpacity>
                                <Text style={styles.whiteinput}>{hour.close}</Text>
                            </View>
                        </View>
                    </Item>
                </View>
            );
            index++;
        }
        return (
            items
        );
    }
	
	render() {
		return (
            <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
                <Container>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left/>
                        <Body>
                            <Title style={styles.headertitle}>Hours</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress = {()=>this.props.onClose(this.state.hours)} style={styles.menubtn}>
                                <Text style={styles.whiteinput}>Done</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <Form>
                            {this.renderHours()}
                        </Form>
                    </Content>
                </Container>
                <DateTimePicker
                    isVisible={this.state.isOpenDateTimePickerVisible}
                    onConfirm={this._handleOpenDatePicked}
                    onCancel={this._hideOpenDateTimePicker}
                    mode='time'
                    titleIOS = 'Pick a Time'
                />
                <DateTimePicker
                    isVisible={this.state.isCloseDateTimePickerVisible}
                    onConfirm={this._handleCloseDatePicked}
                    onCancel={this._hideCloseDateTimePicker}
                    mode='time'
                    titleIOS = 'Pick a Time'
                />
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
export default connect(mapStateToProps, mapDisaptchToProps)(Hours)
