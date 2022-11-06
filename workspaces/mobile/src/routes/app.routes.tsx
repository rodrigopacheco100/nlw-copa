import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { Platform } from "react-native";

import { Find } from "../screens/Find";
import { New } from "../screens/New";
import { Pools } from "../screens/Pools";

const { Navigator, Screen } = createBottomTabNavigator();

export const AppRoutes = () => {
  const { colors, sizes } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          position: "absolute",
          height: 64,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: "relative",
          top: Platform.OS === "android" ? -5 : 0,
        },
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: (props) => <PlusCircle {...props} size={sizes[6]} />,
          tabBarLabel: "Novo bolão",
        }}
      />
      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: (props) => <SoccerBall {...props} size={sizes[6]} />,
          tabBarLabel: "Meus bolões",
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
};
