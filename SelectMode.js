import React from "react";
import { Share} from "react-native";
import FolderManager from "./FolderManager";
import { setSelectMode } from "./components/main_page/Footer";

export let isSelectMode = false;
export let selectedCount = 0;

const onSelectOp = () => {
    if(selectedCount==0) {
        isSelectMode = false;
        setSelectMode(false);
    }
    else {
        isSelectMode = true;
        setSelectMode(true);
    }
}

export const select = (id) =>{
    const updated = FolderManager.getCurrentDataList().map(_ => (
        _.id===id? {..._, isSelected: true}: _
  ))
  FolderManager.refreshList(false, updated);
  selectedCount++;
  onSelectOp();
}

export const toggleSelect = (id) =>{
  const updated = FolderManager.getCurrentDataList().map(_ => {
      const toggle = !_.isSelected;
    if(_.id===id) {
        if(toggle)
            selectedCount++;
        else
            selectedCount--;
        return {..._, isSelected: toggle}
    }
    else
        return _;
  })
  FolderManager.refreshList(false, updated);
  onSelectOp();
}

export const deselect = (id) =>{
    const updated = FolderManager.getCurrentDataList().map(_ => (
        _.id===id? {..._, isSelected: false}: _
  ))
  FolderManager.refreshList(false, updated);
  selectedCount--;
  onSelectOp();
}

export const deselectAll = () =>{
  const updated = FolderManager.getCurrentDataList().map(_ => (
    {..._, isSelected: false}
))
  FolderManager.refreshList(false, updated);
  selectedCount=0;
  onSelectOp();
}

export const deleteSelected = ()=>{
   if(isSelectMode) {
    const updated = FolderManager.getCurrentDataList().filter(_ => !_.isSelected);
    FolderManager.refreshList(true, updated);
    selectedCount = 0;
    onSelectOp();
   }
    
  
}
export const shareSelected = async () => {
    try {
        if(selectedCount <=0) return;
        strMessage = ""
        FolderManager.getCurrentDataList().forEach(_=>{
            
            if(_.isSelected) {
                if(_.isFolder) {
                    strMessage += `${_.value.title}: [\n\n`;
                    _.value.folderData.forEach(__=>{
                        
                        if(!__.isBackBtn) 
                            strMessage += `${__.value.title}: ${__.value.text}\n\n`;
                    })
                    strMessage += ']\n\n'
                }
                else
                    strMessage += `${_.value.title}: ${_.value.text}\n\n`;
            }
            
        });  
      const result = await Share.share({
        title:"TinyNote",
        message: strMessage,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

