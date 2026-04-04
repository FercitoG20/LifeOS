import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Presentacion from '../pantallas/Presentacion';
//import Presentacion from '../pantallas/autenticacion/Login';
import Login from '../pantallas/autenticacion/Login';
import SeleccionPerfil from '../pantallas/autenticacion/SeleccionPerfil';
import RegistroGeneral from '../pantallas/autenticacion/RegistroGeneral'; 
import DashboardGeneral from '../pantallas/general/DashboardGeneral';

const Stack = createStackNavigator();
export default function ManejadorRutas() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Presentacion"
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
        }}
      >
        <Stack.Screen name="Presentacion" component={Presentacion} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SeleccionPerfil" component={SeleccionPerfil} />
        <Stack.Screen name="RegistroGeneral" component={RegistroGeneral} />
        <Stack.Screen name="DashboardGeneral" component={DashboardGeneral} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}