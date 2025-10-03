import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CalendarioScreen from '../screens/CalendarioScreen';
import MapaScreen from '../screens/MapaScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  // Obtener los parámetros de la ruta principal
  const user = route?.params?.user || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={{ user }}
        options={{
          title: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarioScreen}
        options={{
          title: 'Calendario',
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapaScreen}
        options={{
          title: 'Mapa',
        }}
      />
    </Tab.Navigator>
  );
}
