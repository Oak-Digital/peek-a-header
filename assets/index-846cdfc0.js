var u=Object.defineProperty;var f=(e,t,n)=>t in e?u(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var o=(e,t,n)=>(f(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();const style="";var commonjsGlobal=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},lib={},types={};Object.defineProperty(types,"__esModule",{value:!0});function asTypedEventEmitter(e){return e}types.asTypedEventEmitter=asTypedEventEmitter;var ee={},taskCollection$1={},taskCollection={},bakeCollection={};(function(exports){Object.defineProperty(exports,"__esModule",{value:!0}),exports.BAKED_EMPTY_FUNC=function(){};var FORLOOP_FALLBACK=1500;function generateArgsDefCode(e){var t="";if(e===0)return t;for(var n=0;n<e-1;++n)t+="arg"+String(n)+", ";return t+="arg"+String(e-1),t}function generateBodyPartsCode(e,t){for(var n="",s="",i=0;i<t;++i)n+="var f"+i+" = collection["+i+`];
`,s+="f"+i+"("+e+`)
`;return{funcDefCode:n,funcCallCode:s}}function generateBodyPartsVariadicCode(e){for(var t="",n="",s=0;s<e;++s)t+="var f"+s+" = collection["+s+`];
`,n+="f"+s+`.apply(undefined, arguments)
`;return{funcDefCode:t,funcCallCode:n}}function bakeCollection(collection,fixedArgsNum){if(collection.length===0)return exports.BAKED_EMPTY_FUNC;if(collection.length===1)return collection[0];var funcFactoryCode;if(collection.length<FORLOOP_FALLBACK){var argsDefCode=generateArgsDefCode(fixedArgsNum),_a=generateBodyPartsCode(argsDefCode,collection.length),funcDefCode=_a.funcDefCode,funcCallCode=_a.funcCallCode;funcFactoryCode=`(function(collection) {
            `+funcDefCode+`
            collection = undefined;
            return (function(`+argsDefCode+`) {
                `+funcCallCode+`
            });
        })`}else{var argsDefCode=generateArgsDefCode(fixedArgsNum);collection.length%10===0?funcFactoryCode=`(function(collection) {
                return (function(`+argsDefCode+`) {
                    for (var i = 0; i < collection.length; i += 10) {
                        collection[i](`+argsDefCode+`);
                        collection[i+1](`+argsDefCode+`);
                        collection[i+2](`+argsDefCode+`);
                        collection[i+3](`+argsDefCode+`);
                        collection[i+4](`+argsDefCode+`);
                        collection[i+5](`+argsDefCode+`);
                        collection[i+6](`+argsDefCode+`);
                        collection[i+7](`+argsDefCode+`);
                        collection[i+8](`+argsDefCode+`);
                        collection[i+9](`+argsDefCode+`);
                    }
                });
            })`:collection.length%4===0?funcFactoryCode=`(function(collection) {
                return (function(`+argsDefCode+`) {
                    for (var i = 0; i < collection.length; i += 4) {
                        collection[i](`+argsDefCode+`);
                        collection[i+1](`+argsDefCode+`);
                        collection[i+2](`+argsDefCode+`);
                        collection[i+3](`+argsDefCode+`);
                    }
                });
            })`:collection.length%3===0?funcFactoryCode=`(function(collection) {
                return (function(`+argsDefCode+`) {
                    for (var i = 0; i < collection.length; i += 3) {
                        collection[i](`+argsDefCode+`);
                        collection[i+1](`+argsDefCode+`);
                        collection[i+2](`+argsDefCode+`);
                    }
                });
            })`:funcFactoryCode=`(function(collection) {
                return (function(`+argsDefCode+`) {
                    for (var i = 0; i < collection.length; ++i) {
                        collection[i](`+argsDefCode+`);
                    }
                });
            })`}{var funcFactory=eval(funcFactoryCode);return funcFactory(collection)}}exports.bakeCollection=bakeCollection;function bakeCollectionAwait(collection,fixedArgsNum){if(collection.length===0)return exports.BAKED_EMPTY_FUNC;if(collection.length===1)return collection[0];var funcFactoryCode;if(collection.length<FORLOOP_FALLBACK){var argsDefCode=generateArgsDefCode(fixedArgsNum),_a=generateBodyPartsCode(argsDefCode,collection.length),funcDefCode=_a.funcDefCode,funcCallCode=_a.funcCallCode;funcFactoryCode=`(function(collection) {
            `+funcDefCode+`
            collection = undefined;
            return (function(`+argsDefCode+`) {
                return Promise.all([ `+funcCallCode+` ]);
            });
        })`}else{var argsDefCode=generateArgsDefCode(fixedArgsNum);funcFactoryCode=`(function(collection) {
            return (function(`+argsDefCode+`) {
                var promises = Array(collection.length);
                for (var i = 0; i < collection.length; ++i) {
                    promises[i] = collection[i](`+argsDefCode+`);
                }
                return Promise.all(promises);
            });
        })`}{var funcFactory=eval(funcFactoryCode);return funcFactory(collection)}}exports.bakeCollectionAwait=bakeCollectionAwait;function bakeCollectionVariadic(collection){if(collection.length===0)return exports.BAKED_EMPTY_FUNC;if(collection.length===1)return collection[0];var funcFactoryCode;if(collection.length<FORLOOP_FALLBACK){var _a=generateBodyPartsVariadicCode(collection.length),funcDefCode=_a.funcDefCode,funcCallCode=_a.funcCallCode;funcFactoryCode=`(function(collection) {
            `+funcDefCode+`
            collection = undefined;
            return (function() {
                `+funcCallCode+`
            });
        })`}else funcFactoryCode=`(function(collection) {
            return (function() {
                for (var i = 0; i < collection.length; ++i) {
                    collection[i].apply(undefined, arguments);
                }
            });
        })`;{var funcFactory=eval(funcFactoryCode);return funcFactory(collection)}}exports.bakeCollectionVariadic=bakeCollectionVariadic})(bakeCollection);var __spreadArrays$1=commonjsGlobal&&commonjsGlobal.__spreadArrays||function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;for(var s=Array(e),i=0,t=0;t<n;t++)for(var l=arguments[t],r=0,a=l.length;r<a;r++,i++)s[i]=l[r];return s};Object.defineProperty(taskCollection,"__esModule",{value:!0});var bake_collection_1=bakeCollection;function push_norebuild(e,t){var n=this.length;if(n>1)if(t){var s;(s=this._tasks).push.apply(s,arguments),this.length+=arguments.length}else this._tasks.push(e),this.length++;else if(t){if(n===1){var i=Array(1+arguments.length);i.push(i),i.push.apply(i,arguments),this._tasks=i}else{var i=Array(arguments.length);i.push.apply(i,arguments),this._tasks=i}this.length+=arguments.length}else n===1?this._tasks=[this._tasks,e]:this._tasks=e,this.length++}function push_rebuild(e,t){var n=this.length;if(n>1)if(t){var s;(s=this._tasks).push.apply(s,arguments),this.length+=arguments.length}else this._tasks.push(e),this.length++;else if(t){if(n===1){var i=Array(1+arguments.length);i.push(i),i.push.apply(i,arguments),this._tasks=i}else{var i=Array(arguments.length);i.push.apply(i,arguments),this._tasks=i}this.length+=arguments.length}else n===1?this._tasks=[this._tasks,e]:this._tasks=e,this.length++;this.firstEmitBuildStrategy?this.call=rebuild_on_first_call:this.rebuild()}function _fast_remove_single(e,t){t!==-1&&(t===0?e.shift():t===e.length-1?e.length=e.length-1:e.splice(t,1))}taskCollection._fast_remove_single=_fast_remove_single;function removeLast_norebuild(e){this.length!==0&&(this.length===1?this._tasks===e&&(this.length=0):(_fast_remove_single(this._tasks,this._tasks.lastIndexOf(e)),this._tasks.length===1?(this._tasks=this._tasks[0],this.length=1):this.length=this._tasks.length))}function removeLast_rebuild(e){if(this.length!==0){if(this.length===1)if(this._tasks===e&&(this.length=0),this.firstEmitBuildStrategy){this.call=bake_collection_1.BAKED_EMPTY_FUNC;return}else{this.rebuild();return}else _fast_remove_single(this._tasks,this._tasks.lastIndexOf(e)),this._tasks.length===1?(this._tasks=this._tasks[0],this.length=1):this.length=this._tasks.length;this.firstEmitBuildStrategy?this.call=rebuild_on_first_call:this.rebuild()}}function insert_norebuild(e){for(var t,n=[],s=1;s<arguments.length;s++)n[s-1]=arguments[s];this.length===0?(this._tasks=n,this.length=1):this.length===1?(n.unshift(this._tasks),this._tasks=n,this.length=this._tasks.length):((t=this._tasks).splice.apply(t,__spreadArrays$1([e,0],n)),this.length=this._tasks.length)}function insert_rebuild(e){for(var t,n=[],s=1;s<arguments.length;s++)n[s-1]=arguments[s];this.length===0?(this._tasks=n,this.length=1):this.length===1?(n.unshift(this._tasks),this._tasks=n,this.length=this._tasks.length):((t=this._tasks).splice.apply(t,__spreadArrays$1([e,0],n)),this.length=this._tasks.length),this.firstEmitBuildStrategy?this.call=rebuild_on_first_call:this.rebuild()}function rebuild_noawait(){this.length===0?this.call=bake_collection_1.BAKED_EMPTY_FUNC:this.length===1?this.call=this._tasks:this.call=bake_collection_1.bakeCollection(this._tasks,this.argsNum)}function rebuild_await(){this.length===0?this.call=bake_collection_1.BAKED_EMPTY_FUNC:this.length===1?this.call=this._tasks:this.call=bake_collection_1.bakeCollectionAwait(this._tasks,this.argsNum)}function rebuild_on_first_call(){this.rebuild(),this.call.apply(void 0,arguments)}var TaskCollection=function(){function e(t,n,s,i){n===void 0&&(n=!0),s===void 0&&(s=null),i===void 0&&(i=!1),this.awaitTasks=i,this.call=bake_collection_1.BAKED_EMPTY_FUNC,this.argsNum=t,this.firstEmitBuildStrategy=!0,i?this.rebuild=rebuild_await.bind(this):this.rebuild=rebuild_noawait.bind(this),this.setAutoRebuild(n),s?typeof s=="function"?(this._tasks=s,this.length=1):(this._tasks=s,this.length=s.length):(this._tasks=null,this.length=0),n&&this.rebuild()}return e}();taskCollection.TaskCollection=TaskCollection;function fastClear(){this._tasks=null,this.length=0,this.call=bake_collection_1.BAKED_EMPTY_FUNC}function clear(){this._tasks=null,this.length=0,this.call=bake_collection_1.BAKED_EMPTY_FUNC}function growArgsNum(e){this.argsNum<e&&(this.argsNum=e,this.firstEmitBuildStrategy?this.call=rebuild_on_first_call:this.rebuild())}function setAutoRebuild(e){e?(this.push=push_rebuild.bind(this),this.insert=insert_rebuild.bind(this),this.removeLast=removeLast_rebuild.bind(this)):(this.push=push_norebuild.bind(this),this.insert=insert_norebuild.bind(this),this.removeLast=removeLast_norebuild.bind(this))}function tasksAsArray(){return this.length===0?[]:this.length===1?[this._tasks]:this._tasks}function setTasks(e){e.length===0?(this.length=0,this.call=bake_collection_1.BAKED_EMPTY_FUNC):e.length===1?(this.length=1,this.call=e[0],this._tasks=e[0]):(this.length=e.length,this._tasks=e,this.firstEmitBuildStrategy?this.call=rebuild_on_first_call:this.rebuild())}TaskCollection.prototype.fastClear=fastClear;TaskCollection.prototype.clear=clear;TaskCollection.prototype.growArgsNum=growArgsNum;TaskCollection.prototype.setAutoRebuild=setAutoRebuild;TaskCollection.prototype.tasksAsArray=tasksAsArray;TaskCollection.prototype.setTasks=setTasks;(function(e){function t(n){for(var s in n)e.hasOwnProperty(s)||(e[s]=n[s])}Object.defineProperty(e,"__esModule",{value:!0}),t(taskCollection)})(taskCollection$1);var utils={};Object.defineProperty(utils,"__esModule",{value:!0});function nullObj(){var e={};return e.__proto__=null,e.prototype=null,e}utils.nullObj=nullObj;var __spreadArrays=commonjsGlobal&&commonjsGlobal.__spreadArrays||function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;for(var s=Array(e),i=0,t=0;t<n;t++)for(var l=arguments[t],r=0,a=l.length;r<a;r++,i++)s[i]=l[r];return s};Object.defineProperty(ee,"__esModule",{value:!0});var task_collection_1=taskCollection$1,utils_1=utils;function emit(e,t,n,s,i,l){var r=this.events[e];return r?r.length===0?!1:(r.argsNum<6?r.call(t,n,s,i,l):r.call.apply(void 0,arguments),!0):!1}function emitHasOnce(e,t,n,s,i,l){var r=this.events[e];if(r){if(r.length===0)return!1;r.argsNum<6?r.call(t,n,s,i,l):r.call.apply(void 0,arguments)}var a=this.onceEvents[e];if(a){if(typeof a=="function")this.onceEvents[e]=void 0,arguments.length<6?a(t,n,s,i,l):a.apply(void 0,arguments);else{var h=a;if(this.onceEvents[e]=void 0,arguments.length<6)for(var c=0;c<h.length;++c)h[c](t,n,s,i,l);else for(var c=0;c<h.length;++c)h[c].apply(void 0,arguments)}return!0}return!!r}var EventEmitter=function(){function e(){this.events=utils_1.nullObj(),this.onceEvents=utils_1.nullObj(),this._symbolKeys=new Set,this.maxListeners=1/0}return Object.defineProperty(e.prototype,"_eventsCount",{get:function(){return this.eventNames().length},enumerable:!0,configurable:!0}),e}();ee.EventEmitter=EventEmitter;function once(e,t){switch(this.emit===emit&&(this.emit=emitHasOnce),typeof this.onceEvents[e]){case"undefined":this.onceEvents[e]=t,typeof e=="symbol"&&this._symbolKeys.add(e);break;case"function":this.onceEvents[e]=[this.onceEvents[e],t];break;case"object":this.onceEvents[e].push(t)}return this}function addListener(e,t,n){if(n===void 0&&(n=t.length),typeof t!="function")throw new TypeError("The listener must be a function");var s=this.events[e];return s?(s.push(t),s.growArgsNum(n),this.maxListeners!==1/0&&this.maxListeners<=s.length&&console.warn('Maximum event listeners for "'+String(e)+'" event!')):(this.events[e]=new task_collection_1.TaskCollection(n,!0,t,!1),typeof e=="symbol"&&this._symbolKeys.add(e)),this}function removeListener(e,t){var n=this.events[e];n&&n.removeLast(t);var s=this.onceEvents[e];return s&&(typeof s=="function"?this.onceEvents[e]=void 0:typeof s=="object"&&(s.length===1&&s[0]===t?this.onceEvents[e]=void 0:task_collection_1._fast_remove_single(s,s.lastIndexOf(t)))),this}function hasListeners(e){return this.events[e]&&!!this.events[e].length}function prependListener(e,t,n){if(n===void 0&&(n=t.length),typeof t!="function")throw new TypeError("The listener must be a function");var s=this.events[e];return!s||!(s instanceof task_collection_1.TaskCollection)?(s=this.events[e]=new task_collection_1.TaskCollection(n,!0,t,!1),typeof e=="symbol"&&this._symbolKeys.add(e)):(s.insert(0,t),s.growArgsNum(n),this.maxListeners!==1/0&&this.maxListeners<=s.length&&console.warn('Maximum event listeners for "'+String(e)+'" event!')),this}function prependOnceListener(e,t){this.emit===emit&&(this.emit=emitHasOnce);var n=this.onceEvents[e];if(!n||typeof n!="object")n=this.onceEvents[e]=[t],typeof e=="symbol"&&this._symbolKeys.add(e);else throw new Error("FIXME");return this}function removeAllListeners(e){return e===void 0?(this.events=utils_1.nullObj(),this.onceEvents=utils_1.nullObj(),this._symbolKeys=new Set):(this.events[e]=void 0,this.onceEvents[e]=void 0,typeof e=="symbol"&&this._symbolKeys.delete(e)),this}function setMaxListeners(e){return this.maxListeners=e,this}function getMaxListeners(){return this.maxListeners}function listeners(e){return this.emit===emit?this.events[e]?this.events[e].tasksAsArray().slice():[]:this.events[e]&&this.onceEvents[e]?__spreadArrays(this.events[e].tasksAsArray(),typeof this.onceEvents[e]=="function"?[this.onceEvents[e]]:this.onceEvents[e]):this.events[e]?this.events[e].tasksAsArray():this.onceEvents[e]?typeof this.onceEvents[e]=="function"?[this.onceEvents[e]]:this.onceEvents[e]:[]}function eventNames(){var e=this;if(this.emit===emit){var t=Object.keys(this.events);return __spreadArrays(t,Array.from(this._symbolKeys)).filter(function(s){return s in e.events&&e.events[s]&&e.events[s].length})}else{var t=Object.keys(this.events).filter(function(i){return e.events[i]&&e.events[i].length}),n=Object.keys(this.onceEvents).filter(function(i){return e.onceEvents[i]&&e.onceEvents[i].length});return __spreadArrays(t,n,Array.from(this._symbolKeys).filter(function(i){return i in e.events&&e.events[i]&&e.events[i].length||i in e.onceEvents&&e.onceEvents[i]&&e.onceEvents[i].length}))}}function listenerCount(e){return this.emit===emit?this.events[e]&&this.events[e].length||0:(this.events[e]&&this.events[e].length||0)+(this.onceEvents[e]&&this.onceEvents[e].length||0)}EventEmitter.prototype.emit=emit;EventEmitter.prototype.on=addListener;EventEmitter.prototype.once=once;EventEmitter.prototype.addListener=addListener;EventEmitter.prototype.removeListener=removeListener;EventEmitter.prototype.hasListeners=hasListeners;EventEmitter.prototype.prependListener=prependListener;EventEmitter.prototype.prependOnceListener=prependOnceListener;EventEmitter.prototype.off=removeListener;EventEmitter.prototype.removeAllListeners=removeAllListeners;EventEmitter.prototype.setMaxListeners=setMaxListeners;EventEmitter.prototype.getMaxListeners=getMaxListeners;EventEmitter.prototype.listeners=listeners;EventEmitter.prototype.eventNames=eventNames;EventEmitter.prototype.listenerCount=listenerCount;(function(e){function t(n){for(var s in n)e.hasOwnProperty(s)||(e[s]=n[s])}Object.defineProperty(e,"__esModule",{value:!0}),t(types),t(ee)})(lib);class PeekAHeader{constructor(t){o(this,"element");o(this,"homeY");o(this,"headerHeight");o(this,"hidden",!1);o(this,"currentTranslateY",null);o(this,"resizeObserver");o(this,"previousScrollY");o(this,"eventEmitter");o(this,"onScrollFunction");this.previousScrollY=window.scrollY,this.element=t;const n=t.getBoundingClientRect();this.homeY=this.calculateHomeY(n),this.headerHeight=n.height,this.resizeObserver=new ResizeObserver(()=>{this.updateHomeY(),this.updateHeaderHeight()}),this.resizeObserver.observe(t),this.eventEmitter=new lib.EventEmitter,this.onScrollFunction=this.onScroll.bind(this),window.addEventListener("scroll",this.onScrollFunction)}on(t,n){this.eventEmitter.on(t,n)}off(t,n){this.eventEmitter.off(t,n)}emit(t,...n){this.eventEmitter.emit(t,...n)}applyTransform(){let t;this.currentTranslateY===null?this.hidden?(t="-100%",this.emit("updateTranslate",-this.headerHeight)):(t="0px",this.emit("updateTranslate",0)):(t=`${this.currentTranslateY}px`,this.emit("updateTranslate",this.currentTranslateY)),this.element.style.transform=`translateY(${t})`}lock(t="current"){throw new Error("lock() is not implemented")}unlock(){throw new Error("unlock() is not implemented")}show(){this.hidden=!1,this.currentTranslateY=null,this.applyTransform()}hide(){this.hidden=!0,this.currentTranslateY=null,this.applyTransform()}snap(){this.currentTranslateY!==null&&(this.currentTranslateY>-this.headerHeight/2?this.hidden=!1:this.hidden=!0,this.currentTranslateY=null,this.applyTransform())}destroy(){this.resizeObserver.disconnect(),this.eventEmitter.removeAllListeners(),window.removeEventListener("scroll",this.onScrollFunction)}calculateHomeY(t){return(t??this.element.getBoundingClientRect()).top+window.scrollY}updateHomeY(){this.homeY=this.calculateHomeY()}updateHeaderHeight(){this.headerHeight=this.element.getBoundingClientRect().height}capTranslateY(t){const n=Math.max(t,-this.headerHeight);return Math.min(n,0)}getTranslateYNumber(){return this.currentTranslateY?this.currentTranslateY:this.hidden?-this.headerHeight:0}onScroll(){const t=window.scrollY,n=t-this.previousScrollY,s=t<this.homeY?n-(this.homeY-t):n;if(this.previousScrollY=t,this.updateHomeY(),s===0)return;switch(s<0?0:1){case 0:if(!this.hidden&&this.currentTranslateY===null)return;break;case 1:if(this.hidden)return;break}const l=this.getTranslateYNumber(),r=this.capTranslateY(l-s);r===0?(this.currentTranslateY=null,this.hidden=!1):r===-this.headerHeight?(this.currentTranslateY=null,this.hidden=!0):(this.currentTranslateY=r,this.hidden=!1),this.applyTransform()}}window.addEventListener("DOMContentLoaded",()=>{const e=[],t=document.getElementById("peek-a-header-sticky");if(t){const r=new PeekAHeader(t);e.push(r)}const n=document.getElementById("peek-a-header-fixed");if(n){const r=new PeekAHeader(n);e.push(r)}const s=document.getElementById("hide-button");s&&s.addEventListener("click",()=>{e.forEach(r=>r.hide())});const i=document.getElementById("show-button");i&&i.addEventListener("click",()=>{e.forEach(r=>r.show())});const l=document.getElementById("snap-button");l&&l.addEventListener("click",()=>{e.forEach(r=>r.snap())})});