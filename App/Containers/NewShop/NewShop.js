import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner, ListItem } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import IconIonic from 'react-native-vector-icons/Ionicons';

import Address from './Address';
import Hours from './Hours';
import Features from './Features';

import styles from "./styles";
const {width, height} = Dimensions.get('window');
import { EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_LOGIN } from '../../Constants/constants.js'

import DeviceInfo from 'react-native-device-info';
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
import ModalPickerImage from 'react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input'
import ImageLoad from '../../Components/ImageLoad/ImageLoad';

import { connect } from 'react-redux';
import ShopActions from "../../Redux/ShopRedux";

var ImagePicker = require('react-native-image-picker');

import { ERROR_SAVE } from '../../Constants/constants.js'

const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)

class NewShop extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: {
                country: 'United States',
                street: '',
                zipcode: '',
                city: '',
                state: ''
            },
            hours: [
                {
                    title: 'Sunday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Monday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Tuesday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Wednesday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Thursday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Friday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                },{
                    title: 'Saturday',
                    open: '',
                    close: '',
                    open_real: '',
                    close_real: ''
                }
            ],
            features: [
                {
                    title: 'Pet Allowed',
                    selected: false
                },{
                    title: 'Credit Card Allowed',
                    selected: false
                },{
                    title: 'Indoor seating Available',
                    selected: false
                },{
                    title: 'Wifi Provided',
                    selected: false
                },{
                    title: 'Parking Available',
                    selected: false
                },{
                    title: 'Patio Available',
                    selected: false
                },{
                    title: 'Serving Take Flight',
                    selected: false
                },
            ],
            phonenumber: '',
            instagram: '',
            url: '',
            cca2: 'US',
            shopImage: '',
            shops: {},
            modalAddressVisible: false,
            modalHoursVisible: false,
            modalFeaturesVisible: false
        }
        this.getShopDetail();
        this.onCloseModalAddress  = this.onCloseModalAddress.bind(this);
        this.onCloseModalHours  = this.onCloseModalHours.bind(this);
    }
    
    onSelectImage() {
        var options = {
            title: 'Select Image'
        };
        
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {
            }
            else {
                let source = { uri: response.uri };          
                this.setState({
                    shopImage: source
                });
            }
        });
    }

    setModalAddressVisible(visible) {
		this.setState({modalAddressVisible: visible});
    }
    
    onAddress() {
		this.setModalAddressVisible(true);
	}
	
	onCloseModalAddress(address) {
        this.setState({address: address});
		this.setModalAddressVisible(false);
    }

    setModalAddressVisible(visible) {
		this.setState({modalAddressVisible: visible});
    }

    setModalHoursVisible(visible) {
		this.setState({modalHoursVisible: visible});
    }
    
    setModalFeaturesVisible(visible) {
		this.setState({modalFeaturesVisible: visible});
    }

    onCloseModalFeatures(features) {
        this.setState({features: features});
		this.setModalFeaturesVisible(false);
    }
    
    onHours() {
		this.setModalHoursVisible(true);
    }
    
    onFeatures() {
		this.setModalFeaturesVisible(true);
	}
	
	onCloseModalHours(hours) {
        this.setState({hours: hours});
		this.setModalHoursVisible(false);
    }
    
    onSave() {
        const { selectedShopId } = this.props.shops;
        this.props.attemptSaveShop(this.state, selectedShopId);
    }
	
	componentWillReceiveProps(nextProps) {
		if(this.props.shops.error!=nextProps.shops.error){
			const {error} = nextProps.shops;
            const {message} = nextProps.shops;
            if(error == ERROR_SAVE){
                if(message)
                    alert(message);
                this.props.init()
            }
			else if(error){
                if(error!='error')
                    alert("You must fill out required fields")
                this.props.init()
			}
			else {
			}
        }
        else{
            let { fetching, shop, selectedShopId } = this.props.shops;
            if(selectedShopId){
                if(!fetching && selectedShopId!=0){
                    let obj = Object.assign({}, shop.address);
                    if(obj)
                        this.setState({address: obj});
                    else{
                        this.setState({cca2: 'US'});
                        this.setSteate({
                            address: {
                                street: '',
                                zipcode: '',
                                city: '',
                                state: '',
                                country: 'United States',
                            }
                        });
                    }
                    this.setState({name:shop.name});
                    if(shop.features){
                        this.setState({features: [
                            {
                                title: 'Pet Allowed',
                                selected: shop.features[0].selected
                            },{
                                title: 'Credit Card Allowed',
                                selected: shop.features[1].selected
                            },{
                                title: 'Indoor seating Available',
                                selected: shop.features[2].selected
                            },{
                                title: 'Wifi Provided',
                                selected: shop.features[3].selected
                            },{
                                title: 'Parking Available',
                                selected: shop.features[4].selected
                            },{
                                title: 'Patio Available',
                                selected: shop.features[5].selected
                            },{
                                title: 'Serving Take Flight',
                                selected: shop.features[6].selected
                            },
                        ]});
                    }
                    else{
                        this.setState({features: [
                            {
                                title: 'Pet Allowed',
                                selected: false
                            },{
                                title: 'Credit Card Allowed',
                                selected: false
                            },{
                                title: 'Indoor seating Available',
                                selected: false
                            },{
                                title: 'Wifi Provided',
                                selected: false
                            },{
                                title: 'Parking Available',
                                selected: false
                            },{
                                title: 'Patio Available',
                                selected: false
                            },{
                                title: 'Serving Take Flight',
                                selected: false
                            },
                        ]});
                    }
                    
                    const hours = shop.hours;
                    if(hours){
                        this.setState({
                            hours: [
                                {
                                    title: 'Sunday',
                                    open: hours[0].open,
                                    close: hours[0].close,
                                    open_real: hours[0].open_real,
                                    close_real: hours[0].close_real
                                },{
                                    title: 'Monday',
                                    open: hours[1].open,
                                    close: hours[1].close,
                                    open_real: hours[1].open_real,
                                    close_real: hours[1].close_real
                                },{
                                    title: 'Tuesday',
                                    open: hours[2].open,
                                    close: hours[2].close,
                                    open_real: hours[2].open_real,
                                    close_real: hours[2].close_real
                                },{
                                    title: 'Wednesday',
                                    open: hours[3].open,
                                    close: hours[3].close,
                                    open_real: hours[3].open_real,
                                    close_real: hours[3].close_real
                                },{
                                    title: 'Thursday',
                                    open: hours[4].open,
                                    close: hours[4].close,
                                    open_real: hours[4].open_real,
                                    close_real: hours[4].close_real
                                },{
                                    title: 'Friday',
                                    open: hours[5].open,
                                    close: hours[5].close,
                                    open_real: hours[5].open_real,
                                    close_real: hours[5].close_real
                                },{
                                    title: 'Saturday',
                                    open: hours[6].open,
                                    close: hours[6].close,
                                    open_real: hours[6].open_real,
                                    close_real: hours[6].close_real
                                }
                            ]
                        });
                    }
                    else{
                        this.setState({hours: [
                            {
                                title: 'Sunday',
                                open: '',
                                close: ''
                            },{
                                title: 'Monday',
                                open: '',
                                close: ''
                            },{
                                title: 'Tuesday',
                                open: '',
                                close: ''
                            },{
                                title: 'Wednesday',
                                open: '',
                                close: ''
                            },{
                                title: 'Thursday',
                                open: '',
                                close: ''
                            },{
                                title: 'Friday',
                                open: '',
                                close: ''
                            },{
                                title: 'Saturday',
                                open: '',
                                close: ''
                            }
                        ]});
                    }
                    
                    this.setState({phonenumber: shop.phonenumber});
                    this.setState({instagram: shop.instagram});
                    this.setState({url: shop.url});
                    this.setState({cca2: shop.cca2});
                    // if(shop.shopImage=='')
                    //     imageSrc = require('../../Resources/Images/background.png');
                    // else
                        imageSrc = { uri: shop.shopImage };
                    this.setState({shopImage: imageSrc});
                }
            }
        }
    }
         
    selectCountry(country){
        this.refs.phone.selectCountry(country.cca2.toLowerCase())
        this.setState({cca2: country.cca2})
    }

    getShopDetail() {
        const { selectedShopId } = this.props.shops;
        this.props.attemptShopInfo(selectedShopId);
    }

	render() {
        const { fetching, selectedShopId } = this.props.shops;
		return (
            <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
                <Container>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
                            </Button>
                        </Left>
                        <Body>
                            {
                                (selectedShopId==0) ?
                                    (<Title style={styles.headertitle}>New Shop</Title>)
                                :
                                    (<Title style={styles.headertitle}>Edit Shop</Title>)
                            }
                        </Body>
                        <Right>
                            {
                            (fetching) ? 
                                (<Spinner color='white' style={{height: 10}}/>)
                            :	(<Button transparent onPress={() => this.onSave()}>
                                <Text style={{color: 'white'}}>SAVE</Text>
                                </Button>)
                            }
                        </Right>
                    </Header>
                    <Content style={{marginBottom: toolBarHeight}}>
                        <Form>
                            <ListItem itemDivider>
                                <Text>Country</Text>
                            </ListItem>  
                            <Item stackedLabel last>
                                <View style={{flexDirection:'row',alignItems: 'flex-start', width: width, marginTop: 0}}>
                                    <CountryPicker
                                        onChange={(value)=> {
                                            this.setState({cca2: value.cca2});
                                            let address = this.state.address;
                                            address.country = value.name;
                                            this.setState({address: address});
                                        }}
                                        cca2={this.state.cca2}
                                        translation='eng'
                                        cancelText='Cancel'
                                        closeable={true}
                                        filterable={true}
                                    />
                                    <Text style={{color: 'white', height: 40, lineHeight: 40}}>{this.state.address.country}</Text>
                                </View>
                            </Item>
                            <ListItem itemDivider>
                                <Text>Required Information</Text>
                            </ListItem>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Name</Label>
                                <Input style={styles.whiteinput} autoCorrect={false} value={this.state.name} onChangeText={(name)=>this.setState({name:name})}/>
                            </Item>
                            <ListItem style={styles.listitem} icon onPress={() => this.onAddress()}>
                              <Body>
                                <Text style={[styles.whiteinput, {marginLeft: 15}]}>Address</Text>
                              </Body>
                              <Right>
                                <Icon name="arrow-forward" />
                              </Right>
                            </ListItem>
                            <ListItem itemDivider>
                                <Text>Optional Details</Text>
                            </ListItem>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Phone Number</Label>
                                <View style={{flexDirection:'row',alignItems: 'flex-start', width: width, paddingTop: 20, marginLeft: 15,marginBottom: 5, height: 45}}>
                                    <PhoneInput
                                        ref='phone'
                                        onChangePhoneNumber={(value) => this.setState({phonenumber: value})}
                                        textStyle={{color: 'white'}}
                                        value={this.state.phonenumber}
                                    />
                                </View>
                            </Item>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Shop Image</Label>
                                <View style={{flexDirection:'row',justifyContent: 'space-between', width: width, paddingTop: 20, marginLeft: 15,marginBottom: 5, height: 130}}>
                                    <ImageLoad 
                                        source={this.state.shopImage}
                                        loadingStyle={{ size: 'small', color: 'grey' }}
                                        placeholderSource={require('../../Resources/Images/background.png')}
                                        placeholderStyle={{width: 100, height: 100, resizeMode: 'stretch'}}
                                        style={{width: 100, height: 100}}
                                        imageStyle={{resizeMode: 'stretch'}}
                                        isShowActivity={false}
                                    />
                                    <Button transparent light onPress={() => this.onSelectImage()} style={{marginRight: 15}}>
                                        <Text>Select</Text>
                                    </Button>
                                </View>
                            </Item>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Instagram Handle</Label>
                                <Input autoCapitalize='none' style={styles.whiteinput} value={this.state.instagram} onChangeText={(instagram)=>this.setState({instagram:instagram})} />
                            </Item>
                            <ListItem style={styles.listitem} icon onPress={() => this.onHours()}>
                              <Body>
                                <Text style={[styles.whiteinput, {marginLeft: 15}]}>Hours</Text>
                              </Body>
                              <Right>
                                <Icon name="arrow-forward" />
                              </Right>
                            </ListItem>
                            <ListItem style={styles.listitem} icon onPress={() => this.onFeatures()}>
                              <Body>
                                <Text style={[styles.whiteinput, {marginLeft: 15}]}>Features</Text>
                              </Body>
                              <Right>
                                <Icon name="arrow-forward" />
                              </Right>
                            </ListItem>
                            <Item stackedLabel last>
                                <Label style={styles.label}>Website</Label>
                                <Input autoCapitalize='none' style={styles.whiteinput} value={this.state.url} onChangeText={(url)=>this.setState({url:url})} />
                            </Item>
                        </Form>
                    </Content>
                    <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle} />
                </Container>
                <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalAddressVisible}
					onRequestClose={() => {}}
				>
					<Address onClose={(address) => {this.onCloseModalAddress(address)}} address={this.state.address} />
				</Modal>
                <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalHoursVisible}
					onRequestClose={() => {}}
				>
					<Hours onClose={(hours) => {this.onCloseModalHours(hours)}} hours={this.state.hours} />
				</Modal>
                <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalFeaturesVisible}
					onRequestClose={() => {}}
				>
					<Features onClose={(features) => {this.onCloseModalFeatures(features)}} features={this.state.features} />
				</Modal>
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
        attemptShopInfo: (shopId) => dispatch(ShopActions.shopInfoRequest(shopId)),
        attemptSaveImage: (image) => dispatch(ShopActions.saveImage(image)),
        attemptSaveShop: (data, shopId) => { dispatch(ShopActions.saveShop(data, shopId))},
        init: () => dispatch(ShopActions.init()),
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(NewShop)
