YUI.add("test",function(b){b.namespace("Test");b.Test.Case=function(c){this._should={};for(var d in c){this[d]=c[d];}if(!b.Lang.isString(this.name)){this.name="testCase"+b.guid();}};b.Test.Case.prototype={resume:function(c){b.Test.Runner.resume(c);},wait:function(e,d){var c=arguments;if(b.Lang.isFunction(c[0])){throw new b.Test.Wait(c[0],c[1]);}else{throw new b.Test.Wait(function(){b.Assert.fail("Timeout: wait() called but resume() never called.");},(b.Lang.isNumber(c[0])?c[0]:10000));}},setUp:function(){},tearDown:function(){}};b.Test.Wait=function(d,c){this.segment=(b.Lang.isFunction(d)?d:null);this.delay=(b.Lang.isNumber(c)?c:0);};b.namespace("Test");b.Test.Suite=function(c){this.name="";this.items=[];if(b.Lang.isString(c)){this.name=c;}else{if(b.Lang.isObject(c)){b.mix(this,c,true);}}if(this.name===""){this.name="testSuite"+b.guid();}};b.Test.Suite.prototype={add:function(c){if(c instanceof b.Test.Suite||c instanceof b.Test.Case){this.items.push(c);}return this;},setUp:function(){},tearDown:function(){}};b.Test.Runner=(function(){function d(e){this.testObject=e;this.firstChild=null;this.lastChild=null;this.parent=null;this.next=null;this.results={passed:0,failed:0,total:0,ignored:0,duration:0};if(e instanceof b.Test.Suite){this.results.type="testsuite";this.results.name=e.name;}else{if(e instanceof b.Test.Case){this.results.type="testcase";this.results.name=e.name;}}}d.prototype={appendChild:function(e){var f=new d(e);if(this.firstChild===null){this.firstChild=this.lastChild=f;}else{this.lastChild.next=f;this.lastChild=f;}f.parent=this;return f;}};function c(){c.superclass.constructor.apply(this,arguments);this.masterSuite=new b.Test.Suite("yuitests"+(new Date()).getTime());this._cur=null;this._root=null;this._log=true;this._waiting=false;this._running=false;this._lastResults=null;var f=[this.TEST_CASE_BEGIN_EVENT,this.TEST_CASE_COMPLETE_EVENT,this.TEST_SUITE_BEGIN_EVENT,this.TEST_SUITE_COMPLETE_EVENT,this.TEST_PASS_EVENT,this.TEST_FAIL_EVENT,this.TEST_IGNORE_EVENT,this.COMPLETE_EVENT,this.BEGIN_EVENT];for(var e=0;e<f.length;e++){this.on(f[e],this._logEvent,this,true);}}b.extend(c,b.Event.Target,{TEST_CASE_BEGIN_EVENT:"testcasebegin",TEST_CASE_COMPLETE_EVENT:"testcasecomplete",TEST_SUITE_BEGIN_EVENT:"testsuitebegin",TEST_SUITE_COMPLETE_EVENT:"testsuitecomplete",TEST_PASS_EVENT:"pass",TEST_FAIL_EVENT:"fail",TEST_IGNORE_EVENT:"ignore",COMPLETE_EVENT:"complete",BEGIN_EVENT:"begin",disableLogging:function(){this._log=false;},enableLogging:function(){this._log=true;},_logEvent:function(g){var f="";var e="";switch(g.type){case this.BEGIN_EVENT:f="Testing began at "+(new Date()).toString()+".";e="info";break;case this.COMPLETE_EVENT:f=b.substitute("Testing completed at "+(new Date()).toString()+".\n"+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",g.results);e="info";break;case this.TEST_FAIL_EVENT:f=g.testName+": failed.\n"+g.error.getMessage();e="fail";break;case this.TEST_IGNORE_EVENT:f=g.testName+": ignored.";e="ignore";break;case this.TEST_PASS_EVENT:f=g.testName+": passed.";e="pass";break;case this.TEST_SUITE_BEGIN_EVENT:f='Test suite "'+g.testSuite.name+'" started.';e="info";break;case this.TEST_SUITE_COMPLETE_EVENT:f=b.substitute('Test suite "'+g.testSuite.name+'" completed'+".\n"+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",g.results);e="info";break;case this.TEST_CASE_BEGIN_EVENT:f='Test case "'+g.testCase.name+'" started.';e="info";break;case this.TEST_CASE_COMPLETE_EVENT:f=b.substitute('Test case "'+g.testCase.name+'" completed.\n'+"Passed:{passed} Failed:{failed} "+"Total:{total} ({ignored} ignored)",g.results);e="info";break;default:f="Unexpected event "+g.type;f="info";}if(this._log){b.log(f,e,"TestRunner");}},_addTestCaseToTestTree:function(f,g){var h=f.appendChild(g),i,e;for(i in g){if((i.indexOf("test")===0||(i.toLowerCase().indexOf("should")>-1&&i.indexOf(" ")>-1))&&b.Lang.isFunction(g[i])){h.appendChild(i);}}},_addTestSuiteToTestTree:function(e,h){var g=e.appendChild(h);for(var f=0;f<h.items.length;f++){if(h.items[f] instanceof b.Test.Suite){this._addTestSuiteToTestTree(g,h.items[f]);}else{if(h.items[f] instanceof b.Test.Case){this._addTestCaseToTestTree(g,h.items[f]);}}}},_buildTestTree:function(){this._root=new d(this.masterSuite);for(var e=0;e<this.masterSuite.items.length;e++){if(this.masterSuite.items[e] instanceof b.Test.Suite){this._addTestSuiteToTestTree(this._root,this.masterSuite.items[e]);}else{if(this.masterSuite.items[e] instanceof b.Test.Case){this._addTestCaseToTestTree(this._root,this.masterSuite.items[e]);}}}},_handleTestObjectComplete:function(e){if(b.Lang.isObject(e.testObject)){if(e.parent){e.parent.results.passed+=e.results.passed;e.parent.results.failed+=e.results.failed;e.parent.results.total+=e.results.total;e.parent.results.ignored+=e.results.ignored;e.parent.results[e.testObject.name]=e.results;}if(e.testObject instanceof b.Test.Suite){e.testObject.tearDown();e.results.duration=(new Date())-e._start;this.fire(this.TEST_SUITE_COMPLETE_EVENT,{testSuite:e.testObject,results:e.results});}else{if(e.testObject instanceof b.Test.Case){e.results.duration=(new Date())-e._start;this.fire(this.TEST_CASE_COMPLETE_EVENT,{testCase:e.testObject,results:e.results});}}}},_next:function(){if(this._cur===null){this._cur=this._root;}else{if(this._cur.firstChild){this._cur=this._cur.firstChild;}else{if(this._cur.next){this._cur=this._cur.next;}else{while(this._cur&&!this._cur.next&&this._cur!==this._root){this._handleTestObjectComplete(this._cur);this._cur=this._cur.parent;}this._handleTestObjectComplete(this._cur);if(this._cur==this._root){this._cur.results.type="report";this._cur.results.timestamp=(new Date()).toLocaleString();this._cur.results.duration=(new Date())-this._cur._start;this._lastResults=this._cur.results;this._running=false;this.fire(this.COMPLETE_EVENT,{results:this._lastResults});this._cur=null;}else{this._cur=this._cur.next;}}}}return this._cur;},_run:function(){var g=false;var f=this._next();if(f!==null){this._running=true;
this._lastResult=null;var e=f.testObject;if(b.Lang.isObject(e)){if(e instanceof b.Test.Suite){this.fire(this.TEST_SUITE_BEGIN_EVENT,{testSuite:e});f._start=new Date();e.setUp();}else{if(e instanceof b.Test.Case){this.fire(this.TEST_CASE_BEGIN_EVENT,{testCase:e});f._start=new Date();}}if(typeof setTimeout!="undefined"){setTimeout(function(){b.Test.Runner._run();},0);}else{this._run();}}else{this._runTest(f);}}},_resumeTest:function(j){var e=this._cur;this._waiting=false;if(!e){return;}var k=e.testObject;var h=e.parent.testObject;if(h.__yui_wait){clearTimeout(h.__yui_wait);delete h.__yui_wait;}var n=(h._should.fail||{})[k];var f=(h._should.error||{})[k];var i=false;var l=null;try{j.apply(h);if(n){l=new b.Assert.ShouldFail();i=true;}else{if(f){l=new b.Assert.ShouldError();i=true;}}}catch(m){if(h.__yui_wait){clearTimeout(h.__yui_wait);delete h.__yui_wait;}if(m instanceof b.Assert.Error){if(!n){l=m;i=true;}}else{if(m instanceof b.Test.Wait){if(b.Lang.isFunction(m.segment)){if(b.Lang.isNumber(m.delay)){if(typeof setTimeout!="undefined"){h.__yui_wait=setTimeout(function(){b.Test.Runner._resumeTest(m.segment);},m.delay);this._waiting=true;}else{throw new Error("Asynchronous tests not supported in this environment.");}}}return;}else{if(!f){l=new b.Assert.UnexpectedError(m);i=true;}else{if(b.Lang.isString(f)){if(m.message!=f){l=new b.Assert.UnexpectedError(m);i=true;}}else{if(b.Lang.isFunction(f)){if(!(m instanceof f)){l=new b.Assert.UnexpectedError(m);i=true;}}else{if(b.Lang.isObject(f)){if(!(m instanceof f.constructor)||m.message!=f.message){l=new b.Assert.UnexpectedError(m);i=true;}}}}}}}}if(i){this.fire(this.TEST_FAIL_EVENT,{testCase:h,testName:k,error:l});}else{this.fire(this.TEST_PASS_EVENT,{testCase:h,testName:k});}h.tearDown();var g=(new Date())-e._start;e.parent.results[k]={result:i?"fail":"pass",message:l?l.getMessage():"Test passed",type:"test",name:k,duration:g};if(i){e.parent.results.failed++;}else{e.parent.results.passed++;}e.parent.results.total++;if(typeof setTimeout!="undefined"){setTimeout(function(){b.Test.Runner._run();},0);}else{this._run();}},_handleError:function(e){if(this._waiting){this._resumeTest(function(){throw e;});}else{throw e;}},_runTest:function(h){var e=h.testObject;var f=h.parent.testObject;var i=f[e];var g=(f._should.ignore||{})[e];if(g){h.parent.results[e]={result:"ignore",message:"Test ignored",type:"test",name:e};h.parent.results.ignored++;h.parent.results.total++;this.fire(this.TEST_IGNORE_EVENT,{testCase:f,testName:e});if(typeof setTimeout!="undefined"){setTimeout(function(){b.Test.Runner._run();},0);}else{this._run();}}else{h._start=new Date();f.setUp();this._resumeTest(i);}},getName:function(){return this.masterSuite.name;},setName:function(e){this.masterSuite.name=e;},fire:function(e,f){f=f||{};f.type=e;c.superclass.fire.call(this,e,f);},add:function(e){this.masterSuite.add(e);return this;},clear:function(){this.masterSuite=new b.Test.Suite("yuitests"+(new Date()).getTime());},isWaiting:function(){return this._waiting;},isRunning:function(){return this._running;},getResults:function(e){if(!this._running&&this._lastResults){if(b.Lang.isFunction(e)){return e(this._lastResults);}else{return this._lastResults;}}else{return null;}},getCoverage:function(e){if(!this._running&&typeof _yuitest_coverage=="object"){if(b.Lang.isFunction(e)){return e(_yuitest_coverage);}else{return _yuitest_coverage;}}else{return null;}},resume:function(e){if(b.Test.Runner._waiting){this._resumeTest(e||function(){});}else{throw new Error("resume() called without wait().");}},run:function(e){var f=b.Test.Runner;if(!e&&this.masterSuite.items.length==1&&this.masterSuite.items[0] instanceof b.Test.Suite){this.masterSuite=this.masterSuite.items[0];}f._buildTestTree();f._root._start=new Date();f.fire(f.BEGIN_EVENT);f._run();}});return new c();})();b.Assert={_asserts:0,_formatMessage:function(d,c){var e=d;if(b.Lang.isString(d)&&d.length>0){return b.Lang.substitute(d,{message:c});}else{return c;}},_getCount:function(){return this._asserts;},_increment:function(){this._asserts++;},_reset:function(){this._asserts=0;},fail:function(c){throw new b.Assert.Error(b.Assert._formatMessage(c,"Test force-failed."));},areEqual:function(d,e,c){b.Assert._increment();if(d!=e){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Values should be equal."),d,e);}},areNotEqual:function(c,e,d){b.Assert._increment();if(c==e){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(d,"Values should not be equal."),c);}},areNotSame:function(c,e,d){b.Assert._increment();if(c===e){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(d,"Values should not be the same."),c);}},areSame:function(d,e,c){b.Assert._increment();if(d!==e){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Values should be the same."),d,e);}},isFalse:function(d,c){b.Assert._increment();if(false!==d){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value should be false."),false,d);}},isTrue:function(d,c){b.Assert._increment();if(true!==d){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value should be true."),true,d);}},isNaN:function(d,c){b.Assert._increment();if(!isNaN(d)){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value should be NaN."),NaN,d);}},isNotNaN:function(d,c){b.Assert._increment();if(isNaN(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Values should not be NaN."),NaN);}},isNotNull:function(d,c){b.Assert._increment();if(b.Lang.isNull(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Values should not be null."),null);}},isNotUndefined:function(d,c){b.Assert._increment();if(b.Lang.isUndefined(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should not be undefined."),undefined);}},isNull:function(d,c){b.Assert._increment();if(!b.Lang.isNull(d)){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value should be null."),null,d);}},isUndefined:function(d,c){b.Assert._increment();if(!b.Lang.isUndefined(d)){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value should be undefined."),undefined,d);
}},isArray:function(d,c){b.Assert._increment();if(!b.Lang.isArray(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be an array."),d);}},isBoolean:function(d,c){b.Assert._increment();if(!b.Lang.isBoolean(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be a Boolean."),d);}},isFunction:function(d,c){b.Assert._increment();if(!b.Lang.isFunction(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be a function."),d);}},isInstanceOf:function(d,e,c){b.Assert._increment();if(!(e instanceof d)){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Value isn't an instance of expected type."),d,e);}},isNumber:function(d,c){b.Assert._increment();if(!b.Lang.isNumber(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be a number."),d);}},isObject:function(d,c){b.Assert._increment();if(!b.Lang.isObject(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be an object."),d);}},isString:function(d,c){b.Assert._increment();if(!b.Lang.isString(d)){throw new b.Assert.UnexpectedValue(b.Assert._formatMessage(c,"Value should be a string."),d);}},isTypeOf:function(c,e,d){b.Assert._increment();if(typeof e!=c){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(d,"Value should be of type "+c+"."),expected,typeof e);}}};b.assert=function(d,c){b.Assert._increment();if(!d){throw new b.Assert.Error(b.Assert._formatMessage(c,"Assertion failed."));}};b.fail=b.Assert.fail;b.Assert.Error=function(c){arguments.callee.superclass.constructor.call(this,c);this.message=c;this.name="Assert Error";};b.extend(b.Assert.Error,Error,{getMessage:function(){return this.message;},toString:function(){return this.name+": "+this.getMessage();},valueOf:function(){return this.toString();}});b.Assert.ComparisonFailure=function(d,c,e){arguments.callee.superclass.constructor.call(this,d);this.expected=c;this.actual=e;this.name="ComparisonFailure";};b.extend(b.Assert.ComparisonFailure,b.Assert.Error,{getMessage:function(){return this.message+"\nExpected: "+this.expected+" ("+(typeof this.expected)+")"+"\nActual: "+this.actual+" ("+(typeof this.actual)+")";}});b.Assert.UnexpectedValue=function(d,c){arguments.callee.superclass.constructor.call(this,d);this.unexpected=c;this.name="UnexpectedValue";};b.extend(b.Assert.UnexpectedValue,b.Assert.Error,{getMessage:function(){return this.message+"\nUnexpected: "+this.unexpected+" ("+(typeof this.unexpected)+") ";}});b.Assert.ShouldFail=function(c){arguments.callee.superclass.constructor.call(this,c||"This test should fail but didn't.");this.name="ShouldFail";};b.extend(b.Assert.ShouldFail,b.Assert.Error);b.Assert.ShouldError=function(c){arguments.callee.superclass.constructor.call(this,c||"This test should have thrown an error but didn't.");this.name="ShouldError";};b.extend(b.Assert.ShouldError,b.Assert.Error);b.Assert.UnexpectedError=function(c){arguments.callee.superclass.constructor.call(this,"Unexpected error: "+c.message);this.cause=c;this.name="UnexpectedError";this.stack=c.stack;};b.extend(b.Assert.UnexpectedError,b.Assert.Error);b.ArrayAssert={contains:function(e,d,c){b.Assert._increment();if(b.Array.indexOf(d,e)==-1){b.Assert.fail(b.Assert._formatMessage(c,"Value "+e+" ("+(typeof e)+") not found in array ["+d+"]."));}},containsItems:function(e,f,d){b.Assert._increment();for(var c=0;c<e.length;c++){if(b.Array.indexOf(f,e[c])==-1){b.Assert.fail(b.Assert._formatMessage(d,"Value "+e[c]+" ("+(typeof e[c])+") not found in array ["+f+"]."));}}},containsMatch:function(e,d,c){b.Assert._increment();if(typeof e!="function"){throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");}if(!b.Array.some(d,e)){b.Assert.fail(b.Assert._formatMessage(c,"No match found in array ["+d+"]."));}},doesNotContain:function(e,d,c){b.Assert._increment();if(b.Array.indexOf(d,e)>-1){b.Assert.fail(b.Assert._formatMessage(c,"Value found in array ["+d+"]."));}},doesNotContainItems:function(e,f,d){b.Assert._increment();for(var c=0;c<e.length;c++){if(b.Array.indexOf(f,e[c])>-1){b.Assert.fail(b.Assert._formatMessage(d,"Value found in array ["+f+"]."));}}},doesNotContainMatch:function(e,d,c){b.Assert._increment();if(typeof e!="function"){throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");}if(b.Array.some(d,e)){b.Assert.fail(b.Assert._formatMessage(c,"Value found in array ["+d+"]."));}},indexOf:function(g,f,c,e){b.Assert._increment();for(var d=0;d<f.length;d++){if(f[d]===g){if(c!=d){b.Assert.fail(b.Assert._formatMessage(e,"Value exists at index "+d+" but should be at index "+c+"."));}return;}}b.Assert.fail(b.Assert._formatMessage(e,"Value doesn't exist in array ["+f+"]."));},itemsAreEqual:function(e,f,d){b.Assert._increment();if(e.length!=f.length){b.Assert.fail(b.Assert._formatMessage(d,"Array should have a length of "+e.length+" but has a length of "+f.length));}for(var c=0;c<e.length;c++){if(e[c]!=f[c]){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(d,"Values in position "+c+" are not equal."),e[c],f[c]);}}},itemsAreEquivalent:function(f,g,c,e){b.Assert._increment();if(typeof c!="function"){throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");}if(f.length!=g.length){b.Assert.fail(b.Assert._formatMessage(e,"Array should have a length of "+f.length+" but has a length of "+g.length));}for(var d=0;d<f.length;d++){if(!c(f[d],g[d])){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(e,"Values in position "+d+" are not equivalent."),f[d],g[d]);}}},isEmpty:function(d,c){b.Assert._increment();if(d.length>0){b.Assert.fail(b.Assert._formatMessage(c,"Array should be empty."));}},isNotEmpty:function(d,c){b.Assert._increment();if(d.length===0){b.Assert.fail(b.Assert._formatMessage(c,"Array should not be empty."));}},itemsAreSame:function(e,f,d){b.Assert._increment();if(e.length!=f.length){b.Assert.fail(b.Assert._formatMessage(d,"Array should have a length of "+e.length+" but has a length of "+f.length));
}for(var c=0;c<e.length;c++){if(e[c]!==f[c]){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(d,"Values in position "+c+" are not the same."),e[c],f[c]);}}},lastIndexOf:function(g,f,c,e){for(var d=f.length;d>=0;d--){if(f[d]===g){if(c!=d){b.Assert.fail(b.Assert._formatMessage(e,"Value exists at index "+d+" but should be at index "+c+"."));}return;}}b.Assert.fail(b.Assert._formatMessage(e,"Value doesn't exist in array."));}};b.ObjectAssert={areEqual:function(d,e,c){b.Assert._increment();b.Object.each(d,function(g,f){if(d[f]!=e[f]){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,"Values should be equal for property "+f),d[f],e[f]);}});},hasKey:function(c,d,e){b.Assert._increment();if(!(c in d)){b.fail(b.Assert._formatMessage(e,"Property '"+c+"' not found on object."));}},hasKeys:function(e,c,f){b.Assert._increment();for(var d=0;d<e.length;d++){if(!(e[d] in c)){b.fail(b.Assert._formatMessage(f,"Property '"+e[d]+"' not found on object."));}}},ownsKey:function(c,d,e){b.Assert._increment();if(!d.hasOwnProperty(c)){b.fail(b.Assert._formatMessage(e,"Property '"+c+"' not found on object instance."));}},ownsKeys:function(e,c,f){b.Assert._increment();for(var d=0;d<e.length;d++){if(!c.hasOwnProperty(e[d])){b.fail(b.Assert._formatMessage(f,"Property '"+e[d]+"' not found on object instance."));}}},ownsNoKeys:function(c,e){b.Assert._increment();var d=b.Object.keys(c);if(d.length>0){b.fail(b.Assert._formatMessage(e,"Object owns "+d.length+" properties but should own none."));}}};b.DateAssert={datesAreEqual:function(d,f,c){b.Assert._increment();if(d instanceof Date&&f instanceof Date){var e="";if(d.getFullYear()!=f.getFullYear()){e="Years should be equal.";}if(d.getMonth()!=f.getMonth()){e="Months should be equal.";}if(d.getDate()!=f.getDate()){e="Days of month should be equal.";}if(e.length){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,e),d,f);}}else{throw new TypeError("Y.Assert.datesAreEqual(): Expected and actual values must be Date objects.");}},timesAreEqual:function(d,f,c){b.Assert._increment();if(d instanceof Date&&f instanceof Date){var e="";if(d.getHours()!=f.getHours()){e="Hours should be equal.";}if(d.getMinutes()!=f.getMinutes()){e="Minutes should be equal.";}if(d.getSeconds()!=f.getSeconds()){e="Seconds should be equal.";}if(e.length){throw new b.Assert.ComparisonFailure(b.Assert._formatMessage(c,e),d,f);}}else{throw new TypeError("DateY.AsserttimesAreEqual(): Expected and actual values must be Date objects.");}}};b.namespace("Test.Format");function a(c){return c.replace(/[<>"'&]/g,function(d){switch(d){case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&apos;";case"&":return"&amp;";}});}b.Test.Format.JSON=function(c){return b.JSON.stringify(c);};b.Test.Format.XML=function(d){function c(g){var e=b.Lang,f="<"+g.type+' name="'+a(g.name)+'"';if(e.isNumber(g.duration)){f+=' duration="'+g.duration+'"';}if(g.type=="test"){f+=' result="'+g.result+'" message="'+a(g.message)+'">';}else{f+=' passed="'+g.passed+'" failed="'+g.failed+'" ignored="'+g.ignored+'" total="'+g.total+'">';b.Object.each(g,function(h){if(e.isObject(h)&&!e.isArray(h)){f+=c(h);}});}f+="</"+g.type+">";return f;}return'<?xml version="1.0" encoding="UTF-8"?>'+c(d);};b.Test.Format.JUnitXML=function(c){function d(g){var e=b.Lang,f="";switch(g.type){case"test":if(g.result!="ignore"){f='<testcase name="'+a(g.name)+'" time="'+(g.duration/1000)+'">';if(g.result=="fail"){f+='<failure message="'+a(g.message)+'"><![CDATA['+g.message+"]]></failure>";}f+="</testcase>";}break;case"testcase":f='<testsuite name="'+a(g.name)+'" tests="'+g.total+'" failures="'+g.failed+'" time="'+(g.duration/1000)+'">';b.Object.each(g,function(h){if(e.isObject(h)&&!e.isArray(h)){f+=d(h);}});f+="</testsuite>";break;case"testsuite":b.Object.each(g,function(h){if(e.isObject(h)&&!e.isArray(h)){f+=d(h);}});break;case"report":f="<testsuites>";b.Object.each(g,function(h){if(e.isObject(h)&&!e.isArray(h)){f+=d(h);}});f+="</testsuites>";}return f;}return'<?xml version="1.0" encoding="UTF-8"?>'+d(c);};b.Test.Format.TAP=function(d){var e=1;function c(g){var f=b.Lang,h="";switch(g.type){case"test":if(g.result!="ignore"){h="ok "+(e++)+" - "+g.name;if(g.result=="fail"){h="not "+h+" - "+g.message;}h+="\n";}else{h="#Ignored test "+g.name+"\n";}break;case"testcase":h="#Begin testcase "+g.name+"("+g.failed+" failed of "+g.total+")\n";b.Object.each(g,function(i){if(f.isObject(i)&&!f.isArray(i)){h+=c(i);}});h+="#End testcase "+g.name+"\n";break;case"testsuite":h="#Begin testsuite "+g.name+"("+g.failed+" failed of "+g.total+")\n";b.Object.each(g,function(i){if(f.isObject(i)&&!f.isArray(i)){h+=c(i);}});h+="#End testsuite "+g.name+"\n";break;case"report":b.Object.each(g,function(i){if(f.isObject(i)&&!f.isArray(i)){h+=c(i);}});}return h;}return"1.."+d.total+"\n"+c(d);};b.namespace("Coverage.Format");b.Coverage.Format.JSON=function(c){return b.JSON.stringify(c);};b.Coverage.Format.XdebugJSON=function(d){var c={};b.Object.each(d,function(f,e){c[e]=d[e].lines;});return b.JSON.stringify(c);};b.namespace("Test");b.Test.Reporter=function(c,d){this.url=c;this.format=d||b.Test.Format.XML;this._fields=new Object();this._form=null;this._iframe=null;};b.Test.Reporter.prototype={constructor:b.Test.Reporter,addField:function(c,d){this._fields[c]=d;},clearFields:function(){this._fields=new Object();},destroy:function(){if(this._form){this._form.parentNode.removeChild(this._form);this._form=null;}if(this._iframe){this._iframe.parentNode.removeChild(this._iframe);this._iframe=null;}this._fields=null;},report:function(d){if(!this._form){this._form=document.createElement("form");this._form.method="post";this._form.style.visibility="hidden";this._form.style.position="absolute";this._form.style.top=0;document.body.appendChild(this._form);var c=document.createElement("div");c.innerHTML='<iframe name="yuiTestTarget"></iframe>';this._iframe=c.firstChild;this._iframe.src="javascript:false";this._iframe.style.visibility="hidden";this._iframe.style.position="absolute";
this._iframe.style.top=0;document.body.appendChild(this._iframe);this._form.target="yuiTestTarget";}this._form.action=this.url;while(this._form.hasChildNodes()){this._form.removeChild(this._form.lastChild);}this._fields.results=this.format(d);this._fields.useragent=navigator.userAgent;this._fields.timestamp=(new Date()).toLocaleString();b.Object.each(this._fields,function(f,g){if(typeof f!="function"){var e=document.createElement("input");e.type="hidden";e.name=g;e.value=f;this._form.appendChild(e);}},this);delete this._fields.results;delete this._fields.useragent;delete this._fields.timestamp;if(arguments[1]!==false){this._form.submit();}}};b.Mock=function(e){e=e||{};var c=null;try{c=b.Object(e);}catch(d){c={};b.log("Couldn't create mock with prototype.","warn","Mock");}b.Object.each(e,function(f){if(b.Lang.isFunction(e[f])){c[f]=function(){b.Assert.fail("Method "+f+"() was called but was not expected to be.");};}});return c;};b.Mock.expect=function(d,h){if(!d.__expectations){d.__expectations={};}if(h.method){var g=h.method,f=h.args||h.arguments||[],c=h.returns,j=b.Lang.isNumber(h.callCount)?h.callCount:1,e=h.error,i=h.run||function(){};d.__expectations[g]=h;h.callCount=j;h.actualCallCount=0;b.Array.each(f,function(k,l,m){if(!(m[l] instanceof b.Mock.Value)){m[l]=b.Mock.Value(b.Assert.areSame,[k],"Argument "+l+" of "+g+"() is incorrect.");}});if(j>0){d[g]=function(){try{h.actualCallCount++;b.Assert.areEqual(f.length,arguments.length,"Method "+g+"() passed incorrect number of arguments.");for(var m=0,k=f.length;m<k;m++){f[m].verify(arguments[m]);}i.apply(this,arguments);if(e){throw e;}}catch(l){b.Test.Runner._handleError(l);}return c;};}else{d[g]=function(){try{b.Assert.fail("Method "+g+"() should not have been called.");}catch(k){b.Test.Runner._handleError(k);}};}}else{if(h.property){d.__expectations[g]=h;}}};b.Mock.verify=function(c){try{b.Object.each(c.__expectations,function(e){if(e.method){b.Assert.areEqual(e.callCount,e.actualCallCount,"Method "+e.method+"() wasn't called the expected number of times.");}else{if(e.property){b.Assert.areEqual(e.value,c[e.property],"Property "+e.property+" wasn't set to the correct value.");}}});}catch(d){b.Test.Runner._handleError(d);}};b.Mock.Value=function(e,c,d){if(b.instanceOf(this,b.Mock.Value)){this.verify=function(g){var f=[].concat(c||[]);f.push(g);f.push(d);e.apply(null,f);};}else{return new b.Mock.Value(e,c,d);}};b.Mock.Value.Any=b.Mock.Value(function(){});b.Mock.Value.Boolean=b.Mock.Value(b.Assert.isBoolean);b.Mock.Value.Number=b.Mock.Value(b.Assert.isNumber);b.Mock.Value.String=b.Mock.Value(b.Assert.isString);b.Mock.Value.Object=b.Mock.Value(b.Assert.isObject);b.Mock.Value.Function=b.Mock.Value(b.Assert.isFunction);if(typeof YUITest=="undefined"||!YUITest){YUITest={TestRunner:b.Test.Runner,ResultsFormat:b.Test.Format,CoverageFormat:b.Coverage.Format};}},"@VERSION@",{requires:["event-simulate","event-custom","substitute","json-stringify"]});