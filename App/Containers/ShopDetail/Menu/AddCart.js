import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "../styles";
const {width, height} = Dimensions.get('window');
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56);

import { connect } from 'react-redux';

class AddCart extends React.Component {
	
	constructor(props) {
        super(props);
        
		this.state={
            item: this.props.Itemlist.item,
            price: this.props.Itemlist.price,
            extraItem: [
                {subItem: 'With Almond Milk', price: '0.50',count: 0,minusStatus: false, plusStatus: true},
                {subItem: 'Add Ice', price: '0.25',count: 0,minusStatus: false, plusStatus: true},
                {subItem: 'With Soy Milk', price: '0.50',count: 0,minusStatus: false, plusStatus: true}
            ],
            totalPrice: this.props.Itemlist.price,

        }
        const {fetching} = this.props.login;
       
    }
    
    onAddCart() {
        
        if(this.props.login.email == null){
            alert("please login")
        } else {
            alert(JSON.stringify(this.state))
        }
    }

    minusClick(i) {
        const target = this.state.extraItem[i].count-1
        const item = Object.assign([],this.state.extraItem)
        if(target >= 0)
            item[i].count = target;
        if(target==0 && item[i].minusStatus == true)
            item[i].minusStatus = false;
        this.setState({extraItem:item})

    }

    plusClick(i) {     
        const target = this.state.extraItem[i].count+1
        const item = Object.assign([],this.state.extraItem)
        item[i].count = target;
        if(target>0 && item[i].minusStatus == false)
            item[i].minusStatus = true;
        this.setState({extraItem:item})
    }

    totalcalcu(nextState) {
       
        prevtotalPrice = parseFloat(this.state.price);
        const extra = nextState.extraItem;
        let total = 0;
        for(i=0; i<extra.length;i++){
            total += parseFloat(extra[i].price) * extra[i].count 
        }
       
        let newtotalPrice = parseFloat(prevtotalPrice) + parseFloat(total);
        return newtotalPrice;

    }

    componentDidUpdate(nextProps, nextState) {

        let totalUpdatedPrice = this.totalcalcu(nextState);
        if(parseFloat(nextState.totalPrice) != totalUpdatedPrice){
            this.setState({ totalPrice: totalUpdatedPrice})
        }

    }
	
	render() {
       
        const self = this;   
       
		return (
            <ImageBackground source={require('../../../Resources/Images/background.png')} style={styles.bg}>
                <Container>
                    <Header style={styles.header} iosBarStyle="light-content">
                        <Left>
                            <Button transparent onPress = {()=>this.props.onClose(this.state)}>
                                <Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title style={styles.headertitle}>ADD TO CART</Title>
                        </Body>
                        <Right/>
                    </Header>

                    <Content style={styles.content}> 

						<View style={{marginTop: 80, marginLeft: 30, marginBottom: 30}}>
							<Text style={{color:'white', fontWeight:'bold', fontSize: 14}}>{this.state.item}</Text>							
						</View>
                       
                        <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center',padding:30, height: 50}}>
                            <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-start'}}>
                                <Text style={{color: 'yellow',textAlign:'center'}}>Regular</Text>
                            </View>                          
                            <Text style={{color: 'yellow',marginLeft: 100}}>${this.state.price}</Text>
                            <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end'}}>
                                <Image source={require("../../../Resources/Images/checkmark-enabled.png")} style={{width: 20, height: 20}}/>                                
                            </View>
                        </View>

					</Content>
                    <View style={{position: 'absolute',left: 0, right: 0, bottom: toolBarHeight, backgroundColor: '#5f5f5f', height: 140, paddingTop: 10,  paddingBottom: 10}}>
                        { 
                            this.state.extraItem.map(function(Item,index){
                                const minusIcon = Item.minusStatus ? 
                                    require('../../../Resources/Images/minus-enabled.png'):
                                    require('../../../Resources/Images/minus-disabled.png')
                                const plusIcon = Item.plusStatus ? 
                                    require('../../../Resources/Images/plus-enabled.png'):
                                    require('../../../Resources/Images/plus-disabled.png')
                                return (
                                    <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center',padding:20, height: 40}}>
                                        <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-start'}}>
                                            <Text style={{color: 'white',textAlign:'center'}}>{Item.subItem}</Text>
                                        </View>                          
                                        <Text style={{color: 'white',marginLeft: 30}}>${Item.price}</Text>
                                        
                                        <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end'}}>
                                            <Button transparent onPress={()=>self.minusClick(index)} >
                                                <Image  source={minusIcon} style={{width: 20, height: 20}}/>
                                            </Button>
                                            <Text style={{color: 'white',marginTop: 10}}>{Item.count}</Text>
                                            <Button transparent onPress = {()=>self.plusClick(index)} >
                                                <Image  source={plusIcon} style={{width: 20, height: 20}}/>
                                            </Button>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        

					</View>
                    
                    <Footer style={[styles.footer, {height: toolBarHeight}]}>
                        <View style={{backgroundColor: 'yellow'}}>
                           <TouchableOpacity onPress={() => this.onAddCart()} style={[styles.footertouchButton,{height: toolBarHeight}]}>
                                    <Left>
                                        <Text style={{color:'#44b1c2'}}>ADD NOW</Text>
                                    </Left>
                                    <Right>
                                        <Image source={require('../../../Resources/Images/onBoardingArrow.png')} />
                                    </Right>
                                </TouchableOpacity>
                        </View>
                       
                    </Footer>
                    
                </Container>
            </ImageBackground>
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
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(AddCart)
