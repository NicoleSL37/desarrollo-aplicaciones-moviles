import * as React from 'react';
import { Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTabs from './HomeTabs';

function LoginScreen({ navigation }) {
  return (
    <Button title="Ingresar" onPress={() => navigation.navigate('Home')} />
  );
}

function PerfilScreen() {
  return <Text>Pantalla de Perfil</Text>;
}

function ConfiguracionScreen() {
  return <Text>Pantalla de Configuración</Text>;
}

const Drawer = createDrawerNavigator();

function DrawerMenu() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={HomeTabs} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Configuración" component={ConfiguracionScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}