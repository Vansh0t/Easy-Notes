import React, {useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image} from "react-native";
import Indexer from "../../assets/Indexer";
import { stateEditPage } from "../edit_page/EditPage";
import { getPixelScaleRatio } from "../../Utils";
import { deleteSelected, shareSelected } from "../../SelectMode";
import { setContextMenuShown } from "../ContextMenu";
import { addNewNote } from "../../NoteDataUtils";
import FolderManager from "../../FolderManager";




export let setSelectMode;
export let setNotesCount;
export let setCanCreateFolder;


export default Footer = props=>{
    [selectMode, setSelectMode] = useState(false);
    [notesCount, setNotesCount] = useState(0);
    [canCreateFolder, setCanCreateFolder] = useState(true);
    const addNote = () =>{
        let tempDataList = [...FolderManager.getCurrentDataList()];
        let note = addNewNote(tempDataList, "", "");
        FolderManager.refreshList(true, tempDataList);
        return note;
    }
    const folderBtn = () =>{
        if(canCreateFolder) {
            return (
                <TouchableOpacity style = {styleSheet.folderBtn} onPress={()=>setContextMenuShown(true)}>
                    <Image style={styleSheet.icons} source={Indexer.getAsset("folder_icon.png")}/>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity disabled={true} style = {[styleSheet.folderBtn, {opacity:0.5}]}>
                    <Image style={styleSheet.icons} source={Indexer.getAsset("folder_icon.png")}/>
                </TouchableOpacity>
            )
        }
    }
    if(!selectMode) 
        return (<View style={styleSheet.footer}>
                    {folderBtn()}
                    <Text style = {styleSheet.text}>{notesCount + (notesCount===1?" note":" notes")}</Text>
                    <TouchableOpacity style = {styleSheet.noteBtn} onPress={()=>{
                        let note = addNote();
                        stateEditPage({isShown: true, target: note, isNew:true});}}>
                        <Image style={styleSheet.icons} source={Indexer.getAsset("note_icon.png")}/>
                    </TouchableOpacity>
                </View>)
    else 
        return (<View style={styleSheet.footer}>
            {folderBtn()}
            <TouchableOpacity style = {styleSheet.deleteBtn} onPress={deleteSelected}>
                <Image style={styleSheet.icons} source={Indexer.getAsset("trash_icon.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style = {styleSheet.shareBtn}  onPress={shareSelected}>
                <Image style={styleSheet.icons} source={Indexer.getAsset("share_icon.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style = {styleSheet.noteBtn} onPress={()=>{
                let note = addNote();
                stateEditPage({isShown: true, target: note, isNew:true});}}>
                <Image style={styleSheet.icons} source={Indexer.getAsset("note_icon.png")}/>
            </TouchableOpacity>
        </View>)
    
    
}
const styleSheet = StyleSheet.create({
    footer: {
        flexDirection:"row",
        flex: 0.1,
        height: "15%",
        justifyContent:"space-between",
        alignContent:"center",
        alignItems:"center",
        
    },
    text: {
        textAlignVertical:"center",
        textAlign:"center",
        flex: 1.5,
        fontSize:14*getPixelScaleRatio(720),
        color:"#4A4A4A"

    },
    noteBtn: {
        flexDirection:"row",
        justifyContent:"center",
        flex: 1,
    },
    folderBtn: {
        flexDirection:"row",
        justifyContent:"center",
        flex: 1,
    },
    deleteBtn: {
        flexDirection:"row",
        flex:1,
        justifyContent:"center",
    },
    shareBtn: {
        flexDirection:"row",
        flex:1,
        justifyContent:"center",
    },
    icons: {
        height:18*getPixelScaleRatio(720),
        width:18*getPixelScaleRatio(720),
    }

});