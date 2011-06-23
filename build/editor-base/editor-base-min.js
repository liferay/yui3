YUI.add("editor-base",function(d){var c=function(){c.superclass.constructor.apply(this,arguments);},b=":last-child",a="body";d.extend(c,d.Base,{frame:null,initializer:function(){var e=new d.Frame({designMode:true,title:c.STRINGS.title,use:c.USE,dir:this.get("dir"),extracss:this.get("extracss"),linkedcss:this.get("linkedcss"),defaultblock:this.get("defaultblock"),host:this}).plug(d.Plugin.ExecCommand);e.after("ready",d.bind(this._afterFrameReady,this));e.addTarget(this);this.frame=e;this.publish("nodeChange",{emitFacade:true,bubbles:true,defaultFn:this._defNodeChangeFn});},destructor:function(){this.frame.destroy();this.detachAll();},copyStyles:function(h,g){if(h.test("a")){return;}var e=["color","fontSize","fontFamily","backgroundColor","fontStyle"],f={};d.each(e,function(i){f[i]=h.getStyle(i);});if(h.ancestor("b,strong")){f.fontWeight="bold";}if(h.ancestor("u")){if(!f.textDecoration){f.textDecoration="underline";}}g.setStyles(f);},_lastBookmark:null,_resolveChangedNode:function(i){var h=this.getInstance(),f,e,g;if(h&&i&&i.test("html")){f=h.one(a).one(b);while(!g){if(f){e=f.one(b);if(e){f=e;}else{g=true;}}else{g=true;}}if(f){if(f.test("br")){if(f.previous()){f=f.previous();}else{f=f.get("parentNode");}}if(f){i=f;}}}return i;},_defNodeChangeFn:function(s){var j=(new Date()).getTime();var q=this.getInstance(),i,t,p=q.Selection.DEFAULT_BLOCK_TAG;if(d.UA.ie){try{i=q.config.doc.selection.createRange();if(i.getBookmark){this._lastBookmark=i.getBookmark();}}catch(g){}}s.changedNode=this._resolveChangedNode(s.changedNode);switch(s.changedType){case"keydown":if(!d.UA.gecko){if(!c.NC_KEYS[s.changedEvent.keyCode]&&!s.changedEvent.shiftKey&&!s.changedEvent.ctrlKey&&(s.changedEvent.keyCode!==13)){}}break;case"tab":if(!s.changedNode.test("li, li *")&&!s.changedEvent.shiftKey){s.changedEvent.frameEvent.preventDefault();if(d.UA.webkit){this.execCommand("inserttext","\t");}else{if(d.UA.gecko){this.frame.exec._command("inserthtml",c.TABKEY);}else{if(d.UA.ie){i=new q.Selection();if(i._selection.pasteHTML){i._selection.pasteHTML(c.TABKEY);}else{console.log("IE9 is here.. SHould be default behaviour now");this.execCommand("inserthtml",c.TABKEY);}}}}}break;}if(d.UA.webkit&&s.commands&&(s.commands.indent||s.commands.outdent)){var u=q.all(".webkit-indent-blockquote");if(u.size()){u.setStyle("margin","");}}var o=this.getDomPath(s.changedNode,false),f={},n,h,l=[],m="",k="";if(s.commands){f=s.commands;}d.each(o,function(z){var v=z.tagName.toLowerCase(),A=c.TAG2CMD[v];if(A){f[A]=1;}var y=z.currentStyle||z.style;if((""+y.fontWeight)=="bold"){f.bold=1;}if(d.UA.ie){if(y.fontWeight>400){f.bold=1;}}if(y.fontStyle=="italic"){f.italic=1;}if(y.textDecoration=="underline"){f.underline=1;}if(y.textDecoration=="line-through"){f.strikethrough=1;}var B=q.one(z);if(B.getStyle("fontFamily")){var x=B.getStyle("fontFamily").split(",")[0].toLowerCase();if(x){n=x;}if(n){n=n.replace(/'/g,"").replace(/"/g,"");}}h=c.NORMALIZE_FONTSIZE(B);var w=z.className.split(" ");d.each(w,function(C){if(C!==""&&(C.substr(0,4)!=="yui_")){l.push(C);}});m=c.FILTER_RGB(B.getStyle("color"));var e=c.FILTER_RGB(y.backgroundColor);if(e!=="transparent"){if(e!==""){k=e;}}});s.dompath=q.all(o);s.classNames=l;s.commands=f;if(!s.fontFamily){s.fontFamily=n;}if(!s.fontSize){s.fontSize=h;}if(!s.fontColor){s.fontColor=m;}if(!s.backgroundColor){s.backgroundColor=k;}var r=(new Date()).getTime();},getDomPath:function(g,e){var i=[],f,h=this.frame.getInstance();f=h.Node.getDOMNode(g);while(f!==null){if((f===h.config.doc.documentElement)||(f===h.config.doc)||!f.tagName){f=null;break;}if(!h.DOM.inDoc(f)){f=null;break;}if(f.nodeName&&f.nodeType&&(f.nodeType==1)){i.push(f);}if(f==h.config.doc.body){f=null;break;}f=f.parentNode;}if(i.length===0){i[0]=h.config.doc.body;}if(e){return h.all(i.reverse());}else{return i.reverse();}},_afterFrameReady:function(){var e=this.frame.getInstance();this.frame.on("dom:mouseup",d.bind(this._onFrameMouseUp,this));this.frame.on("dom:mousedown",d.bind(this._onFrameMouseDown,this));this.frame.on("dom:keydown",d.bind(this._onFrameKeyDown,this));if(d.UA.ie){this.frame.on("dom:activate",d.bind(this._onFrameActivate,this));this.frame.on("dom:beforedeactivate",d.bind(this._beforeFrameDeactivate,this));}this.frame.on("dom:keyup",d.bind(this._onFrameKeyUp,this));this.frame.on("dom:keypress",d.bind(this._onFrameKeyPress,this));this.frame.on("dom:paste",d.bind(this._onPaste,this));e.Selection.filter();this.fire("ready");},_beforeFrameDeactivate:function(h){if(h.frameTarget.test("html")){return;}var g=this.getInstance(),f=g.config.doc.selection.createRange();if(f.compareEndPoints&&!f.compareEndPoints("StartToEnd",f)){f.pasteHTML('<var id="yui-ie-cursor">');}},_onFrameActivate:function(i){if(i.frameTarget.test("html")){return;}var h=this.getInstance(),g=new h.Selection(),f=g.createRange(),j=h.all("#yui-ie-cursor");if(j.size()){j.each(function(m){m.set("id","");if(f.moveToElementText){try{f.moveToElementText(m._node);var k=f.move("character",-1);if(k===-1){f.move("character",1);}f.select();f.text="";}catch(l){}}m.remove();});}},_onPaste:function(f){this.fire("nodeChange",{changedNode:f.frameTarget,changedType:"paste",changedEvent:f.frameEvent});},_onFrameMouseUp:function(f){this.fire("nodeChange",{changedNode:f.frameTarget,changedType:"mouseup",changedEvent:f.frameEvent});},_onFrameMouseDown:function(f){this.fire("nodeChange",{changedNode:f.frameTarget,changedType:"mousedown",changedEvent:f.frameEvent});},_currentSelection:null,_currentSelectionTimer:null,_currentSelectionClear:null,_onFrameKeyDown:function(h){var g,f;if(!this._currentSelection){if(this._currentSelectionTimer){this._currentSelectionTimer.cancel();}this._currentSelectionTimer=d.later(850,this,function(){this._currentSelectionClear=true;});g=this.frame.getInstance();f=new g.Selection(h);this._currentSelection=f;}else{f=this._currentSelection;}g=this.frame.getInstance();f=new g.Selection();this._currentSelection=f;if(f&&f.anchorNode){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:"keydown",changedEvent:h.frameEvent});
if(c.NC_KEYS[h.keyCode]){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:c.NC_KEYS[h.keyCode],changedEvent:h.frameEvent});this.fire("nodeChange",{changedNode:f.anchorNode,changedType:c.NC_KEYS[h.keyCode]+"-down",changedEvent:h.frameEvent});}}},_onFrameKeyPress:function(g){var f=this._currentSelection;if(f&&f.anchorNode){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:"keypress",changedEvent:g.frameEvent});if(c.NC_KEYS[g.keyCode]){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:c.NC_KEYS[g.keyCode]+"-press",changedEvent:g.frameEvent});}}},_onFrameKeyUp:function(h){var g=this.frame.getInstance(),f=new g.Selection(h);if(f&&f.anchorNode){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:"keyup",selection:f,changedEvent:h.frameEvent});if(c.NC_KEYS[h.keyCode]){this.fire("nodeChange",{changedNode:f.anchorNode,changedType:c.NC_KEYS[h.keyCode]+"-up",selection:f,changedEvent:h.frameEvent});}}if(this._currentSelectionClear){this._currentSelectionClear=this._currentSelection=null;}},execCommand:function(j,l){var g=this.frame.execCommand(j,l),i=this.frame.getInstance(),h=new i.Selection(),f={},k={changedNode:h.anchorNode,changedType:"execcommand",nodes:g};switch(j){case"forecolor":k.fontColor=l;break;case"backcolor":k.backgroundColor=l;break;case"fontsize":k.fontSize=l;break;case"fontname":k.fontFamily=l;break;}f[j]=1;k.commands=f;this.fire("nodeChange",k);return g;},getInstance:function(){return this.frame.getInstance();},render:function(e){this.frame.set("content",this.get("content"));this.frame.render(e);return this;},focus:function(e){this.frame.focus(e);return this;},show:function(){this.frame.show();return this;},hide:function(){this.frame.hide();return this;},getContent:function(){var e="",f=this.getInstance();if(f&&f.Selection){e=f.Selection.unfilter();}e=e.replace(/ _yuid="([^>]*)"/g,"");return e;}},{NORMALIZE_FONTSIZE:function(g){var e=g.getStyle("fontSize"),f=e;switch(e){case"-webkit-xxx-large":e="48px";break;case"xx-large":e="32px";break;case"x-large":e="24px";break;case"large":e="18px";break;case"medium":e="16px";break;case"small":e="13px";break;case"x-small":e="10px";break;}if(f!==e){g.setStyle("fontSize",e);}return e;},TABKEY:'<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;</span>',FILTER_RGB:function(h){if(h.toLowerCase().indexOf("rgb")!=-1){var k=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi");var f=h.replace(k,"$1,$2,$3,$4,$5").split(",");if(f.length==5){var j=parseInt(f[1],10).toString(16);var i=parseInt(f[2],10).toString(16);var e=parseInt(f[3],10).toString(16);j=j.length==1?"0"+j:j;i=i.length==1?"0"+i:i;e=e.length==1?"0"+e:e;h="#"+j+i+e;}}return h;},TAG2CMD:{"b":"bold","strong":"bold","i":"italic","em":"italic","u":"underline","sup":"superscript","sub":"subscript","img":"insertimage","a":"createlink","ul":"insertunorderedlist","ol":"insertorderedlist"},NC_KEYS:{8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",46:"delete"},USE:["substitute","node","selector-css3","selection","stylesheet"],NAME:"editorBase",STRINGS:{title:"Rich Text Editor"},ATTRS:{content:{value:'<br class="yui-cursor">',setter:function(e){if(e.substr(0,1)==="\n"){e=e.substr(1);}if(e===""){e='<br class="yui-cursor">';}if(e===" "){if(d.UA.gecko){e='<br class="yui-cursor">';}}return this.frame.set("content",e);},getter:function(){return this.frame.get("content");}},dir:{writeOnce:true,value:"ltr"},linkedcss:{value:"",setter:function(e){if(this.frame){this.frame.set("linkedcss",e);}return e;}},extracss:{value:false,setter:function(e){if(this.frame){this.frame.set("extracss",e);}return e;}},defaultblock:{value:"p"}}});d.EditorBase=c;},"@VERSION@",{requires:["base","frame","node","exec-command","selection"],skinnable:false});