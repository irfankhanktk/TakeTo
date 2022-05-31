//core
import { useTheme } from "@react-navigation/native";
import * as React from "react";
//exnternal

//internal imports
import * as Images from "../../../resource/assets/tabbar-icons";
import { mvs } from "../../config/metrices";

//this component is used to retirn icon for bottom tab bar
export default function BottomMenuIcon({name,focused}) {
  // console.log({name,focused})
  const TabBarIconsComponent = Images[name + ((focused && "active") || "")];
  return <TabBarIconsComponent height={mvs(21)} width={mvs(21)} />;
}
