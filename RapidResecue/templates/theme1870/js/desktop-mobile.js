function setViewPortTag(){document.getElementById('viewport').content="width="+document_width+", initial-scale=1.0";}
function resetViewPortTag(){var viewPortTag=document.createElement('meta');viewPortTag.id="viewport";viewPortTag.name="viewport";if(navigator.userAgent.match(/(android)/i)&&!navigator.userAgent.match(/(android 2.3)/i)){viewPortTag.content="maximum-scale=0.1"
document.getElementsByTagName('head')[0].appendChild(viewPortTag);setTimeout(function(){setViewPortTag()},100)}
else{viewPortTag.content=""
document.getElementsByTagName('head')[0].appendChild(viewPortTag);}}
function setViewPortTagDefault(){var viewPortTagDefault=document.createElement('meta');viewPortTagDefault.id="viewport";viewPortTagDefault.name="viewport";viewPortTagDefault.content="width=device-width, initial-scale=1.0"
document.getElementsByTagName('head')[0].appendChild(viewPortTagDefault);ios_fix()}
function createCookie(name,value,days)
{if(days)
{var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}
else var expires="";document.cookie=name+"="+value+expires+"; path=/";}
function readCookie(name)
{var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++)
{var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;}
function eraseCookie(name)
{createCookie(name,"",-1);}
function toDeskTop(){var isMobile=navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)|(android)|(webOS)/i)
if(isMobile){if(jQuery('#to-desktop').length){jQuery('#to-desktop').show().find('a').click(function(e){disableMobile=readCookie('disableMobile');if(disableMobile&&disableMobile!='false'){createCookie('disableMobile',false,365);}
else{createCookie('disableMobile',true,365);}
window.location.href=window.location.href
return false;});disableMobile=readCookie('disableMobile');if(disableMobile&&disableMobile!='false'){jQuery('#to-desktop .to_desktop').hide();jQuery('#to-desktop .to_mobile').show();resetViewPortTag();}
else{setViewPortTagDefault()}}
else{eraseCookie('disableMobile')
setViewPortTagDefault()}}}
jQuery(document).ready(function(){document_width=parseInt(jQuery('.row').css('width'))-parseInt(jQuery('.row').css('margin-left'));toDeskTop();});