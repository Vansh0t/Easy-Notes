import { BackHandler } from "react-native";
import FolderManager from "./FolderManager";
import { isSelectMode, deselectAll } from "./SelectMode";
import { isContextMenuShown, setContextMenuShown } from "./components/ContextMenu";




let isInitDone = false;
export const initEvents = () => {
    if(isInitDone) return;
    BackHandler.addEventListener('hardwareBackPress', () => {
        if(isContextMenuShown) {
            setContextMenuShown(false);
            return true;
        }
        if (isSelectMode) {
            deselectAll();
            return true;
        }
        if (FolderManager.folderId != -1) {
            FolderManager.back();
            return true;
        }
        return false;
    });
}
