import * as React from "react";
import { Dimensions, Modal, TouchableOpacity } from "react-native";
import { View } from "native-base";
import ImageLoad from '../../Components/ImageLoad/ImageLoad';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class Instagram extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
        }
	}
	
	componentWillReceiveProps(nextProps) {
        // console.log('current props = ', this.props.images);
        // console.log('next props', nextProps.images);
        if(nextProps.images.length !== this.props.images.length){
            this.setState({images: nextProps.images});
            this.forceUpdate();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.log('props next', nextProps.images.length);
        // console.log('props state', nextState.images.length);
        if(nextProps.images.length == nextState.images.length)
            return false;
        return true;
    }

    renderView(images) {
        let items = [];
        let key = new Date().getTime();
        let index = 0;
        for(let item of images){
            key += index;
            items.push(
                <TouchableOpacity onPress={() => this.props.openDetail(item.thumbnail_src, item.date)} key={key}>
                    <ImageLoad 
                        source={{uri: item.thumbnail_resources[0].src}}
                        style={{width: deviceWidth/3-20, height: deviceWidth/3-20,marginBottom: 5}}
                        imageStyle={{resizeMode: 'stretch', borderRadius: 10}}
                        placeholderStyle={{width: deviceWidth/3-20, height: deviceWidth/3-20, resizeMode: 'stretch'}}
                    />
                </TouchableOpacity>
            );
            index++;
        }
        let resultitems = [];
        let row = [];
        index = 0;
        for(let item of items){
            if(index % 6 === 5){
                row.push(item);
                resultitems.push(row);
                row = [];
            }
            else
                row.push(item);
            index++;
        }
        if(index%6 !== 0 ){
            resultitems.push(row);
        }
        key = new Date().getTime();
        let result = [];
        for(let resultitem of resultitems){
            key += index;
            result.push(
                <View style={{flexDirection: 'row'}} key={key}>
                    <View style={{width: deviceWidth-40, height: (deviceWidth/3-20)*2+10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent:'space-between', marginLeft: 10, marginRight: 10}}>
                        {resultitem}
                    </View>
                </View>
            );
            index++;
        }
        return result;
    }

	render() {
        const images = this.state.images;
		return (
            <View style={{flexDirection: 'row'}}>
                { this.renderView(images) }
            </View>
		);
	}
}
