export let noteCounter = 0;
export const getNoteByKey = (dataList, id) =>{
    return dataList.find(_=>_.id===id);
 }
export const genNewId = ()=>{
    noteCounter++;
    return noteCounter;
}
export const setNoteCounter = (data) => {
    noteCounter = getBiggestId(data);
}
const getBiggestId = (data) => {
    let biggestId = 0;
    if(data)
        data.forEach(_=>{
            if(_.id>biggestId) biggestId=_.id;
            if(_.isFolder) _.value.folderData.forEach(__=>{
                if(__.id>biggestId) biggestId=__.id;
            })
        });
    return biggestId;
}
export const addNewNote = (array, title, text)=> {
    toAdd = {
        id: genNewId(),
        value: {
            title: title,
            text: text
        },
        isHidden: false,
        isFolder: false
    }
    array.push(toAdd);
    return toAdd;
}

export const addNewFolder = (array, title)=> {
    toAdd = {
        id: genNewId(),
        value: {
            title: title,
            //if user searches for "folder"
            text: "folder",
            folderData: [
                {
                    id: genNewId(),
                    value: {
                        title: 'Back Btn',
                        text: 'back'
                    },
                    isHidden: false,
                    isFolder: false,
                    isBackBtn: true,
                    isSelected:false,
                }]
        },
        isHidden: false,
        isFolder: true
    }
    array.push(toAdd);
    return toAdd;
}
