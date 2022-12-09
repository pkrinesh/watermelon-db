import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Root from './src/components/Root';
import Blog from './src/components/Blog';
import Post from './src/components/Post';
import ModerationQueue from './src/components/ModerationQueue';

const Stack = createNativeStackNavigator();

const App = () => {
  const [timeToLaunch] = React.useState(new Date().getTime() - 0);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Root}
          initialParams={{timeToLaunch}}
        />
        <Stack.Screen name="Blog" component={Blog} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="ModerationQueue" component={ModerationQueue} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
