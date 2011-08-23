YUI.add("editor-para",function(a){var d=function(){d.superclass.constructor.apply(this,arguments);},k="host",f="body",c="nodeChange",j="parentNode",b=f+" > p",h="p",g="<br>",i="firstChild",e="li";a.extend(d,a.Base,{_fixFirstPara:function(){var p=this.get(k),r=p.getInstance(),q,s,l=r.config.doc.body,o=l.innerHTML,m=((o.length)?true:false);if(o===g){o="";m=false;}l.innerHTML="<"+h+">"+o+r.Selection.CURSOR+"</"+h+">";s=r.one(b);q=new r.Selection();q.selectNode(s,true,m);},_onNodeChange:function(Q){var F=this.get(k),q=F.getInstance(),x,D,C,S,N,H=q.Selection.DEFAULT_BLOCK_TAG,z,o,s,O,v,l,G,L,u,M,U,R,J,B,A,P=":last-child";switch(Q.changedType){case"enter-up":var m=((this._lastPara)?this._lastPara:Q.changedNode),T=m.one("br.yui-cursor");if(this._lastPara){delete this._lastPara;}if(T){if(T.previous()||T.next()){if(T.ancestor(h)){T.remove();}}}if(!m.test(H)){var E=m.ancestor(H);if(E){m=E;E=null;}}if(m.test(H)){var I=m.previous(),K,w,y=false;if(I){K=I.one(P);while(!y){if(K){w=K.one(P);if(w){K=w;}else{y=true;}}else{y=true;}}if(K){F.copyStyles(K,m);}}}break;case"enter":if(a.UA.ie){if(Q.changedNode.test("br")){Q.changedNode.remove();}else{if(Q.changedNode.test("p, span")){var T=Q.changedNode.one("br.yui-cursor");if(T){T.remove();}}}}if(a.UA.webkit){if(Q.changedEvent.shiftKey){F.execCommand("insertbr");Q.changedEvent.preventDefault();}}if(a.UA.gecko&&F.get("defaultblock")!=="p"){C=Q.changedNode;if(!C.test(e)&&!C.ancestor(e)){if(!C.test(H)){C=C.ancestor(H);}S=q.Node.create("<"+H+"></"+H+">");C.insert(S,"after");N=new q.Selection();if(N.anchorOffset){z=N.anchorNode.get("textContent");D=q.one(q.config.doc.createTextNode(z.substr(0,N.anchorOffset)));o=q.one(q.config.doc.createTextNode(z.substr(N.anchorOffset)));O=N.anchorNode;O.setContent("");l=O.cloneNode();l.append(o);G=false;u=O;while(!G){u=u.get(j);if(u&&!u.test(H)){L=u.cloneNode();L.set("innerHTML","");L.append(l);s=u.get("childNodes");var r=false;s.each(function(n){if(r){L.append(n);}if(n===O){r=true;}});O=u;l=L;}else{G=true;}}o=l;N.anchorNode.append(D);if(o){S.append(o);}}if(S.get(i)){S=S.get(i);}S.prepend(q.Selection.CURSOR);N.focusCursor(true,true);x=q.Selection.getText(S);if(x!==""){q.Selection.cleanCursor();}Q.changedEvent.preventDefault();}}break;case"keyup":if(a.UA.gecko){if(q.config.doc&&q.config.doc.body&&q.config.doc.body.innerHTML.length<20){if(!q.one(b)){this._fixFirstPara();}}}break;case"backspace-up":case"backspace-down":case"delete-up":if(!a.UA.ie){M=q.all(b);R=q.one(f);if(M.item(0)){R=M.item(0);}U=R.one("br");if(U){U.removeAttribute("id");U.removeAttribute("class");}D=q.Selection.getText(R);D=D.replace(/ /g,"").replace(/\n/g,"");B=R.all("img");if(D.length===0&&!B.size()){if(!R.test(h)){this._fixFirstPara();}J=null;if(Q.changedNode&&Q.changedNode.test(h)){J=Q.changedNode;}if(!J&&F._lastPara&&F._lastPara.inDoc()){J=F._lastPara;}if(J&&!J.test(h)){J=J.ancestor(h);}if(J){if(!J.previous()&&J.get(j)&&J.get(j).test(f)){Q.changedEvent.frameEvent.halt();}}}if(a.UA.webkit){if(Q.changedNode){R=Q.changedNode;if(R.test("li")&&(!R.previous()&&!R.next())){x=R.get("innerHTML").replace(g,"");if(x===""){if(R.get(j)){R.get(j).replace(q.Node.create(g));Q.changedEvent.frameEvent.halt();Q.preventDefault();q.Selection.filterBlocks();}}}}}}if(a.UA.gecko){S=Q.changedNode;A=q.config.doc.createTextNode(" ");S.appendChild(A);S.removeChild(A);}break;}if(a.UA.gecko){if(Q.changedNode&&!Q.changedNode.test(H)){J=Q.changedNode.ancestor(H);if(J){this._lastPara=J;}}}},_afterEditorReady:function(){var m=this.get(k),n=m.getInstance(),l;if(n){n.Selection.filterBlocks();l=n.Selection.DEFAULT_BLOCK_TAG;b=f+" > "+l;h=l;}},_afterContentChange:function(){var l=this.get(k),m=l.getInstance();if(m&&m.Selection){m.Selection.filterBlocks();}},_afterPaste:function(){var l=this.get(k),n=l.getInstance(),m=new n.Selection();a.later(50,l,function(){n.Selection.filterBlocks();});},initializer:function(){var l=this.get(k);if(l.editorBR){a.error("Can not plug EditorPara and EditorBR at the same time.");return;}l.on(c,a.bind(this._onNodeChange,this));l.after("ready",a.bind(this._afterEditorReady,this));l.after("contentChange",a.bind(this._afterContentChange,this));if(a.Env.webkit){l.after("dom:paste",a.bind(this._afterPaste,this));}}},{NAME:"editorPara",NS:"editorPara",ATTRS:{host:{value:false}}});a.namespace("Plugin");a.Plugin.EditorPara=d;},"@VERSION@",{skinnable:false,requires:["editor-base"]});