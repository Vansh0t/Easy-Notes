import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import FolderManager from '../../FolderManager';
import { getPixelScaleRatio } from '../../Utils';

//<Image source={Indexer.getAsset('3bars_vert.png')}/>

export let curSearchText;
export default SearchHeader = props => {
    const updateSearchResults =(filter)=>{
        filterLower = filter.toLowerCase();
        const updated = FolderManager.getCurrentDataList().map(_ => (
            (filter!='' && !_.value.title.toLowerCase().includes(filterLower) && !_.value.text.toLowerCase().includes(filterLower))? {..._, isHidden:true}: {..._, isHidden:false}))
        FolderManager.refreshList(false, updated);
        curSearchText = filter;
    }
    return (
        <View style = {styleSheet.main}>
            <View style={styleSheet.sub1}>
                <Text style={{fontSize:18*getPixelScaleRatio(720)}}>Notes</Text>
            </View>

            <View style={styleSheet.sub2}>
                <TextInput style={styleSheet.textInput} onChangeText={text=>updateSearchResults(text)} placeholder={'Search'} />
            </View>


        </View>
    );
}

const styleSheet = StyleSheet.create({
    main:{
        alignSelf: 'stretch'
    },
    sub1:{
        justifyContent : 'center',
        alignItems:'center',
        flex:1,
        flexDirection: 'row',
        padding:'10%',
        
    },
    sub2:{
        flexDirection: 'row',
        justifyContent : 'center',
        alignItems:'center',
    },
    textInput:{
        backgroundColor: 'white',
        width:'73%',
        borderRadius: 20 * getPixelScaleRatio(720),
        height: 42 * getPixelScaleRatio(720),
        textAlign : 'center',
        fontSize: 14 * getPixelScaleRatio(720),
        color:"#4A4A4A"

    }
    
});
