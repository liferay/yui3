YUI.add("yui-throttle",function(r,t){
/*! Based on work by Simon Willison: http://gist.github.com/292562 */
r.throttle=function(n,i){var o;return-1===(i=i||r.config.throttleTime||150)?function(){n.apply(this,arguments)}:(o=r.Lang.now(),function(){var t=r.Lang.now();i<t-o&&(o=t,n.apply(this,arguments))})}},"@VERSION@",{requires:["yui-base"]});