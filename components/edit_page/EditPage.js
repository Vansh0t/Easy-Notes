import React, { useState } from "react";
import Modal from "react-native-modal";
import {View, Text, TextInput, StyleSheet, ScrollView,} from "react-native";
import FolderManager from "../../FolderManager";
import { getPixelScaleRatio } from "../../Utils";



export let stateEditPage;

export default EditPage = (props) =>{
    [editPageData, stateEditPage] = useState({isShown: false, target: null, isNew: false});
    let targetNote = editPageData.target;
    //This cannot to prevent empty target error on first render due to animationOut break
    //Using ?. everywhere instead
    //if(!targetNote) {
    //    
    //    return null;
    //}
    

    const onChangeTitle=(text)=>{
        targetNote.value.title = text;
    }
    const onChangeText=(text)=>{
        targetNote.value.text = text;
    }
    const handleBack=()=>{
        if(editPageData.isShown) {
          //If note is new, scroll to the end of the list
          if(editPageData.isNew)
            setTimeout(FolderManager.scrollToEnd.bind(true), 50);
          stateEditPage({isShown: false, target: null, isNew:false});
          const updated = FolderManager.getCurrentDataList().map(_ => (
            _.id===targetNote.id? {...targetNote}: _))
          FolderManager.refreshList(true, updated)
        }
    }
    return (
        <Modal style={styleSheet.modal}  coverScreen={true}  hasBackdrop={false} onBackButtonPress={handleBack}
          isVisible={editPageData.isShown} animationIn={'slideInLeft'} animationOut={'slideOutLeft'} useNativeDriver={true}>
            <View style={styleSheet.main}>
                <View style={styleSheet.sub1}>
                    <Text style={styleSheet.titleMain}>
                        Edit your Note...
                    </Text>
                </View>
                
                    <View style={styleSheet.sub2}>
                        <ScrollView>
                            <TextInput onChangeText={txt=>onChangeTitle(txt)} style={styleSheet.title} placeholder={"Note title"}>
                            {targetNote?.value.title}
                            </TextInput>
                            <TextInput multiline={true} onChangeText={txt=>onChangeText(txt)} style={styleSheet.text} placeholder={"Text"}>
                            {targetNote?.value.text}
                            </TextInput>
                        </ScrollView>
                    </View>
                
            </View>
        </Modal>
    )
    
}

const styleSheet = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor:"white"
        
    },
    main: {
        flex: 1,
    },
    sub1: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    sub2: {
        alignSelf: 'stretch',
        borderRadius: 5,
        flex: 10,
        paddingBottom:5,
        paddingTop:5
    },
    titleMain: {
        marginTop:"5%",
        fontSize:18*getPixelScaleRatio(720),
        fontWeight:'400',

    },
    title :{
        fontSize:14*getPixelScaleRatio(720),
        fontWeight:'700',
        padding: '7%'
    },
    text:{
        fontSize:14*getPixelScaleRatio(720),
        fontWeight:'400',
        padding: '7%',
        paddingTop:'-3%'
    }

});