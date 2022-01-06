import React from 'react';
import { StyleSheet, View,TouchableOpacity, ImageBackground, Text, Image } from 'react-native';
import Highlighter from 'react-native-highlight-words';
import { curSearchText } from './main_page/SearchHeader';
import { stateEditPage } from './edit_page/EditPage';
import {getPixelScaleRatio, getLowerDimension } from '../Utils';
import {setDragKey} from './DraggableList';
import Indexer from '../assets/Indexer';
import FolderManager from '../FolderManager';
import { select, isSelectMode, toggleSelect } from '../SelectMode';




export const getNoteSize = () => {
    return getLowerDimension() * 0.34;
}
export default Note = props => {
    if(props.isHidden) return null;
    const thisNote = props.note;
    const sizeMult = thisNote?.isFolder?0.34:0.34;
    const renderStyle = {
        width:getLowerDimension()*sizeMult,
        height: getLowerDimension()*sizeMult,
        backgroundColor: thisNote?.isFolder?null:'white',
        borderRadius: thisNote?.isFolder?null:5,
        elevation: thisNote?.isFolder?null:7,
    };
    let onPress;
    if(thisNote.isFolder) {
        onPress = ()=>{
            setDragKey(null);
            if(!isSelectMode)
                FolderManager.changeFolder({id:thisNote.id, data:thisNote.value.folderData});
            else 
                toggleSelect(thisNote.id);
        }
    }
    else if(thisNote.isBackBtn){
        onPress = ()=>{
            setDragKey(null);
            if(!isSelectMode)
                FolderManager.back();
        }
        
    }
    else {
        onPress = ()=>{
            setDragKey(null);
            if(!isSelectMode)
                stateEditPage({isShown: true, target: thisNote, isNew:false});
            else 
                toggleSelect(thisNote.id);
        }
        
    }
    const renderSelected = () =>{
        if(thisNote.isSelected){
            return (
                <Image style={styleSheet.checkbox} source={Indexer.getAsset('check2-circle.png')}/>
            )
        }
        else {
            return null;
        }
    }
    const renderText = ()=> {

        
        if(thisNote.isFolder) {
            return (
            <ImageBackground style = {styleSheet.image} source={Indexer.getAsset("folder.png")}>
                <Highlighter numberOfLines={1} highlightStyle={{backgroundColor: 'yellow'}} style={[styleSheet.title, styleSheet.titleFolder]} textToHighlight={props.title} searchWords={[curSearchText]}/>
                
            </ImageBackground> 
            )
        }
        else if(thisNote.isBackBtn) {
            return (
                <ImageBackground style = {styleSheet.imageBackBtn}  source={Indexer.getAsset("folder.png")}>
                    <Image style={styleSheet.imageArrow} source={Indexer.getAsset("arrow-return-left.png")}/>
                   
                </ImageBackground> 
            )
        }
        else {
            return (
                <View style = {styleSheet.image} source={null}>
                    <Highlighter numberOfLines={1} highlightStyle={{backgroundColor: 'yellow'}} style={styleSheet.title} textToHighlight={props.title} searchWords={[curSearchText]}/>
                    <Highlighter numberOfLines={5} highlightStyle={{backgroundColor: 'yellow'}} style={styleSheet.text} textToHighlight={props.text} searchWords={[curSearchText]}/>
                    
                </View> 
            )
        }
    }
    //thisNote?.isBackBtn?null:setDragKey.bind(this, props.id)
    return (
            <TouchableOpacity style = {[styleSheet.main, renderStyle]}
                 onPress={onPress}
                 onPressIn={()=>{
                     if(!isSelectMode && !thisNote.isBackBtn)
                        setDragKey(props.id);
                    }}
                 delayPressIn={100}
                 onLongPress={()=>{
                        if(!isSelectMode && !thisNote.isBackBtn) {
                            setDragKey(null);
                            select(thisNote.id);
                        }   
                    }}
                 delayLongPress={500}
                 >
                    {renderText()}
                    {renderSelected()}
            </TouchableOpacity>
        
    );
}

const styleSheet = StyleSheet.create({
    main: {
        alignSelf:"flex-start",
       
    },
    image: {
        flex:1,
        padding: 10,
        paddingTop: 8,
        margin: -2,
        

    },
    imageBackBtn: {
        flex:1,
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",

    },
    imageArrow: {
        height:82*getPixelScaleRatio(720),
        width:82*getPixelScaleRatio(720),
    },
    title:{
        fontSize: 14*getPixelScaleRatio(720),
        marginTop:"5%",
        marginLeft:"5%",
        fontWeight: 'bold',
    },
    titleFolder:{
        marginTop:"15%"
    },
    text: {
        fontSize:14*getPixelScaleRatio(720),

        marginTop:"5%",
        marginLeft:"5%",
    },
    checkbox:{
        position:"absolute",
        bottom:0,
        right:0,
        height:12*getPixelScaleRatio(720),
        width:12*getPixelScaleRatio(720),
        marginRight:"10%",
        marginBottom:"10%"
    }
});

