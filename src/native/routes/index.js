import React from 'react';
import { Scene, Stack } from 'react-native-router-flux';
import { Icon } from 'native-base';
import { locale } from 'core-js';
import { translate } from '../../i18n';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import EventsContainer from '../../containers/Events';
import EventsComponent from '../components/Events';

import EventContainer from '../../containers/Event';
import EventViewComponent from '../components/Event';

import ParticipantsContainer from '../../containers/Participants';
import ParticipantsViewComponent from '../components/Participants';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import LocaleContainer from '../../containers/Locale';
import LocaleComponent from '../components/Locale';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/Profile';

// import HomeContainer from '../../containers/Home';
import AboutComponent from '../components/About';

import {createSwitchNavigator, createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import Ionicons from "@expo/vector-icons/Ionicons";

const setLayout = (Container, Component) => {
  return class extends React.Component {

    render() {
      return <Container Layout={Component} />
    }
  }
};

const EventsTabs = createBottomTabNavigator(
  {
    LivePosts: setLayout(EventContainer, EventViewComponent ),
    HotPosts: setLayout(EventContainer, EventViewComponent ),
    Participants: setLayout(ParticipantsContainer, ParticipantsViewComponent),
  },
  {
    initialRouteName: 'LivePosts',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName) {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

const EventsStack = createStackNavigator({
  Events: EventContainer,
  Event: EventsTabs,

});


const AppStack = createStackNavigator({
    Home: {
      screen: AboutComponent,
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'home',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${AppConfig.appName} `,
      }),
    },
    Events: {
      screen: setLayout(EventsContainer, EventsComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'events',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('events', locale)} `,
      }),
    },
    Event: EventsTabs,
    Profile: {
      screen: setLayout(MemberContainer, ProfileComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'profile',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('profile', locale)} `,
      }),
    },
    UpdateProfile: {
      screen: setLayout(UpdateProfileContainer, UpdateProfileComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'updateprofile',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('UpdateProfile', locale)} `,
      }),
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const AuthStack = createStackNavigator({
    Login:  {
      screen: setLayout(LoginContainer, LoginComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'login',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('login', locale)} `,
      }),
    },
    SignUp: {
      screen: setLayout(SignUpContainer, SignUpComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'signup',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('signUp', locale)} `,
      }),
    },
    ForgotPassword: {
      screen: setLayout(ForgotPasswordContainer, ForgotPasswordComponent),
      // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: 'forgotpassword',
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: `${translate('forgotPassword', locale)} `,
      }),
    } ,
  },
  {
    initialRouteName: 'Login',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

const Router = createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Auth',
  }
);

export default Router;

const Index = (
  <Stack>
    <Scene hideNavBar>
      <Stack
        key="home"
        title={AppConfig.appName}
        icon={() => <Icon name="planet" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
      >
        <Scene key="home" component={AboutComponent} />
      </Stack>

      <Stack
        key="events"
        title={translate('events', locale)}
        icon={() => <Icon name="albums" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
      >
        <Scene key="events" component={EventsContainer} Layout={EventsComponent} />
        <Scene
          back
          clone
          key="liveposts"
          title={translate('liveposts', locale)}
          component={EventContainer}
          Layout={EventViewComponent}
          {...DefaultProps.navbarProps}
        />
        <Scene
          back
          clone
          key="hotposts"
          title={translate('hotposts', locale)}
          component={EventContainer}
          Layout={EventViewComponent}
          {...DefaultProps.navbarProps}
        />
        <Scene
          back
          clone
          key="participants"
          title={translate('participants', locale)}
          component={ParticipantsContainer}
          Layout={ParticipantsViewComponent}
          {...DefaultProps.navbarProps}
        />
      </Stack>

      <Stack
        key="profile"
        title={translate('profile', locale)}
        icon={() => <Icon name="contact" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
      >
        <Scene key="profileHome" component={MemberContainer} Layout={ProfileComponent} />
        <Scene
          back
          key="signUp"
          title={translate('signUp', locale)}
          {...DefaultProps.navbarProps}
          component={SignUpContainer}
          Layout={SignUpComponent}
        />
        <Scene
          back
          key="login"
          title={translate('login', locale)}
          {...DefaultProps.navbarProps}
          component={LoginContainer}
          Layout={LoginComponent}
        />
        <Scene
          back
          key="forgotPassword"
          title={translate('forgotPassword', locale)}
          {...DefaultProps.navbarProps}
          component={ForgotPasswordContainer}
          Layout={ForgotPasswordComponent}
        />
        <Scene
          back
          key="locale"
          title={translate('locale', locale)}
          {...DefaultProps.navbarProps}
          component={LocaleContainer}
          Layout={LocaleComponent}
        />
        <Scene
          back
          key="updateProfile"
          title={translate('updateProfile', locale)}
          {...DefaultProps.navbarProps}
          component={UpdateProfileContainer}
          Layout={UpdateProfileComponent}
        />
      </Stack>
    </Scene>
  </Stack>
);

