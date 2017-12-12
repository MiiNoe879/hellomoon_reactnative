import React from "react";
import { TabNavigator } from "react-navigation";
import { Dimensions, StyleSheet, Platform } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Tabs, Tab } from "native-base";
import ABOUT from "../Containers/ShopDetail/About.js";
import CONNECT from "../Containers/ShopDetail/Connect.js";
import MENU from "../Containers/ShopDetail/Menu.js";

const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)

const NavigationShopDetailTab = TabNavigator({
    ABOUT: {
      screen: ABOUT,
    },
    MENU: {
      screen: MENU,
    },
    CONNECT: {
      screen: CONNECT,
    },
  }, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: 'yellow',
      inactiveTintColor: 'white',
      activeBackgroundColor: 'transparent',
      inactiveBackgroundColor: 'transparent',
      showIcon: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderTopWidth: 0,
        height: toolBarHeight,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
      },
    }
});
  
export default NavigationShopDetailTab;
