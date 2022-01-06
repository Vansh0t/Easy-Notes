import { setData, dataList } from "./components/main_page/MainContent";
import { refresh, resetScroll, scrollToEnd } from "./components/DraggableList";
import { setNotesCount, setCanCreateFolder } from "./components/main_page/Footer";
import { storeData,  getData} from "./Utils";
import { setNoteCounter } from "./NoteDataUtils";

export default class FolderManager {
    static folderId = -1;
    static dataLoaded = false;
    static constData;
    static loadData = async ()=>{
        if(this.folderId!==-1)
            this.back()
        this.constData = await getData("noteData");
        if(!this.constData) this.constData=[];
        setNoteCounter(this.constData);
        this.refreshList(false, this.constData);
        this.dataLoaded = true;
        setNotesCount(this.constData.length);
    }
    static updateConstData=(data)=>{
        prepData = data.map(_=>({..._, isHidden:false, isSelected:false}))
        if(this.folderId>-1) {
            this.constData.forEach(_=>{
                if(_.id==this.folderId) {
                    _.value.folderData = prepData;
                }
            })
        }
        else {
            this.constData = prepData;
        }
        console.log("SAVING DATA ", prepData);
        storeData("noteData", this.constData);
    }
    static changeFolder=({id, data})=>{

        this.folderId = id;
        this.refreshList(false, data);
        setCanCreateFolder(false);
    }
    static refreshList = (updateConstData, data) => {
        setData(data);
        refresh();
        if(updateConstData)
            this.updateConstData(data);
        setNotesCount(data.length);
        //setRefresh(!refresh);
    }
    static back = () => {
        this.folderId = -1;
        setCanCreateFolder(true);
        this.refreshList(false, [...this.constData]);
    }
    static resetScroll = () => {
        resetScroll();
    }
    static scrollToEnd = (animate) => {
        scrollToEnd(animate);
    }
    static getCurrentDataList = () =>{
        return dataList;
    }
    
}

