
import React, { useState } from 'react';
import { StyleSheet, View, StatusBar} from 'react-native';
import SearchHeader from './components/main_page/SearchHeader';

import MainContent from './components/main_page/MainContent';
import EditPage from './components/edit_page/EditPage';
import Footer from './components/main_page/Footer';
import { MenuProvider} from 'react-native-popup-menu';
import ContextMenu from './components/ContextMenu';
import FolderManager from './FolderManager';
import { initEvents } from './EventManager';


export let stateEditPage;

export default function App() {
  console.log("APP START")
  initEvents();
  FolderManager.loadData();
  return (
    
    <MenuProvider customStyles={menuProviderStyles}>
        <StatusBar barStyle={"dark-content"}/>
        < View style={styles.container}>
          
          <SearchHeader/>
          <MainContent/>
          <Footer/>
          <ContextMenu style = {styles.contextMenu}/>
          <EditPage/>
        </View>
    </MenuProvider >
  );
}
//console.log(Indexer.getAsset('3bars_vert.png'));
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE0A4',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contextMenu:{
    position:"absolute",
    right:"19.5%",
    top:"40%",

  },
  backdrop:{
    backgroundColor: 'black',
    opacity: 0.5,
  },
  statusBar: {
    position:"absolute",
    backgroundColor:"black",
    height:"20%",
    width:"25%",
  }
}
);
const menuProviderStyles = {
  backdrop: styles.backdrop,
};
