

const assetsCache = {
    '3bars_vert.png': require('./3bars_vert.png'),
    '3dots.png': require('./3dots.png'),
    'folder.png': require('./folder.png'),
    'note_icon.png': require('./note_icon.png'),
    'share_icon.png': require('./share_icon.png'),
    'folder_icon.png': require('./folder_icon.png'),
    'trash_icon.png': require('./trash_icon.png'),
    'check2-circle.png':require('./check2-circle.png'),
    'arrow-return-left.png':require('./arrow-return-left.png'),
    //require.context('./', false, /\.(png|jpe?g|svg)$/)
}


export default class Indexer {
    static getAsset = (name)=> {
        console.log(assetsCache[name]);
        return assetsCache[name];
    }
}