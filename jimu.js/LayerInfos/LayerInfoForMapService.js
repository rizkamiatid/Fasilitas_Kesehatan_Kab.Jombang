// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define("dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/Deferred dojo/json dojo/aspect dojo/topic ./LayerInfo esri/request esri/lang".split(" "),function(q,f,g,l,r,m,n,t,p,h){return q(t,{_legendInfo:null,_sublayerIdent:null,controlPopupInfo:null,_jsapiLayerInfos:null,_oldFilter:null,_subLayerVisible:null,constructor:function(){},init:function(){this._initJsapiLayerInfos();this._initSubLayerVisible();this._initSubLayerIdent();this._initControlPopup();this.inherited(arguments);this._needToRefresh().then(g.hitch(this,
function(a){a&&(this.update(),this._getLayerInfosObj()._onLayersUpdated(this,this))}))},_needToRefresh:function(){var a=new l;this.layerObject.dynamicLayerInfos&&this.isRootLayer()&&this.isItemLayer()&&!this.originOperLayer.thematicGroup?this.getItemInfo().then(g.hitch(this,function(b){(b=(b=b.getItemData())&&b.thematicGroup)?(this.originOperLayer.thematicGroup=b,a.resolve(!0)):a.resolve(!1)})):a.resolve(!1);return a},_initOldFilter:function(){this._oldFilter=this.layerObject&&this.layerObject.layerDefinitions?
this.layerObject.layerDefinitions:[]},_initJsapiLayerInfos:function(){var a=f.filter(this.originOperLayer.layers,function(a){return h.isDefined(a.id)&&h.isDefined(a.name)&&h.isDefined(a.minScale)&&h.isDefined(a.maxScale)&&h.isDefined(a.parentLayerId)&&h.isDefined(a.defaultVisibility)});this._jsapiLayerInfos=this.layerObject.dynamicLayerInfos?this.originOperLayer.thematicGroup&&this.originOperLayer.thematicGroup.layerIds&&0<=this.originOperLayer.thematicGroup.layerIds.length?f.filter(this.layerObject.dynamicLayerInfos,
function(a){return-1<this.originOperLayer.thematicGroup.layerIds.indexOf(a.id)?!0:!1},this):this.layerObject.dynamicLayerInfos:0<a.length?a:this.layerObject.layerInfos},_initControlPopup:function(){this.controlPopupInfo={enablePopup:void 0,infoTemplates:g.clone(this.layerObject.infoTemplates)};this.layerObject._infoTemplates=g.clone(this.layerObject.infoTemplates);m.after(this.layerObject,"setInfoTemplates",g.hitch(this,function(){this.layerObject._infoTemplates=g.clone(this.layerObject.infoTemplates);
this.controlPopupInfo.infoTemplates=g.clone(this.layerObject.infoTemplates);this.traversal(function(a){a._afterSetInfoTemplates&&a._afterSetInfoTemplates()})}))},_initSubLayerIdent:function(){this._sublayerIdent={definitions:{},empty:!0,defLoad:new l}},_initSubLayerVisible:function(a){this._subLayerVisible={};for(var b=0;b<this._jsapiLayerInfos.length;b++)this._subLayerVisible[this._jsapiLayerInfos[b].id]=!1;a?f.forEach(a,function(a){this._subLayerVisible[a]=!0},this):this.originOperLayer.visibleLayers?
f.forEach(this.originOperLayer.visibleLayers,function(a){this._subLayerVisible[a]=!0},this):f.forEach(this._jsapiLayerInfos,function(a){a.defaultVisibility&&(this._subLayerVisible[a.id]=!0)},this)},_initVisible:function(){this._visible=this.originOperLayer.layerObject.visible},_setTopLayerVisible:function(a){this.originOperLayer.layerObject.setVisibility(a);this._visible=a},_setSubLayerVisible:function(a){var b=[-1,-1,-1],c,d=[],e=f.filter(this.originOperLayer.layerObject.visibleLayers,function(a){return-1!==
a});f.forEach(e,function(a){if(!this._isGroupLayerBySubId(a)){var b=this._subLayerInfoIndex[a];b&&b._isAllSubLayerVisibleOnPath()&&d.push(a)}},this);var e=d,k;for(k in a)if(a.hasOwnProperty(k)&&"function"!==typeof a[k]){var g=Number(k);a[k]?(c=f.indexOf(e,g),0>c&&e.push(g)):(c=f.indexOf(e,g),0<=c&&e.splice(c,1))}b=b.concat(e);this.originOperLayer.layerObject.setVisibleLayers(b)},_resetLayerObjectVisiblity:function(a){var b=a?a[this.id]:null,c=!1;if(a&&(b&&this.layerObject.setVisibility(b.visible),
"esri.layers.ArcGISDynamicMapServiceLayer"===this.layerObject.declaredClass)){var b={},d;for(d in a)a.hasOwnProperty(d)&&"function"!==typeof a[d]&&(c=!0,b[d]=a[d].visible);c&&this._setSubLayerVisibleByCheckedInfo(b)}},_setSubLayerVisibleByCheckedInfo:function(a){var b=[];f.forEach(this._jsapiLayerInfos,function(c){var d=this.id+"_"+c.id;h.isDefined(a[d])?a[d]&&b.push(c.id):this._subLayerVisible[c.id]&&b.push(c.id)},this);this._initSubLayerVisible(b);this.traversal(function(a){a._initVisible()});var c=
{};this.traversal(function(a){0===a.getSubLayers().length&&(c[a.originOperLayer.mapService.subId]=a._isAllSubLayerVisibleOnPath())});this._setSubLayerVisible(c)},_subLayerVisibleChanged:function(){var a=[];this.traversal(function(b){a.push(b)});n.publish("layerInfos/layerInfo/visibleChanged",a)},obtainNewSubLayers:function(){var a=[],b=this.originOperLayer.layerObject,c=null,c="esri.layers.ArcGISDynamicMapServiceLayer"===b.declaredClass?"dynamic":"tiled";f.forEach(this._jsapiLayerInfos,function(d){var e=
null,e=b.url+"/"+d.id,f=b.id+"_"+d.id;d.subLayerIds&&0<d.subLayerIds.length?(e={url:e,empty:!0},this._addNewSubLayer(a,e,f,d,c+"_group")):(e={url:e,empty:!0},this._addNewSubLayer(a,e,f,d,c))},this);var d=[];f.forEach(this._jsapiLayerInfos,function(b,c){b=b.parentLayerId;if(-1!==b){for(var d=null,e=0;e<a.length;e++)if(a[e].mapService.subId===b){d=a[e];break}(b=d)&&b.subLayers.push(a[c])}},this);f.forEach(this._jsapiLayerInfos,function(b,c){-1===b.parentLayerId&&(b=this._layerInfoFactory.create(a[c]),
d.push(b),b.init())},this);return d},_addNewSubLayer:function(a,b,c,d,e){var f=d.source&&d.source.mapLayerId;if(void 0===f||null===f)f=d.id;a.push({layerObject:b,title:d.name||d.id||" ",id:c||"-",subId:d.id,subLayers:[],mapService:{layerInfo:this,subId:d.id,mapServiceSubId:f},selfType:"mapservice_"+e,parentLayerInfo:this})},_handleErrorSubLayer:function(a,b,c,d,e,f){a[b]={layerObject:null,title:f.name||f.id||" ",id:c||" ",subLayers:[],mapService:{layerInfo:this,subId:d}}},getLegendInfo:function(a){var b=
new l;this._legendInfo?b.resolve(this._legendInfo):this._legendRequest(a).then(g.hitch(this,function(a){this._legendInfo=a.layers;b.resolve(this._legendInfo)}),function(){b.reject()});return b},_legendRequest:function(a){return 10.01<=this.layerObject.version?this._legendRequestServer():this._legendRequestTools(a)},_legendRequestServer:function(){var a=this.layerObject.url+"/legend",b={f:"json"};this.layerObject._params.dynamicLayers&&(b.dynamicLayers=r.stringify(this._createDynamicLayers(this.layerObject)),
"[{}]"===b.dynamicLayers&&(b.dynamicLayers="[]"));return p({url:a,content:b,handleAs:"json",callbackParamName:"callback"})},_legendRequestTools:function(a){return p({url:a+"sharing/tools/legend?soapUrl\x3d"+this.layerObject.url,content:{f:"json"},handleAs:"json",callbackParamName:"callback"})},_createDynamicLayers:function(a){var b=[],c;f.forEach(a.dynamicLayerInfos||a.layerInfos,function(d){c={id:d.id};c.source=d.source&&d.source.toJson();var e;a.layerDefinitions&&a.layerDefinitions[d.id]&&(e=a.layerDefinitions[d.id]);
e&&(c.definitionExpression=e);var f;a.layerDrawingOptions&&a.layerDrawingOptions[d.id]&&(f=a.layerDrawingOptions[d.id]);f&&(c.drawingInfo=f.toJson());c.minScale=d.minScale||0;c.maxScale=d.maxScale||0;b.push(c)});return b},_getServiceDefinition:function(){var a=this.getUrl();return this._serviceDefinitionBuffer.getRequest(this.subId).request(a)},_getSubserviceDefinition:function(a){return 10.11<=this.layerObject.version?this._getAllLayerAndTable(a):this._getLayerAndTable(a)},_getAllLayerAndTable:function(a){var b=
this.layerObject.url+"/layers",c=this._serviceDefinitionBuffer.getRequest("_all_layer_and_table_request");c.isResolved()||c.request(b).then(g.hitch(this,function(a){a||(a={layers:[]});this.traversal(g.hitch(this,function(b){if(!b.isRootLayer()){var c=b.originOperLayer.mapService.mapServiceSubId;b=this._serviceDefinitionBuffer.getRequest(c);var d=null;f.some(a.layers,function(a){if(a.id===c)return d=a,!0},this);b.setResponse(d)}}))}));return this._serviceDefinitionBuffer.getRequest(a).fakeRequest()},
_getLayerAndTable:function(a){var b=this.layerObject.url+"/"+a;return this._serviceDefinitionBuffer.getRequest(a).request(b)},_getSublayerSettingOfWebmap:function(a){var b=f.filter(this.originOperLayer.layers,function(b){return b.id===a});return 1===b.length?b[0]:null},_getSublayerShowLegendOfWebmap:function(a){return(a=this._getSublayerSettingOfWebmap(a))?void 0!==a.showLegend?a.showLegend:!0:!0},_idIsInJsapiLayerInfos:function(a){return null===this._getJsapiLayerInfoById(a)?!1:!0},_getJsapiLayerInfoById:function(a){for(var b=
null,c=0;c<this._jsapiLayerInfos.length;c++)if(this._jsapiLayerInfos[c].id===a){b=this._jsapiLayerInfos[c];break}return b},_isGroupLayerBySubId:function(a){return(a=this._getJsapiLayerInfoById(a))&&a.subLayerIds&&0<a.subLayerIds.length?!0:!1},_bindEvent:function(){var a;this.inherited(arguments);this.layerObject&&!this.layerObject.empty&&(a=this.layerObject.on("visible-layers-change",g.hitch(this,this._onVisibleLayersChanged)),this._eventHandles.push(a),a=m.after(this.layerObject,"setLayerDefinitions",
g.hitch(this,this._onFilterChanged)),this._eventHandles.push(a))},_onVisibleLayersChanged:function(a){var b=a.visibleLayers;if(-1===b[0]&&-1===b[1]&&-1===b[2])this._subLayerVisibleChanged(),this._isShowInMapChanged2();else{a=[];var c=[-1,-1,-1],b=this._converVisibleLayers(b);a=b.visibleLayersForUpdateSubLayerVisible;c=c.concat(b.visibleLayersForSetVisibleLayers);this._initSubLayerVisible(a);this.traversal(function(a){a._initVisible()});this.layerObject.setVisibleLayers(c)}},_converVisibleLayers:function(a){var b=
{visibleLayersForUpdateSubLayerVisible:[],visibleLayersForSetVisibleLayers:[]};f.forEach(a,function(b){var c=this.findLayerInfoById(this.id+"_"+b);if(this._isGroupLayerBySubId(b))c.traversal(function(b){a.push(b.originOperLayer.mapService.subId)});else for(;c&&c.originOperLayer.mapService;)a.push(c.originOperLayer.mapService.subId),c=c.parentLayerInfo},this);f.forEach(a,function(a){0<=a&&0>b.visibleLayersForUpdateSubLayerVisible.indexOf(a)&&b.visibleLayersForUpdateSubLayerVisible.push(a)},this);f.forEach(b.visibleLayersForUpdateSubLayerVisible,
function(a){this._isGroupLayerBySubId(a)||b.visibleLayersForSetVisibleLayers.push(a)},this);return b},_onFilterChanged:function(){for(var a,b=[],c=this.layerObject.layerDefinitions,d=c.length>this._oldFilter.length?c.length:this._oldFilter.length,e=0;e<d;e++)(c[e]?c[e]:null)!==(this._oldFilter[e]?this._oldFilter[e]:null)&&(a=this.findLayerInfoById(this.id+"_"+e))&&a.isLeaf()&&b.push(a);0<b.length&&(n.publish("layerInfos/layerInfo/filterChanged",b),this._oldFilter=c)}})});