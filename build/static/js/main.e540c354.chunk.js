(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{143:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(20),l=a(13),c=a.n(l),i=(a(96),a(14)),s=a(15),u=a(17),m=a(16),A=a(18),d=a(56),E=a(73),h=a(51),p=a(41),g=a(145),f=a(146),y=a(156),b=a(147),v=a(148),k=function(e){return{type:"UPDATE_EMPLOYEES",employees:e}},S=a(38),I=a.n(S),C="http://10.30.84.101:8080/",O=function(){return I.a.post(C+"retrieveEmployees")},w=function(e){return I.a.post(C+"getEmployee",{id:e})},j=function(e){return I.a.post(C+"getEmployeeWorkLog",{id:e})},D=function(e){return I.a.post(C+"createEmployee",e)},R=function(e,t){return I.a.post(C+"setEmployeeWorking",{id:e,working:t})},N=a(76),U=a.n(N),J=a(77),L=a.n(J),P=a(78),T=a.n(P),x=(a(44),function(e){function t(){return Object(i.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(A.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"container-box"},r.a.createElement("div",{className:"container-box-header"},this.props.header),r.a.createElement("div",{className:"container-box-body"},this.props.children))}}]),t}(r.a.Component));var M=Object(o.b)(function(e){return{}},function(e){return{}})(x),Z=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(u.a)(this,Object(m.a)(t).call(this))).setEmployeeWorking=function(t,a){R(t,a).then(function(){O().then(function(t){e.props.updateDisplayEmployees(t.data)})})},e.state={updateInterval:null},e}return Object(A.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;O().then(function(t){e.props.updateDisplayEmployees(t.data)});var t=setInterval(function(){O().then(function(t){e.props.updateDisplayEmployees(t.data)})},5e3);this.setState({updateInterval:t})}},{key:"componentWillUnmount",value:function(){clearInterval(this.state.updateInterval)}},{key:"render",value:function(){var e=this,t={backgroundColor:"#ffffe6"},a=this.props.employees.sort(function(e,t){return t.id-e.id}).map(function(a,n){return r.a.createElement("tr",{key:n,style:a.working?t:null},r.a.createElement("td",null,a.id),r.a.createElement("td",null,r.a.createElement(g.a,{src:T.a,width:"20",height:"20",className:"mr-2"}),r.a.createElement(p.LinkContainer,{to:"/employee/".concat(a.id)},r.a.createElement("a",{href:"#"},a.name+" "+a.surname))),r.a.createElement("td",null,a.personalCode),r.a.createElement("td",null,r.a.createElement(f.a,{variant:a.working?"success":"info"},a.working?"Str\u0101d\u0101":"Nestr\u0101d\u0101")),r.a.createElement("td",null,r.a.createElement(y.a,{placement:"top",overlay:r.a.createElement(b.a,{id:"tooltip-top"},"Atz\u012bm\u0113t k\u0101 ",a.working?"izg\u0101ju\u0161u":"ien\u0101ku\u0161u")},r.a.createElement("span",{className:"mr-2",onClick:function(){return e.setEmployeeWorking(a.id,!a.working)}},a.working?r.a.createElement(g.a,{src:U.a,width:"24",height:"24"}):r.a.createElement(g.a,{src:L.a,width:"24",height:"24"})))))});return r.a.createElement(M,{header:"Darbinieku Saraksts"},r.a.createElement(v.a,{hover:!0},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"#"),r.a.createElement("th",null,"V\u0100RDS"),r.a.createElement("th",null,"PERSONAS KODS"),r.a.createElement("th",null,"STATUS"),r.a.createElement("th",null,"KOMANDAS"))),r.a.createElement("tbody",null,a)))}}]),t}(r.a.Component);var Q=Object(o.b)(function(e){return{employees:e.employees.employees}},function(e){return{updateDisplayEmployees:function(t){return e(k(t))}}})(Z),K=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(u.a)(this,Object(m.a)(t).call(this,e))).addZero=function(e){return e<10&&(e="0"+e),e},a.state={userId:a.props.match.params.id,employee:{name:" ",surname:" "},workLog:[],updateInterval:null},a}return Object(A.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;w(this.state.userId).then(function(t){e.setState({employee:t.data})}),j(this.state.userId).then(function(t){e.setState({workLog:t.data})});var t=setInterval(function(){w(e.state.userId).then(function(t){e.setState({employee:t.data})}),j(e.state.userId).then(function(t){e.setState({workLog:t.data})})},5e3);this.setState({updateInterval:t})}},{key:"componentWillUnmount",value:function(){clearInterval(this.state.updateInterval)}},{key:"render",value:function(){var e=this,t=this.state.workLog.map(function(t,a){var n=null===t.end_time,o=new Date(t.start_time),l=n?new Date:new Date(t.end_time),c=+e.addZero(o.getDate())+"."+e.addZero(o.getMonth()+1)+"."+e.addZero(o.getFullYear())+" "+e.addZero(o.getHours())+":"+e.addZero(o.getMinutes())+":"+e.addZero(o.getSeconds()),i=n?" - ":e.addZero(l.getDate())+"."+e.addZero(l.getMonth()+1)+"."+e.addZero(l.getFullYear())+" "+e.addZero(l.getHours())+":"+e.addZero(l.getMinutes())+":"+e.addZero(l.getSeconds()),s=Math.floor((l-o)/1e3),u=Math.floor(s/60),m=Math.floor(u/60),A=Math.floor(m/24),d=+(m-=24*A)+" st. "+(u=u-24*A*60-60*m)+" min. "+(s=s-24*A*60*60-60*m*60-60*u)+" sek. ";return r.a.createElement("tr",{key:a,style:n?{backgroundColor:"#ffffe6"}:null},r.a.createElement("td",null,c),r.a.createElement("td",null,i),r.a.createElement("td",null,d))});return r.a.createElement(M,{header:this.state.employee.name+" "+this.state.employee.surname},r.a.createElement(v.a,{hover:!0},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"ATSKAITE S\u0100KTA"),r.a.createElement("th",null,"ATSKAITE BEIGTA"),r.a.createElement("th",null,"NOSTR\u0100D\u0100TS"))),r.a.createElement("tbody",null,t)))}}]),t}(r.a.Component);var Y=Object(o.b)(function(e){return{}},function(e){return{}})(K),B=a(152),G=a(155),F=a(149),V=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(u.a)(this,Object(m.a)(t).call(this,e))).onNameChange=function(e){a.setState({name:e.target.value})},a.onSurnameChange=function(e){a.setState({surname:e.target.value})},a.onPersonalCodeChange=function(e){a.setState({personalCode:e.target.value})},a.onFormSubmit=function(e){e.preventDefault(),e.stopPropagation();var t={name:a.state.name,surname:a.state.surname,personalCode:a.state.personalCode};D(t).then(function(){O().then(function(e){a.props.updateDisplayEmployees(e.data),a.setState({success:!0}),setTimeout(function(){a.setState({success:!1})},3e3)})}).catch(function(){console.log(" wefwef")}),a.setState({name:"",surname:"",personalCode:""})},a.state={name:"",surname:"",personalCode:"",success:!1},a}return Object(A.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(M,{header:"Jauna Darbinieka Re\u0123istr\u0101cija"},r.a.createElement(B.a,{onSubmit:this.onFormSubmit},r.a.createElement(B.a.Group,null,r.a.createElement(B.a.Label,null,"* V\u0101rds"),r.a.createElement(B.a.Control,{required:!0,value:this.state.name,onChange:this.onNameChange})),r.a.createElement(B.a.Group,null,r.a.createElement(B.a.Label,null,"* Uzv\u0101rds"),r.a.createElement(B.a.Control,{required:!0,value:this.state.surname,onChange:this.onSurnameChange})),r.a.createElement(B.a.Group,null,r.a.createElement(B.a.Label,null,"Personas Kods"),r.a.createElement(B.a.Control,{value:this.state.personalCode,onChange:this.onPersonalCodeChange})),r.a.createElement(G.a,{variant:"success",show:this.state.success,onClose:function(){return null}},"Darbinieks veiksm\u012bgi pievienots darbinieku sarakstam!"),r.a.createElement(F.a,{type:"submit"},"Pievienot!")))}}]),t}(r.a.Component);var W=Object(o.b)(function(e){return{employees:e.employees.employees}},function(e){return{updateDisplayEmployees:function(t){return e(k(t))}}})(V),H=a(150),X=a(140),z=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(u.a)(this,Object(m.a)(t).call(this))).addZero=function(e){return e<10&&(e="0"+e),e},e.getDateTime=function(){var t=new Date,a=t.getFullYear().toString()+". gada "+t.getDate().toString()+". "+["Janv\u0101ris","Febru\u0101ris","Marts","Apr\u012blis","Maijs","J\u016bnijs","J\u016blijs","Augusts","Septembris","Oktobris","Novembris","Decembris"][t.getMonth()].toLocaleLowerCase(),n=" "+e.addZero(t.getHours())+":"+e.addZero(t.getMinutes())+":"+e.addZero(t.getSeconds());e.setState({currentDate:a,currentTime:n})},e.state={currentDate:null,currentTime:null},e}return Object(A.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.getDateTime(),setInterval(function(){e.getDateTime()},1e3)}},{key:"render",value:function(){return r.a.createElement(H.a,null,r.a.createElement(X.a,null,this.state.currentDate,this.state.currentTime))}}]),t}(r.a.Component),q=function(e){function t(){return Object(i.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(A.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(H.a,null,r.a.createElement(X.a,null,"404"))}}]),t}(r.a.Component),_=a(83),$=a.n(_),ee=a(151),te=a(154),ae=a(153),ne=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).onClickEmployees=function(){a.setState({visibilityState:a.visibility.VISIBILITY_EMPLOYEES})},a.onClickRegistration=function(){a.setState({visibilityState:a.visibility.VISIBILITY_REGISTRATION})},a}return Object(A.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(d.a,null,r.a.createElement(ee.a,{className:"container"},r.a.createElement(H.a,null,r.a.createElement(X.a,null,r.a.createElement(te.a,{bg:"dark",variant:"dark",fixed:"top"},r.a.createElement(te.a.Brand,null,r.a.createElement("img",{src:$.a,alt:"",width:"30",height:"30",className:"d-inline-block align-top"})," V\u0100RPAS 1"),r.a.createElement(te.a.Collapse,{className:"justify-content-start"},r.a.createElement(ae.a,{className:"mr-auto"},r.a.createElement(p.LinkContainer,{exact:!0,to:"/"},r.a.createElement(ae.a.Link,null,"Darbinieki")),r.a.createElement(p.LinkContainer,{to:"/registration"},r.a.createElement(ae.a.Link,null,"Re\u0123istr\u0101cija")))),r.a.createElement(te.a.Collapse,{className:"justify-content-end"},r.a.createElement(te.a.Text,null,r.a.createElement(z,null)))))),r.a.createElement(H.a,null,r.a.createElement(X.a,null,r.a.createElement(E.a,null,r.a.createElement(h.a,{exact:!0,path:"/",component:Q}),r.a.createElement(h.a,{path:"/registration",component:W}),r.a.createElement(h.a,{path:"/employee/:id",component:Y}),r.a.createElement(h.a,{component:q}))))))}}]),t}(r.a.Component);var re=Object(o.b)(function(e){return{}},function(e){return{}})(ne);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var oe=a(32),le=a(85),ce=a(86),ie={employees:[]},se=Object(oe.b)({employees:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ie,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"UPDATE_EMPLOYEES":return Object(ce.a)({},e,{employees:Object(le.a)(t.employees)});default:return e}}});var ue=Object(oe.c)(se,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__());c.a.render(r.a.createElement(o.a,{store:ue},r.a.createElement(re,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},44:function(e,t,a){},76:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQ1SURBVGhD7ZpJyE5RGMc/85ApQxlW2EhJhoQFUSQLkY2hELJRpoVYmC2QaWXKjthhJ0NhIUTJnCkUG2XMPP9/N0/d3t577jn33ve+3+L91W9xT3d6vnuG5zzv19SgQfOnt5wj98sL8pX8JP/KP/KtfCBPyo1yvGwrmwXt5Hx5Sf6WvHSlP6u0me/kQTlS1oXWcrl8Ke2lPspTkvYJsq9sI41OcpCcIbfL65IvZdefkaNkaYyVd6S9wFU5V3aQoQyUW+Ubyb34qgdkF1kzWsq10rrKXTlJFkFnuUF+kdz7kaxJd2NQHpM85JfkofFuUxQD5BXJcwhqmiwMgjgtuTldYJysJYy/PdL+aLNlblrIo5KbMrAHy7JYLXnudzmRhjwwJrjZazmEhpJZL3k+03R/GrIwRvJpsdbdyYX1iGuSbhcEA9mm2HU01BHWn4eSd2GNCoILuJApthazUyiMEd7ng+xJgw/MUrZi+6wT/MXyBNtNskalcULyTluiIw8WSC6gT6ZBEO/lTdmLhkBmym9yX3TkZpgkpWHge2URZK4EQtqRBl+CIDj/lgwJhiCYWrl2GQ0ekJxy/qzoyEEfSb5DAtiRBg94eYIICSYexCYaPFksuYZu5oT9BCeSxYYQEkzWIIA9D9fRvVrRkAR9lRNXREdh+ASTJwiDzRnXD42OErgoOYndWxZcwRQRBFjy6szB2J5yUr/oKBvVgikqCNgsuQ/pSyK2x867l44H81QWFQQsldyLDDkRTuChRUAwjyX3xB2yCOZJ7nc4OkrACghFEO9OWDlmsmJTsHMRZZXmJFbsPMSD2Ckrx0weVkruRQEjkfuSk/JsoKoN7PiYyRvMXsl9nJkwCyEnUbLJgmt2igdz+/9xFmzbPTU6SoAKICc5P1sCPlMsL08QWYMhS6ZiyfWkU4mwE+Qkimch+ARh5AmGEhHXMQScUAIlYtJlimc+hARhZA2GKZxrdkdHKVDp42QqgGl0l+wnQoIw4sEcoSGF+IaPvUkqIyQnU8NKm4bJQA/JLEkmEMxxOT06crNQ8l43oiNPzkoucuYzJdJePpO8U9CMSlWcVf6rpIxZbyxRpGBO0TAIGyuXZT0rKaMlkwn1Nbp9MF3lE0kwzkyzhjCGnkvewbt6Uo3h8rPkRmtoKBH+kDarnZPOra0PlPb5rNywrMHP3tyqMwRDUIVAUcIWPWqxebNjF4yJF5JnkZs5U5EsTJZUL3gAtdjcpf4KKLqxqP6QPOO8pApZEyjtk4fxIKS+5LXKOmDFXiRtnWDaZ7rNPSbSsF90bRNGXkYFkJ2bbzcgiyUBJHeyggdSpmWCKZUekinRupt5T5J20E0oFPA7/BK5SrIpYj9hqbjJVyZNCV7sioS+TS2WblYZlEtS8V2y9C/gA/2aCiCB8csvCyn/2YDbJPvtKbLwmahBg5rQ1PQPENhcJgqP0KIAAAAASUVORK5CYII="},77:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAINSURBVGhD7Zk9SFVhGIBvP5hDZDhIIoKLEUjgErUotCRBOom09DMVNLQ4KDhES4KL0KJtjbZEbrakLoJgRNTSYoNCPygEaWaF9TynexeRuOa93vvW98CD93u955zv9Xw/7znmEolEIpH4DziE17A5awVmEH/ig6wVlFbcwC3sNBCRAziL3o1xA1G5iSaxjHUGItKEn9BEegxEZRJNYiJrBaUPTWIVGwxEpB4/oIlcNRCVh2gST7NWUC6gSXzGFgMROYqLaCK3DURlFE1iDq2tQnIOf+AmthmISA2+Qu/GHQNRsfMm8RpNKiQOI4eTw8rhFRIntBPbu+FED4tLrEm45Lr0lo3LePr3x5LjZuemZyJugmXDEtqLrOMlAyVmCj2/5UjZGUEv9h2vGygRFoKe9z1aIO4L/eizsg4Z2COW5CtoIpbq+8oV/IZe/D4exL/FhyTP8yRrVYCLuIZ24hEewd3SjR7v46tzsGKcxcKweIbHsFj87hJ67A0DleYUvkU79AJPYDGMocdMo694qoJGfIl2zM3sJP6JDnSx+IK+bKsqjuMMmsxHPIM7UYtv0O8NGKhG7ORjtJPu0l24nXvo75/jYQPVioWfL5btrEu0S3WBdnQzVT+H4C6ajHPBTdS//kI+NoyhuIU+V9j5+fxP54dDMBy9+BULdyfsvwHkPL5Di85EIpFI/Mvkcr8AKZx2HqSxMFUAAAAASUVORK5CYII="},78:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEkSURBVEhL7dY/SAJhHMbxI6nEqSGIlgh3QXBqEoSIcHNraozExdZam6RBJ3eHIGpwdkxosKnN0bE/grREFOn3BYcjHo/Lfq+TX/hw090jd3BesOwPrUyPCymPW7xhPD22sAlvXcCNKU+oIAXT9vEDNRrWhekj6EANKQcwaRUfUCNKHSZtQQ3McgeT1vEFNaJcw6xHqBHlFGYNoEaUc5i0hk+oEaUJsy6hRn57QQ6mxXnOJzDvEFFvrz6S8FIVavQZaXgrAzV8D69loYYf4K0NuNehGv7GEcxKoIAGhlCjYT2cYRdztYMrvEINxOF+xDHcv1usSniHutg83MfBNiLbg3te6gL/4V4+kV8mbagTLRQxsxHUSRZqkLlbceNRGcsWXRBMAEq4HznHoPN0AAAAAElFTkSuQmCC"},83:function(e,t,a){e.exports=a.p+"static/media/logo.96ebfbf9.png"},87:function(e,t,a){e.exports=a(143)},96:function(e,t,a){}},[[87,2,1]]]);
//# sourceMappingURL=main.e540c354.chunk.js.map