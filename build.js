'use strict';var _templateObject=_taggedTemplateLiteralLoose(['\t  <h2><strong>Hey, ','!</strong></h2>\t  <p>Your order is:</p>'],['\t  <h2><strong>Hey, ','!</strong></h2>\t  <p>Your order is:</p>']),_templateObject2=_taggedTemplateLiteralLoose(['    <div class="food-section">     <p><strong>','</strong> - $','      ','</p>    <p>','</p>    </div>  '],['    <div class="food-section">     <p><strong>','</strong> - $','      ','</p>    <p>','</p>    </div>  ']);function _taggedTemplateLiteralLoose(c,d){return c.raw=d,c}var arrows=document.querySelectorAll('.arrow'),dynImg=document.querySelector('.dyn-img'),bwd=document.querySelector('.bwd'),fwd=document.querySelector('.fwd'),form=document.querySelector('form'),jsArrow=document.querySelector('.js-arrow'),pageNumber=0,max=6,track=!1,len=0,dataText='',dialog=document.querySelector('dialog');arrows.forEach(function(c){return c.addEventListener('click',handleArrow)}),addEventListener('keydown',handleArrow);function handleArrow(c,d){if(!dialog.open){len=0;var f=this.classList&&this.classList.contains('fwd'),g=0==pageNumber,h=c.keyCode&&('INPUT'===document.activeElement.tagName||'TEXTAREA'===document.activeElement.tagName),i=c.keyCode&&39===c.keyCode,j=this.classList&&this.classList.contains('bwd'),k=c.keyCode&&37===c.keyCode,l=c.keyCode&&37!==c.keyCode&&39!==c.keyCode;if(g&&(bwd.tabIndex=-1),!(l||(k||!1===d)&&g||h)){if(!1===d||j||k)pageNumber--;else if(i||f||d){if(pageNumber==max)return;pageNumber++,bwd.tabIndex=0}1==pageNumber?bwd.classList.remove('custom-hide'):!pageNumber&&bwd.classList.add('custom-hide');var m=document.querySelector('[data-page="'+pageNumber+'"]');return Array.from(m.parentElement.children).forEach(function(n){n.classList.add('hide'),n.classList.remove('animate')}),m.classList.remove('hide'),m.classList.add('animate'),dynImg.src=m.dataset.pageSrc,m.parentElement.parentElement.parentElement.dataset.currentColor=m.dataset.bg,pageNumber==max?(jsArrow.classList.add('custom-hide'),jsArrow.tabIndex=-1,fwd.tabIndex=-1,fwd.classList.add('custom-hide')):void(fwd.tabIndex=0,jsArrow.tabIndex=0,fwd.classList.remove('custom-hide'),jsArrow.classList.remove('custom-hide'))}}}jsArrow.addEventListener('click',function(c){c.preventDefault(),fwd.click()}),form.addEventListener('submit',handleSub);function handleSub(c){function d(h){var i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:!0,j=void 0;if(j=i?document.querySelectorAll('[name='+h+']:checked'):document.querySelectorAll('[name='+h+']'),0===j.length)return null;var k=Array.from(j).map(function(l){return l.value});return k}dataText='',c.preventDefault();var f={crust:{main:d('crust'),isFood:!0,price:2.99},cheese:{main:d('cheese'),isFood:!0,price:1.29},'cheese range':{main:d('cheeserange',!1),isFood:!0,isLog:!0,price:.49},meat:{main:d('meat'),isFood:!0,price:2.49},veggie:{main:d('veggie'),isFood:!0,price:.49},drink:{main:d('drink'),isFood:!0,price:1.99},name:{main:d('name',!1)[0],isFood:!1},message:{main:d('message',!1)[0],isFood:!1}};for(var g in f)g=f[g],g.total=g.isLog?5/(1+40*Math.pow(Math.E,-1.6*g.price/2)):g.isFood&&g.main?g.main.length*g.price:0;return f.total=Object.values(f).reduce(function(h,i){return Math.floor(h+i.total)+(0===Math.round(Math.random())?.49:.99)},0),f.message.main.match(/\<\w+\>/gi)||f.name.main.match(/\<\w+\>/gi)?location.href='rickrolled.html':void finalSubmit(f)}var capitalizeFirstLetter=function(c){return c.replace(/\w\S*/g,function(d){return d.charAt(0).toUpperCase()+d.substr(1).toLowerCase()})};window.addEventListener('wheel',function(c){if(!dialog.open){c.preventDefault();var d;Math.abs(c.deltaY)<=0||track||(0<=c.deltaY?(d=!0,len++):(d=!1,len--),1<=Math.abs(len)&&(handleArrow(!1,d),len=0,track=!0,setTimeout(function(){track=!1},500)))}});var html=String.raw;function finalSubmit(c){for(var d in c.name.main&&(dataText+=html(_templateObject,c.name.main)),c)dataHTML(c,d);dataText+='<p class="total"><strong>Total: </strong>$'+c.total+'</p>',!c.message.main||(dataText+='<p><strong>You told us to keep in mind that:</strong></p>  <p>'+c.message.main+'</p>'),dialog.querySelector('.mdl-dialog__content').innerHTML=dataText,dialog.showModal()}dialog.querySelector('dialog .mdl-dialog__actions').addEventListener('click',function(c){return c.target.classList.contains('close')?dialog.close():void(c.target.classList.contains('agree')&&(dialog.close(),handleAgreement()))});function handleAgreement(){location.href='thanks.html'}function dataHTML(c,d){var f=c[d];if(f.main&&f.isFood)return dataText+=html(_templateObject2,capitalizeFirstLetter(d),f.price,1<f.main.length||f.isLog?'/ each':'',f.main.join(', ')),dataText}