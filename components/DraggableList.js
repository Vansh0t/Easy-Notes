import React, {Component} from 'react';
import { PanResponder, Animated, View} from "react-native";
import { getOverlap, getPixelScaleRatio} from '../Utils';
import { RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import FolderManager from '../FolderManager';

export let setDragKey;
export let resetScroll;
export let scrollToEnd;
export let refresh;
export default class DraggableList extends Component {
    //drag scroll
    scrollDragArea = 0.98;
    scrollDragSpeed = 40;
    dragScrollDir = null;
    scrollY = null;

    //children objects
    childrenData = [];

    state = {
      scrollEnabled : true,
      activeDragKey: null,
      dataProvider: null,
    }
    
    //drag
    dragEnabled = true;
    pos = new Animated.ValueXY();

    //drag item
    dragItem = null;
    dragItemMS = null;
    dragItemOffsetSet = false;
    dragItemOpacity = new Animated.Value(0)
    dragItemOpacityInter = {
      inputRange: [0, 100],
      outputRange: [0, 1],
    }
    //refs
    internalRecyclerList = null;
    internalContainer = null;
    internalContainerBottom = null;
    internalContainerTop = null;
    internalContainerMS = null;

    constructor(props) {
      super(props);
      this.state.dataProvider = new DataProvider((r1,r2)=>
      {
        return r1 !== r2;
        
      }).cloneWithRows([...this.props.data]);

      this.state.scrollEnabled = props.scrollEnabled;
      setDragKey = (id)=>{
        if(!this.dragEnabled && id != null) return;
        this.setState({
          scrollEnabled : id?false:true,
          activeDragKey: id
        });
      }
      refresh = ()=> {
        
        setTimeout(()=>{
          this.setState({
            dataProvider:this.state.dataProvider.cloneWithRows([...this.props.data])
          }
          );
          this.childrenData.length = this.props.data.length;
        }, 50);
      }
      resetScroll = () =>{
        this.internalRecyclerList.scrollToOffset(0, 0, false);
       
      }
      scrollToEnd = (animate) =>{
        this.internalRecyclerList?.scrollToEnd(animate);
       
      }
  }
    
    panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => {
            return false;
          },
          onStartShouldSetPanResponderCapture: (evt, gestureState) =>{
            return false;
          },
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            if(this.state.activeDragKey != null && this.dragEnabled && gestureState.dx !== 0 && gestureState.dy !== 0)
              return true;
            else
              return false;
          },
          onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
          {
            if(this.state.activeDragKey != null && this.dragEnabled && gestureState.dx !== 0 && gestureState.dy !== 0)
              return true;
            else
              return false;
          },
    
          onPanResponderGrant: (evt, gestureState) => {
            initX = evt.nativeEvent.pageX;
            initY = evt.nativeEvent.pageY;
            this.dragItem.measure((x, y, w, h, pX, pY)=>{
              if(!this.dragItemOffsetSet && this.state.activeDragKey) {
                offX = -pX - w/2;
                offY = -pY - h/2;
                this.pos.setOffset({
                  x: offX,
                  y: offY
                });
                this.dragItemOpacity.setValue(100);
                this.pos.setValue({x: initX, y: initY});
                this.dragItemOffsetSet = true;
                
                obj = this.childrenData.find(_=>_?.itemId==this.state.activeDragKey);
                obj.isDragged = true;
                this.internalRecyclerList.forceRerender()
              }
            })
          },
          onPanResponderMove: (evt, gestureState) => {
            this.pos.setValue({x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY});
          },
          onPanResponderTerminationRequest: (evt, gestureState) => {
            return false;
          },
          onPanResponderRelease: (evt, gestureState) => {
            
            this.dragItem.measure((x, y, w, h, pX, pY)=>{
              const rect = {x:pX,y:pY,width:w/2,height:h/2};
              let isUpdateNeeded = true;
              const overlap = this.overlapCheck(rect);
              if(overlap || overlap===0) {
                const internalItem= this.childrenData[overlap];
                internalItem.highlight.setValue(0);
                const indexTo = overlap;
                let indexFrom = -1;
                for (let i = 0; i < this.props.data.length; i++) {
                    if(this.props.data[i].id == this.state.activeDragKey) {
                      indexFrom = i;
                      break;
                    }
                }
                if(indexTo != -1 && indexFrom != -1) {
                  obj = this.props.data[indexFrom];
                  objTarget = this.props.data[indexTo];
                  if(objTarget.isFolder && !obj.isFolder) {
                    this.props.data.splice(indexFrom, 1);
                    this.childrenData.splice(indexFrom,1);
                    objTarget.value.folderData.splice(1, 0, obj);
                    isUpdateNeeded = false;
                  }
                  else if(objTarget.isBackBtn) {
                    this.props.data.splice(indexFrom, 1);
                    this.childrenData.splice(indexFrom,1);
                    FolderManager.constData.splice(1, 0, obj);
                    isUpdateNeeded = false;
                  }
                  else {
                    this.props.data.splice(indexFrom, 1);
                    this.props.data.splice(indexTo, 0, obj);
                    isUpdateNeeded = false;
                  }
                }
              }
              this.resetDrag(isUpdateNeeded)
              FolderManager.refreshList(true, [...this.props.data]);
              
            })
            
          },
          onPanResponderTerminate: (evt, gestureState) => {
            this.resetDrag(true)
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            return true;
          }
        });
    

    layoutProvider = new LayoutProvider(
      index => {
          if(this.props.data[index]?.isHidden)
            return "HIDDEN"
          else 
            return "DEFAULT"
          
      },
      (type, dim) => {
        if(type == "DEFAULT") {
          dim.width = this.props.itemSize.width + this.props.spacing;
          dim.height = this.props.itemSize.height + this.props.spacing;
        }
        else {
          dim.width = 0;
          dim.height = 0;
        }
      }
  );

        
    resetDrag=(isForceUpdateNeeded)=>{
      //reset drag
      this.dragScrollDir = null;
      this.pos.flattenOffset();
      this.pos.setValue({x:0,y:0});
      this.dragItemOpacity.setValue(0);
      this.dragItemOffsetSet = false;
      //if draggable data is still present in list, reset it's state
      objInternal = this.childrenData.find(_=>_?.itemId==this.state.activeDragKey);
      if(objInternal) {
        objInternal.isDragged = false;
        objInternal.highlight.setValue(0);
      }
      if(isForceUpdateNeeded)  {
        this.internalRecyclerList.forceRerender();
      } 
      setDragKey(null);
      
    }

    dragScrollLoop=()=>{

      if(this.dragScrollDir == "top") {
        this.internalRecyclerList.scrollToOffset(0,this.scrollY-this.scrollDragSpeed,true )
      }
      else if (this.dragScrollDir == "bottom") {
        this.internalRecyclerList.scrollToOffset( 0, this.scrollY+this.scrollDragSpeed,true )
      }
      if(this.dragScrollDir)
        setTimeout(this.dragScrollLoop, 20);
      //this.updateMeasures();
      
    }
    
    getFirstScreenItem=()=> {return this.internalRecyclerList.findApproxFirstVisibleIndex()}

    overlapCheck = (rect) =>{
      let toReturn = null
      for (let index=this.getFirstScreenItem();index<this.childrenData.length;index++) {
        
        const value = this.childrenData[index];
        if(!value || !value.itemId) continue;
        if(value.itemId == this.state.activeDragKey) continue;
        const layout = this.internalRecyclerList.getLayout(index);
        const scrollOffset = this.internalRecyclerList.getCurrentScrollOffset();
        const ms = {
          x:layout.x+this.internalContainerMS.pX,
          y:layout.y+this.internalContainerMS.pY - scrollOffset,
          width:layout.width/2,
          height:layout.height/2
        }
        if(this.state.activeDragKey != null && getOverlap(ms, rect) && this.dragItemOffsetSet) {
          toReturn = index;
          value.highlight.setValue(2);
        }
        else {
          value.highlight.setValue(0);
        }
      }
      return toReturn;
    }
    renderDragItem = ()=>{
      const itemData = this.props.data.find(_=>_.id == this.state.activeDragKey);
      if(!this.state.activeDragKey || !itemData) {
        return null;
      }
      

      const onDragLayout = event =>{
        this.dragItem.measure((x, y, w, h, pX, pY)=>{
          const rect = {x:pX,y:pY,width:w/2,height:h/2};
          this.dragItemMS = rect;
          if(this.dragItemOffsetSet) {
            if(pY <= this.internalContainerTop * (1 + 1-this.scrollDragArea)) {
              if(this.dragScrollDir != "top") {
                this.dragScrollDir = "top";
                this.dragScrollLoop();
              }
            }
            else if(pY+h/2>= this.internalContainerBottom * this.scrollDragArea) {
              if(this.dragScrollDir != "bottom") {
                this.dragScrollDir = "bottom";
                this.dragScrollLoop();
              }
            }
            else
              this.dragScrollDir = null;
          }
          this.overlapCheck(rect);
        })
        
      }
        return (
          
          <Animated.View ref={r=> {
          this.dragItem = r;
          }}
            onLayout={onDragLayout}
           style={{opacity:this.dragItemOpacity.interpolate(this.dragItemOpacityInter), position:"absolute", elevation:99, top:this.pos.y, left:this.pos.x} }
           >
             {this.props.renderItem(itemData)}
          </Animated.View>
        )
      
    }
    
   
    
    renderItem = (type, itemData, index) => {
      if(!this.childrenData[index]) {
        
        this.childrenData[index] = {
          highlight:new Animated.Value(0),
          ref: React.createRef(),
          itemId: itemData.id,
          isDragged:false,
        }
      }
      else {
        this.childrenData[index].itemData = itemData;
        this.childrenData[index].itemId = itemData.id;
      }
      let opacity = 1;
      if(this.childrenData[index].isDragged) {
        opacity = 0;
      }
      return (
          <View>
            <Animated.View
              ref={r=>{
                if(r){
                  this.childrenData[index].ref.current = r;
                }
                else {
                  this.childrenData.splice(index,1);
                }
                
              }} 
              style={[this.props.itemStyle, {borderColor:"rgba(0,0,0,0.1)", borderWidth: this.childrenData[index].highlight, opacity:opacity}]}
            >
              {this.props.renderItem(itemData)}
            </Animated.View >
          </View>
        )
      }
    
    render = () => {
      let { scrollEnabled, renderItem, dragEnabled, onScroll,  ...props } = this.props;
      this.dragEnabled = dragEnabled;
      console.log("REFRESHED", this.state.dataProvider.getSize());
      const renderList = () => {
        if(this.state.dataProvider.getSize()>0) {
          return <RecyclerListView  
            ref= {(r)=>{this.internalRecyclerList = r}}
            scrollEnabled = {this.state.scrollEnabled}
            rowRenderer = {this.renderItem}
            onScroll = {(event) => {
              if(onScroll) {
                onScroll(event)
              }
              this.scrollY = event.nativeEvent.contentOffset.y
            }}
            dataProvider= {this.state.dataProvider}
            layoutProvider={this.layoutProvider}
            
            {...props} />
        }
        else return null;
      }
      return (
          <View style={this.props.containerStyle} {...this.panResponder.panHandlers}
            ref={(r)=>{this.internalContainer = r}}
            onLayout={(event)=>{
              this.internalContainer.measure((x,y,w,h,pX,pY)=>{
                this.internalContainerBottom = pY + h;
                this.internalContainerTop = pY;
                this.internalContainerMS = {x:x,y:y,width:w,height:h,pX:pX,pY:pY}
              });
            }}
          >
            {this.renderDragItem()}
            {renderList()}

            
          </View>
      )
    }
}