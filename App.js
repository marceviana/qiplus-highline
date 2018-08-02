import React from 'react';
import Root from './src/native/index';
import configureStore from './src/store/index';
import Reactotron from 'reactotron-react-native'


const { persistor, store } = configureStore();

Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

export default function App() {
  return <Root store={store} persistor={persistor} />;
}
