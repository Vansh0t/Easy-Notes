import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { getPixelScaleRatio } from '../Utils';
import { addNewFolder } from '../NoteDataUtils';
import FolderManager from '../FolderManager';
  
export let setContextMenuShown;
export let isContextMenuShown;
export default ContextMenu = (props) => {
  [isContextMenuShown, setContextMenuShown] = useState(false);
  let newFolderName = "";
  const onInput = (text) =>{
    newFolderName = text;
  }
  const addFolder = () =>{
    let updatedDataList = [...FolderManager.getCurrentDataList()];
    let folder = addNewFolder(updatedDataList, newFolderName);
    FolderManager.refreshList(true, updatedDataList);
    setTimeout(FolderManager.scrollToEnd.bind(true), 50);
    setContextMenuShown(false);
    return folder;
}
    return (
      <View style={[props.style]}>
        <Menu onBackdropPress={()=>{setContextMenuShown(false)}} opened = {isContextMenuShown}>
          <MenuTrigger disabled={true}/>
          
          <MenuOptions customStyles={containerStyles}>
            <Text style={styleSheet.title}>Creating new folder</Text>
            <TextInput onChangeText={onInput} placeholder={"Folder name"} style={styleSheet.textInput}/>
            <View style = {styleSheet.optContainer}>
              <MenuOption style={[styleSheet.option, styleSheet.optionBorder]} onSelect={() => setContextMenuShown(false)} >
                <Text style={styleSheet.text}>Cancel</Text>
              </MenuOption>
              <MenuOption style={styleSheet.option} onSelect={addFolder} >
                <Text style={styleSheet.text}>Save</Text>
              </MenuOption>
            </View>
          </MenuOptions>
        </Menu>
      </View>
    )
}
const containerStyles = {
  optionsContainer: {
    position:"relative",
    backgroundColor: '#FFE0A4',
    width:"60%",
  }
    
}
const styleSheet = StyleSheet.create({
  option: {
    flex:1,
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",
    paddingVertical:"5%",
    
  },
  optionBorder: {
    borderRightWidth:1.5,
    borderColor:"white",
    
  },
  text: {
    fontSize:14*getPixelScaleRatio(720),
    textAlignVertical:"center",
    
  },
  textInput:{
    width:"82%",
    height:36 * getPixelScaleRatio(720),
    backgroundColor:"white",
    borderRadius:4*getPixelScaleRatio(720),
    alignSelf:"center",
    fontSize:14*getPixelScaleRatio(720),
    paddingLeft:"10%",
  
    marginTop:"5%"
  }
  ,
  title:{
    fontSize:14*getPixelScaleRatio(720),
    fontWeight:"bold",
    alignSelf:"center",
    textAlign:"center",
    textAlignVertical:"center",
    marginTop:"5%"
  },
  optContainer:{
    flexDirection:"row",
    marginTop:"5%",
    borderTopWidth:1,
    borderColor:"white",
  }
  
});