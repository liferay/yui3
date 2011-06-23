YUI.add("model",function(g){var c=YUI.namespace("Env.Model"),e=g.Lang,d=g.Array,h=g.Object,a="change",b="error";function f(){f.superclass.constructor.apply(this,arguments);}g.Model=g.extend(f,g.Base,{idAttribute:"id",initializer:function(i){this.changed={};this.lastChange={};this.lists=[];},destroy:function(j,l){var i=this;if(typeof j==="function"){l=j;j={};}function k(m){if(!m){d.each(i.lists,function(n){n.remove(i,j);});f.superclass.destroy.call(i);}l&&l.apply(null,arguments);}if(j&&j["delete"]){this.sync("delete",j,k);}else{k();}return this;},generateClientId:function(){c.lastId||(c.lastId=0);return this.constructor.NAME+"_"+(c.lastId+=1);},getAsHTML:function(i){var j=this.get(i);return g.Escape.html(e.isValue(j)?String(j):"");},getAsURL:function(i){var j=this.get(i);return encodeURIComponent(e.isValue(j)?String(j):"");},isModified:function(){return this.isNew()||!h.isEmpty(this.changed);},isNew:function(){return !e.isValue(this.get("id"));},load:function(j,k){var i=this;if(typeof j==="function"){k=j;j={};}this.sync("read",j,function(m,l){if(!m){i.setAttrs(i.parse(l),j);i.changed={};}k&&k.apply(null,arguments);});return this;},parse:function(i){if(typeof i==="string"){try{return g.JSON.parse(i);}catch(j){this.fire(b,{error:j,response:i,src:"parse"});return null;}}return i;},save:function(j,k){var i=this;if(typeof j==="function"){k=j;j={};}this.sync(this.isNew()?"create":"update",j,function(m,l){if(!m){if(l){i.setAttrs(i.parse(l),j);}i.changed={};}k&&k.apply(null,arguments);});return this;},set:function(k,l,j){var i={};i[k]=l;return this.setAttrs(i,j);},setAttrs:function(i,j){var m=this.idAttribute,p,n,k,l,o;if(!this._validate(i)){return this;}j||(j={});o=j._transaction={};if(m!=="id"){i=g.merge(i);if(h.owns(i,m)){i.id=i[m];}else{if(h.owns(i,"id")){i[m]=i.id;}}}for(k in i){if(h.owns(i,k)){this._setAttr(k,i[k],j);}}if(!h.isEmpty(o)){p=this.changed;l=this.lastChange={};for(k in o){if(h.owns(o,k)){n=o[k];p[k]=n.newVal;l[k]={newVal:n.newVal,prevVal:n.prevVal,src:n.src||null};}}if(!j.silent){if(!this._changeEvent){this._changeEvent=this.publish(a,{preventable:false});}this.fire(a,{changed:l});}}return this;},sync:function(){var i=d(arguments,0,true).pop();if(typeof i==="function"){i();}},toJSON:function(){var i=this.getAttrs();delete i.clientId;delete i.destroyed;delete i.initialized;if(this.idAttribute!=="id"){delete i.id;}return i;},undo:function(n,j){var m=this.lastChange,l=this.idAttribute,i={},k;n||(n=h.keys(m));d.each(n,function(o){if(h.owns(m,o)){o=o===l?"id":o;k=true;i[o]=m[o].prevVal;}});return k?this.setAttrs(i,j):this;},validate:function(){},addAttr:function(j,i,l){var m=this.idAttribute,k,n;if(m&&j===m){k=this._isLazyAttr("id")||this._getAttrCfg("id");n=i.value===i.defaultValue?null:i.value;if(!e.isValue(n)){n=k.value===k.defaultValue?null:k.value;if(!e.isValue(n)){n=e.isValue(i.defaultValue)?i.defaultValue:k.defaultValue;}}i.value=n;if(k.value!==n){k.value=n;if(this._isLazyAttr("id")){this._state.add("id","lazy",k);}else{this._state.add("id","value",n);}}}return f.superclass.addAttr.apply(this,arguments);},_validate:function(i){var j=this.validate(i);if(e.isValue(j)){this.fire(b,{attributes:i,error:j,src:"validate"});return false;}return true;},_defAttrChangeFn:function(j){var i=j.attrName;if(!this._setAttrVal(i,j.subAttrName,j.prevVal,j.newVal)){j.stopImmediatePropagation();}else{j.newVal=this.get(i);if(j._transaction){j._transaction[i]=j;}}}},{NAME:"model",ATTRS:{clientId:{valueFn:"generateClientId",readOnly:true},id:{value:null}}});},"@VERSION@",{requires:["base-build","escape","json-parse"]});