import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from "react-native";


export const getPixelScaleRatio = (targetSize) =>{
  const dim = Dimensions.get("window");
  const scale = dim.width*dim.scale /targetSize;
  return scale;
}


export function getOverlap(rectangle1, rectangle2) {
    const intersectionX1 = Math.max(rectangle1.x, rectangle2.x);
    const intersectionX2 = Math.min(rectangle1.x + rectangle1.width, rectangle2.x + rectangle2.width);
    if (intersectionX2 < intersectionX1) {
      return false;
    }
    const intersectionY1 = Math.max(rectangle1.y, rectangle2.y);
    const intersectionY2 = Math.min(rectangle1.y + rectangle1.height, rectangle2.y + rectangle2.height);
    if (intersectionY2 < intersectionY1) {
      return false;
    }
    return true;
}
export const storeData = async (key,value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.error(e);
  }
}
export const getData = async (key) => {
  try {
    let jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.error(e);
  }
}
export const getLowerDimension = ()=>{
  let dms= Dimensions.get('window');
  if (dms.height < dms.width) {
      return dms.height;
  }
  else {
      return dms.width;
  }
}