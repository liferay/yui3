YUI.add("datasource-function",function(b){var a=b.Lang,c=function(){c.superclass.constructor.apply(this,arguments);};b.mix(c,{NAME:"dataSourceFunction",ATTRS:{source:{validator:a.isFunction}}});b.extend(c,b.DataSource.Local,{_defRequestFn:function(h){var g=this.get("source"),d;if(g){try{d=g(h.request,this,h);this.fire("data",b.mix({data:d},h));}catch(f){h.error=f;this.fire("data",h);}}else{h.error=new Error("Function data failure");this.fire("data",h);}return h.tId;}});b.DataSource.Function=c;},"@VERSION@",{requires:["datasource-local"]});