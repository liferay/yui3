YUI.add("yui-throttle",function(o,t){
/*! Based on work by Simon Willison: http://gist.github.com/292562 */
o.throttle=function(n,i){if(-1===(i=i||o.config.throttleTime||150))return function(){n.apply(this,arguments)};var r=o.Lang.now();return function(){var t=o.Lang.now();i<t-r&&(r=t,n.apply(this,arguments))}}},"@VERSION@",{requires:["yui-base"]});