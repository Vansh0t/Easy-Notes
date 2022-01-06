import React, { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import Note, {getNoteSize} from '../Note';
import DraggableList from '../DraggableList';
import { getLowerDimension, getPixelScaleRatio } from '../../Utils';

export let setData;
export let refresh;
export let setRefresh;
export let dataList;
export let setDragEnabled;
export let dragEnabled;

export default MainContent = props => {
    [dataList, setData] = useState([]);
    return (
        <View style={styleSheet.main}>
            <DraggableList 
                spacing={getLowerDimension()*0.05}
                itemSize = {{width:getNoteSize(), height:getNoteSize()}}
                containerStyle = {styleSheet.container}
                itemStyle = {styleSheet.item}
                dragEnabled = {true}
                data={dataList}
                renderItem = {itemData=>(
                    <Note id = {itemData.id} note={itemData} title={itemData.value.title} text={itemData.value.text} isHidden={itemData.isHidden}/>
                )}
             />
             
        </View>
    );
}

const styleSheet = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:"center",
        alignContent:"center",
        alignSelf:"center",
        alignItems:"center",
        marginHorizontal:'5%',
        marginTop:"7%",
    },
    container: {
        flex: 1,
        alignSelf:"center",
        marginLeft:"7%",
    },
    item: {
      alignSelf:"center",
      borderColor:"black",
      padding:"1%",
      borderRadius:5 * getPixelScaleRatio(720),
    },
});