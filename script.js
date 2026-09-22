/* =====================================================================
   EDIT HER AGE HERE — this is the only place it lives.
   Replace "X" with her new age as a plain number, no quotes. Example:
       var AGE = 21;
   Every age on the site updates from this one number: the big title,
   the candles heading and how many candles there are, the letter line,
   last year's birthday, the password, and the password hints.
   ===================================================================== */
var AGE = "17";
/* ===================================================================== */

(function(){
"use strict";
document.documentElement.classList.add("js");

/* ---- age words (filled in from AGE above) ---- */
var HAS_AGE = typeof AGE==="number" && AGE>0 && AGE<100;
var ONES=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
var TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function word(n){ return n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?"-"+ONES[n%10]:"") }
function ordinalWord(n){
  var w=word(n), irr={one:"first",two:"second",three:"third",five:"fifth",eight:"eighth",nine:"ninth",twelve:"twelfth"};
  var m=w.match(/([a-z]+)$/)[1];
  if(irr[m]) return w.slice(0,w.length-m.length)+irr[m];
  if(/y$/.test(w)) return w.slice(0,-1)+"ieth";
  return w+"th";
}
function cap(w){ return w.charAt(0).toUpperCase()+w.slice(1) }
function ageText(f){
  if(!HAS_AGE) return "X";
  switch(f){
    case "word": return word(AGE);
    case "Word": return cap(word(AGE));
    case "ordinal": return ordinalWord(AGE);
    case "lastYearWord": return word(AGE-1);
    case "lastYearOrdinal": return ordinalWord(AGE-1);
    case "number": return String(AGE);
  }
  return "X";
}
Array.prototype.forEach.call(document.querySelectorAll(".age"),function(el){ el.textContent=ageText(el.getAttribute("data-f")) });
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=false; try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?0:ms)})};

/* ================= confetti ================= */
var cv=$("#fx"),ctx=cv.getContext("2d"),bits=[],running=false,dpr=Math.min(2,window.devicePixelRatio||1);
var COLS=["#b89ef2","#d9ccfa","#c4c7d0","#7a2233","#ffc46b","#ece9f0","#8f76cf"];
function size(){cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;cv.style.width=innerWidth+"px";cv.style.height=innerHeight+"px";ctx.setTransform(dpr,0,0,dpr,0,0)}
size(); addEventListener("resize",size);
function burst(x,y,n,spread){
  if(reduce) return;
  n=n||120; spread=spread||1;
  for(var i=0;i<n;i++){
    var a=-Math.PI/2+(Math.random()-.5)*Math.PI*spread, v=6+Math.random()*9;
    bits.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:4+Math.random()*6,h:7+Math.random()*9,
      r:Math.random()*6.3,vr:(Math.random()-.5)*.35,c:COLS[(Math.random()*COLS.length)|0],
      life:1,round:Math.random()<.25,wob:Math.random()*6.3});
  }
  if(!running){running=true;requestAnimationFrame(frame)}
}
function puff(x,y){
  if(reduce) return;
  for(var i=0;i<14;i++) bits.push({x:x,y:y,vx:(Math.random()-.5)*2.4,vy:-Math.random()*2.2-.6,w:3,h:3,r:0,vr:0,
    c:Math.random()<.5?"#ffd9a0":"#9d9aa6",life:.8,round:true,smoke:true,wob:0});
  if(!running){running=true;requestAnimationFrame(frame)}
}
function frame(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(var i=bits.length-1;i>=0;i--){
    var b=bits[i];
    if(b.smoke){b.x+=b.vx;b.y+=b.vy;b.vy-=.01;b.life-=.02}
    else{b.vx*=.985;b.vy=b.vy*.985+.22;b.wob+=.1;b.x+=b.vx+Math.sin(b.wob)*.6;b.y+=b.vy;b.r+=b.vr;if(b.y>innerHeight*.7)b.life-=.012}
    if(b.life<=0||b.y>innerHeight+30){bits.splice(i,1);continue}
    ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,b.life));ctx.translate(b.x,b.y);ctx.rotate(b.r);ctx.fillStyle=b.c;
    if(b.round){ctx.beginPath();ctx.arc(0,0,b.w/2,0,6.3);ctx.fill()}
    else ctx.fillRect(-b.w/2,-b.h/2*Math.abs(Math.cos(b.wob)),b.w,b.h*Math.abs(Math.cos(b.wob))+1);
    ctx.restore();
  }
  if(bits.length) requestAnimationFrame(frame); else {running=false;ctx.clearRect(0,0,innerWidth,innerHeight)}
}
function cannons(){burst(0,innerHeight*.75,110,.7);setTimeout(function(){burst(innerWidth,innerHeight*.75,110,.7)},150);
  setTimeout(function(){burst(innerWidth/2,innerHeight*.9,90,.5)},380)}
/* the side cannons tilt toward the middle */
var _burst=burst; burst=function(x,y,n,s){_burst(x,y,n,s); if(x===0||x===innerWidth){var k=bits.length-(n||120);for(var i=Math.max(0,k);i<bits.length;i++){bits[i].vx=Math.abs(bits[i].vx)*(x===0?1:-1)+(x===0?3:-3)}}};

/* ================= the gate ================= */
var PW=["iloveyou"+(HAS_AGE?AGE:"x")], tries=0;
var log=$("#gLog"), gStatus=$("#gStatus");
function say(text,who,cls){var d=document.createElement("div");d.className="msg "+(who||"her")+(cls?" "+cls:"");d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function typing(on){
  var t=$(".typing",log); if(t) t.remove();
  gStatus.textContent=on?"typing…":"online";
  if(on){t=document.createElement("div");t.className="typing";t.innerHTML="<i></i><i></i><i></i>";log.appendChild(t);log.scrollTop=log.scrollHeight}
}
function unlocked(){try{return sessionStorage.getItem("t19")==="1"}catch(e){return false}}
function reply(v){
  var words=v.replace(/[^a-z]/g,""), digits=v.replace(/[^0-9]/g,"");
  if(HAS_AGE&&words==="iloveyou"&&digits===String(AGE-1)) return ["Close. That was last year.","How old are you today?"];
  if(words==="iloveyou"&&digits) return ["The three words are right 🖤","Now fix the two digits at the end. How old are you today?"];
  if(words==="iloveyou") return ["The three words are right 🖤","Now put two digits straight after them, no space. Your age as of today."];
  if(HAS_AGE&&digits===String(AGE)) return ["The number is right.","The three words aren't. Think about what you sent me at 4:57am on your "+ageText("lastYearOrdinal")+"."];
  if(tries===1) return ["Not quite 😌","It's three words, then two digits, all joined into one. No spaces anywhere. Capitals don't matter."];
  if(tries===2) return ["Hint: the three words are the ones you once said feel too shallow.","The two digits are how old you are today. Still no spaces."];
  return ["Okay, last hint.","i _ _ _ _ _ _ _, then your new age. All one word, like iloveyou00 but with the right number."];
}
$("#gForm").addEventListener("submit",function(e){
  e.preventDefault();
  var raw=$("#pw").value, v=(raw||"").trim().toLowerCase().replace(/[^a-z0-9]/g,"");
  if(!v) return;
  $("#pw").value="";
  var mine=say("•".repeat(Math.min(raw.length,14)),"him");
  var tk=document.createElement("span"); tk.className="ticks"; tk.textContent="✓✓"; mine.appendChild(tk);
  setTimeout(function(){tk.classList.add("read")},350);
  if(PW.indexOf(v)>-1){
    wait(700).then(function(){typing(true);return wait(900)}).then(function(){typing(false);say("There you are.");return wait(900)})
    .then(open_);
  } else {
    tries++;
    var r=reply(v);
    wait(500).then(function(){typing(true);return wait(900)}).then(function(){
      typing(false); say(r[0]); return wait(700);
    }).then(function(){typing(true);return wait(1000)}).then(function(){typing(false); say(r[1],"her","hint"); $("#pw").focus({preventScroll:true});});
  }
});
function open_(){
  $("#gate").classList.add("gone");
  document.body.classList.remove("locked");
  setTimeout(function(){$("#gate").style.display="none"},900);
  var sp=0; try{sp=+sessionStorage.getItem("t23p")||0}catch(e){}
  startPages(sp>0&&sp<pages.length?sp:0);
}

/* ================= hero sequence ================= */
function heroSeq(){
  var s=function(n){$$('#hero .seq[data-s="'+n+'"]').forEach(function(e){e.classList.add("shown")})};
  var th=$("#heroThread");
  wait(500).then(function(){s(0);var t=document.createElement("div");t.className="typing";t.innerHTML="<i></i><i></i><i></i>";th.insertBefore(t,th.firstChild);th._t=t;return wait(1100)})
  .then(function(){th._t&&th._t.remove();s(1);return wait(800)})
  .then(function(){var t=document.createElement("div");t.className="typing r";t.innerHTML="<i></i><i></i><i></i>";th.insertBefore(t,th.children[1]);th._t=t;return wait(1100)})
  .then(function(){th._t&&th._t.remove();s(2);return wait(900)})
  .then(function(){s(3);return wait(700)})
  .then(function(){s(4);$("#heroPh").classList.add("dev");return wait(1300)})
  .then(function(){var t=$("#title"),hp=$("#hero"),r=t.getBoundingClientRect(),lim=innerHeight-90;if(r.bottom>lim)hp.scrollTo({top:hp.scrollTop+r.bottom-lim+10,behavior:reduce?"auto":"smooth"});t.classList.add("go");return wait(2300)})
  .then(function(){cannons();return wait(800)})
  .then(function(){s(6);var hp=$("#hero");setTimeout(function(){hp.scrollTo({top:hp.scrollHeight,behavior:reduce?"auto":"smooth"})},300)});
}

/* ================= the live bits ================= */
function lagosParts(){
  try{
    var f=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Lagos",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
    var o={}; f.forEach(function(p){o[p.type]=p.value}); return o;
  }catch(e){return null}
}
function nowLine(){
  var p=lagosParts(), el=$("#now"); if(!p){el.textContent="";return}
  var hm=(p.hour==="24"?"00":p.hour)+":"+p.minute, y=+p.year, m=+p.month, d=+p.day;
  if(y===2026&&m===9&&d===23) el.textContent="It's "+hm+" in Aladanla, and it's your birthday.";
  else if(y<2026||(y===2026&&(m<9||(m===9&&d<23)))){
    var target=Date.UTC(2026,8,22,23,0), mins=Math.max(0,Math.round((target-Date.now())/6e4));
    el.textContent=Math.floor(mins/60)+" hours and "+(mins%60)+" minutes until it's the 23rd in Aladanla.";
  } else {
    var days=Math.floor((Date.UTC(y,m-1,d)-Date.UTC(2026,8,23))/864e5);
    el.textContent="It's "+hm+" in Aladanla. You have been "+ageText("word")+" for "+days+(days===1?" day.":" days.");
  }
}
function tick(){
  var day=864e5, now=new Date();
  $("#streak").textContent=(Math.floor((now-new Date(2025,11,9))/day)+1).toLocaleString();
  var sat=Math.floor((now-new Date(2025,9,4))/(day*7))+1; if(sat<0)sat=0; if(sat>110)sat=110;
  $("#satCount").textContent=sat; $("#satLeft").textContent=110-sat;
  var g=$("#sats"); if(!g.children.length){for(var i=0;i<110;i++)g.appendChild(document.createElement("i"))}
  $$("i",g).forEach(function(c,i){c.className=i<sat?"gone":(i===sat?"next":"")});
}
function clocks(){
  try{
    var o={hour:"2-digit",minute:"2-digit",hour12:false};
    $("#ct1").textContent=new Intl.DateTimeFormat("en-GB",Object.assign({timeZone:"America/New_York"},o)).format(new Date());
    $("#ct2").textContent=new Intl.DateTimeFormat("en-GB",Object.assign({timeZone:"Africa/Lagos"},o)).format(new Date());
  }catch(e){$("#ct1").textContent="--:--";$("#ct2").textContent="--:--"}
  nowLine();
}
tick(); clocks(); setInterval(tick,20000); setInterval(clocks,15000);

var lb=$("#lb");
/* ================= reveal helpers ================= */
function countUp(el){
  var to=+el.getAttribute("data-to"), t0=null, dur=1500;
  if(reduce){el.textContent=to.toLocaleString();return}
  function step(ts){ if(!t0)t0=ts; var k=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-k,3);
    el.textContent=Math.round(to*e).toLocaleString(); if(k<1) requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
function playThread(th){
  var kids=$$(":scope > *",th), i=0;
  (function next(){
    if(i>=kids.length) return;
    var k=kids[i++];
    var isMsg=k.classList.contains("msg");
    if(isMsg && i>1 && !reduce){
      var t=document.createElement("div"); t.className="typing"+(k.classList.contains("him")?" r":"");
      t.innerHTML="<i></i><i></i><i></i>"; th.insertBefore(t,k);
      setTimeout(function(){t.remove();k.classList.add("shown");setTimeout(next,160)},520);
    } else { k.classList.add("shown"); setTimeout(next,reduce?0:220) }
  })();
}
function once(el){ if(el._done) return false; el._done=true; return true }
function activate(p){
  if(p.id==="hero"){ if(once(p)) heroSeq(); return }
  setTimeout(function(){
    $$(".ph",p).forEach(function(f){f.classList.add("dev")});
    $$(".thread.anim",p).forEach(function(t){ if(once(t)) playThread(t) });
    $$(".num[data-to]",p).forEach(function(n){ if(!n.closest(".later") && once(n)) countUp(n) });
    var bars=$("#bars",p); if(bars) setTimeout(function(){bars.classList.add("in")},300);
    if(p.id==="end" && once(p)) ending();
  },reduce?0:280);
}

/* ================= pages ================= */
var pages=$$("#doc > .page"), idx=0, prog=$("#prog"), started=false;
var CH={1:"How we got here",2:"Everything, counted",3:"You, on the record",4:"Tonight"};
function strip(){
  var p=pages[idx], ch=p.getAttribute("data-ch"), st=$("#strip");
  if(ch==="0"){st.classList.add("off");return}
  st.classList.remove("off");
  $("#stripName").textContent=CH[ch];
  var mine=pages.filter(function(x){return x.getAttribute("data-ch")===ch});
  $("#stripDots").innerHTML=mine.map(function(x){
    var j=pages.indexOf(x), c=j<idx?"done":(j===idx?"cur":"");
    return '<i class="'+c+(x.classList.contains("wine")?" w":"")+'"></i>';
  }).join("");
}
function moreHint(){
  var p=pages[idx], m=$("#more");
  setTimeout(function(){ m.classList.toggle("on", p.scrollHeight-p.clientHeight>60 && p.scrollTop<30) },650);
}
pages.forEach(function(p){ p.addEventListener("scroll",function(){ if(p.scrollTop>30) $("#more").classList.remove("on") },{passive:true}) });
function go(i){
  if(i<0||i>=pages.length||i===idx&&started) return;
  started=true;
  if(lb.classList.contains("on")) closeLb();
  pages.forEach(function(p,j){
    p.classList.toggle("on",j===i); p.classList.toggle("past",j<i);
    p.setAttribute("aria-hidden",j===i?"false":"true");
    if(j!==i) p.inert=true; else p.inert=false;
  });
  idx=i;
  var p=pages[i]; p.scrollTop=0;
  $("#count").textContent=(i+1)+" / "+pages.length;
  $("#prev").disabled=(i===0);
  var last=i===pages.length-1;
  $("#next").textContent=last?"Start over":"Next";
  prog.style.transform="scaleX("+((i+1)/pages.length)+")";
  strip(); moreHint(); activate(p);
  try{sessionStorage.setItem("t23p",String(i))}catch(e){}
}
function startPages(i){ go(i||0) }
$("#prev").addEventListener("click",function(){go(idx-1)});
$("#next").addEventListener("click",function(){ idx===pages.length-1 ? go(0) : go(idx+1) });
addEventListener("keydown",function(e){
  if($("#gate").style.display!=="none" || lb.classList.contains("on")) return;
  if(/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||"")) return;
  if(e.key==="ArrowRight"||e.key==="PageDown") go(idx+1);
  if(e.key==="ArrowLeft"||e.key==="PageUp") go(idx-1);
});
(function(){
  var x0=0,y0=0,t0=0,deck=$("#doc");
  deck.addEventListener("touchstart",function(e){var t=e.changedTouches[0];x0=t.clientX;y0=t.clientY;t0=Date.now()},{passive:true});
  deck.addEventListener("touchend",function(e){
    if(lb.classList.contains("on")) return;
    var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;
    if(Date.now()-t0>700) return;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6) go(dx<0?idx+1:idx-1);
  },{passive:true});
})();

/* ================= guesses ================= */
var ANS={1:85175,2:501,3:570817};
$$("[data-g]").forEach(function(b){b.addEventListener("click",function(){
  var k=b.getAttribute("data-g"), g=parseFloat($("#g"+k).value), box=$("#r"+k), out=$("#o"+k);
  if(!box.classList.contains("on")){box.classList.add("on");countUp($(".num",box))}
  if(isNaN(g)){out.textContent="No guess, no verdict.";return}
  var a=ANS[k], d=Math.abs(a-g);
  if(d/a*100<=5){out.textContent="You guessed "+g.toLocaleString()+". That is frighteningly close.";var r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top,50,.8)}
  else if(g<a) out.textContent="You guessed "+g.toLocaleString()+". Low by "+d.toLocaleString()+".";
  else out.textContent="You guessed "+g.toLocaleString()+". High by "+d.toLocaleString()+", which is flattering.";
});});
$$(".guess input").forEach(function(inp){inp.addEventListener("keydown",function(e){if(e.key==="Enter")$("[data-g='"+inp.id.slice(1)+"']").click()})});

/* ================= names ================= */
var NICK=[["queen",831,27],["diva",468,23],["babe",365,324],["bubbles",1,109],
          ["my love",43,70],["princess",49,16],["darling",5,22],["her majesty",11,16]];
$("#bars").innerHTML=NICK.map(function(n,i){
  var him=Math.max(.6,n[1]/831*100), her=Math.max(.6,n[2]/831*100);
  return '<div class="bar"><span class="w">'+n[0]+'</span><span class="t" style="width:'+him+'%;transition-delay:'+(i*.08)+'s"></span>'+
    '<span class="t h" style="width:'+her+'%;transition-delay:'+(i*.08+.05)+'s"></span><span class="n">'+n[1]+' from me, '+n[2]+' from you</span></div>';
}).join("");

/* ================= spelling test ================= */
$$(".quiz").forEach(function(q){
  var ans=q.getAttribute("data-ans");
  $$("[data-p]",q).forEach(function(b){b.addEventListener("click",function(){
    if(q.classList.contains("done")) return; q.classList.add("done");
    var ok=b.getAttribute("data-p")===ans;
    $$("[data-p]",q).forEach(function(x){x.disabled=true; if(x.getAttribute("data-p")===ans)x.classList.add("right")});
    if(!ok) b.classList.add("wrong");
    $(".later",q).classList.add("on");
  })});
});

/* ================= dimples ================= */
$("#dimBtn").addEventListener("click",function(){
  var dots=$$(".dots span"), i=0, btn=this; btn.disabled=true; btn.textContent="Counting";
  var t=setInterval(function(){dots[i].classList.add("on");i++;
    if(i>=5){clearInterval(t);btn.textContent="Five";$("#dimOut").textContent="All five. Which means, by your own rule, you are very happy.";
      var r=dots[2].getBoundingClientRect();burst(r.left,r.top,40,.9)}
  },reduce?0:380);
});

/* ================= dragon ================= */
$$("#dragon .btn").forEach(function(b){b.addEventListener("click",function(){
  var ok=b.getAttribute("data-ok")==="1";
  $$("#dragon .btn").forEach(function(x){x.disabled=true;if(x.getAttribute("data-ok")==="1")x.classList.add("right")});
  if(!ok) b.classList.add("wrong");
  $("#dragVerdict").textContent=ok?"Correct. You were very specific about the eyes.":"No. You were very specific about the eyes.";
  $("#dragOut").classList.add("on");
})});

/* ================= established facts ================= */
var TASTE=[
 ["Fried rice with spicy chicken",1,"Declared best food on 24 April 2025 and never challenged since."],
 ["Strawberry ice cream",1,"Or vanilla. Your words: if it's not strawberry or vanilla i'll pass."],
 ["Chocolate ice cream",0,"Absolutely not. Chocolate yes, chocolate ice cream no. I stopped asking why."],
 ["Capri-Sun",1,"A woman with a civil engineering offer. Still Capri-Sun."],
 ["Akara",1,"Non-negotiable."],
 ["Cedar yoghurt",1,"Specific brand. No substitutes accepted."],
 ["Amala",0,"You would rather go hungry, and you have."],
 ["Being made to socialise",0,"Every time, without fail, you need the whole rest of the day back afterwards."],
 ["Short men",0,"Not hatred. Just a firmly held position you have never been argued out of."]
];
$("#taste").innerHTML=TASTE.map(function(t){
  return '<li class="'+(t[1]?"yes":"no")+'"><button type="button" aria-expanded="false"><span class="i">'+t[0]+'</span><span class="v">'+
    '<span class="q">?</span></span><span class="note">'+t[2]+'</span></button></li>';
}).join("");
$$("#taste li").forEach(function(li){$("button",li).addEventListener("click",function(){
  var on=li.classList.toggle("on"); this.setAttribute("aria-expanded",on);
  $(".v",li).textContent=on?(li.classList.contains("yes")?"yes":"no"):"?";
})});

/* ================= music ================= */
var ART=["Rema","Ayra Starr","Burna Boy","Alex Warren","Qing Madi","Faouzia","SZA","Lewis Capaldi"];
$("#plist").innerHTML=ART.map(function(a){return '<a class="chip" target="_blank" rel="noopener" href="https://open.spotify.com/search/'+encodeURIComponent(a)+'">'+a+'</a>'}).join("");

/* ================= love language ================= */
var TICKS=[
 ["Remembering what I said","Every word of it is still here. 85,175 of them."],
 ["Keeping track of the things that matter to me","This entire page is the receipt."],
 ["The way you say my name","831 queens. 468 divas. 49 princesses. I was never going to just say Treasure."],
 ["Reassurance, coz I'm an overthinker","Half my replies to you land inside the same minute. That was never an accident."]
];
$("#ticks").innerHTML=TICKS.map(function(t){
  return '<button class="tick" type="button" aria-pressed="false"><span class="b"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span class="x">'+
    t[0]+'<span class="e">'+t[1]+'</span></span></button>';
}).join("");
var doneT=0;
$$(".tick").forEach(function(el){el.addEventListener("click",function(){
  if(el.classList.contains("on")) return;
  el.classList.add("on"); el.setAttribute("aria-pressed","true"); doneT++;
  if(doneT===4) $("#tickOut").textContent="Four for four. I was paying attention.";
})});

/* ================= any day ================= */
var DAYS=[
 ["16 April 2025","her","she's lucky i love her frl. i would've sold her to my big brother😭😭😂😂"],
 ["20 April 2025","her","chai.. see my mate. at that time did ik how to do anything but stare at myself and admire how deep my dimples r??"],
 ["10 May 2025","him","Legit about to say let's meet to prove it 😭😭 But I was like nope I am cleansed 😭"],
 ["20 May 2025","her","i came up w a new design.. but no compilation till i get my sketchbook"],
 ["8 June 2025","him","and what work dares to steal my diva away..."],
 ["27 June 2025","him","dear diva ... I'm back"],
 ["10 July 2025","her","What's the fun in watching cartoons if u can't memorize the lines better than u store ur books😭😂"],
 ["11 July 2025","her","if ion watch anime, i watch cartoons lol"],
 ["22 July 2025","him","🥲🥲 your will be done her majesty"],
 ["9 August 2025","her","Her majesty needs her beauty sleep 😴"],
 ["1 September 2025","her","I got my guitar back btw"],
 ["1 November 2025","her","Aww. Lemme go and recaption it “my husband guys😝”😂😂"],
 ["3 November 2025","her","Was going to crochet you a jumper 😔"],
 ["14 December 2025","her","I just might stick to the brand for a while"],
 ["2 January 2026","her","I was busy🥲 And when I took a break I watched Barbie"],
 ["17 March 2026","her","Brand no too Dey important 🥲 But I’m a size M for trousers"],
 ["23 April 2026","her","Babe I want to be a unicorn😔 Or a dragon🥹"],
 ["2 June 2026","her","“Fourth Wing” is giving me my spark back"],
 ["19 July 2026","her","Finished ACOTAR yesternight"],
 ["24 July 2026","her","Jeez I made you watch off campus while you were still fasting 😭🥲"]
];
var lastD=-1;
$("#shufBtn").addEventListener("click",function(){
  var i; do{i=Math.floor(Math.random()*DAYS.length)}while(i===lastD);
  lastD=i; var d=DAYS[i];
  $("#shufDate").textContent=d[0];
  var m=document.createElement("div"); m.className="msg "+d[1]; m.textContent=d[2];
  var b=$("#shufBody"); b.innerHTML=""; b.className=""; b.appendChild(m);
  this.textContent="Another one";
});

/* ================= candles ================= */
/* ===== EDIT: CANDLE MESSAGES =====
   One message per candle, in order. The number of candles comes from AGE at the top of this file.
   Add or remove lines so there is one line per candle.
   Keep the quotes and the comma at the end of each line. Last line has no comma. */
var WISHES=[
 "You've become very easy to miss and very difficult to replace.Happy birthday, you. I'm glad September 2009 happened",
 "Five dimples. They only all show up when you're very happy.",
 "Lavender. You told me on 24 April 2025 and I built this page out of it.",
 "Of all the people I could have ended up knowing this much about, I'm glad it was you.",
 "You're a surprisingly large part of my camera roll, conversations, thoughts, and generally my life.",
 "You have four names for me and you pick by how much trouble I'm in.",
 "46,081 messages from you. More than me, by a distance.",
 "You send the last message of the night on 363 days out of 501.",
 "More than half your replies land inside the same minute.",
 "You are the reason I know what a dahlia dimple is.",
 "I've spent a lot of time paying attention to you. I think that's been a pretty good use of my time.",
 "You can spend forever choosing something and then know immediately when it's the right one.",
 "Five ACOTAR books in about three weeks, then Fourth Wing in days.",
 "You abandoned your Barbie era and then rewatched Barbie as an Island Princess.",
 "You laugh at the worst possible moment. Every time. Never once on purpose.",
 "I love You, and You're mine.",
 "These are only 17 things. I could've made this considerably longer, and I'd still have missed something. Frankly, There's no particularly clever way to end this. I just really like knowing you"
];
/* ===== END OF CANDLE MESSAGES ===== */
/* One candle per year of her age. If AGE is still "X", it uses one candle per message above.
   If there are more candles than messages, the extra candles use EXTRA_WISH below. */
var EXTRA_WISH="This one is for you to fill in. Make a wish of your own.";
var row=$("#cakeRow"), TOTAL=HAS_AGE?AGE:WISHES.length, lit=TOTAL;
$("#left").textContent=TOTAL+" still lit";
for(var ci=0;ci<TOTAL;ci++)(function(i){ var w=WISHES[i]||EXTRA_WISH;
  var b=document.createElement("button");
  b.type="button"; b.className="candle"; b.setAttribute("aria-label","Candle "+(i+1)+" of "+TOTAL);
  b.innerHTML='<span class="fl"></span><span class="st"></span>';
  b.addEventListener("click",function(){
    if(b.classList.contains("out")) return;
    b.classList.add("out"); b.setAttribute("aria-label","Candle "+(i+1)+", blown out"); lit--;
    var r=b.getBoundingClientRect(); puff(r.left+r.width/2,r.top+6);
    $("#wishBox").innerHTML='<span class="n">Candle '+(i+1)+'</span>';
    var m=document.createElement("span"); m.textContent=w; $("#wishBox").appendChild(m);
    $("#left").textContent=lit?(lit+" still lit"):"All out";
    if(lit===0){
      $("#candleDone").textContent="All "+TOTAL+" of them. Now make one of your own.";
      setTimeout(cannons,400);
    }
  });
  row.appendChild(b);
})(ci);

/* ================= the letter ================= */
$("#env").addEventListener("click",function(){
  var env=this; if(env.classList.contains("open")) return;
  env.classList.add("open"); env.setAttribute("aria-expanded","true");
  wait(1300).then(function(){
    $("#envWrap").style.display="none";
    var L=$("#letter"); L.classList.add("on");
    L.setAttribute("tabindex","-1"); L.focus({preventScroll:true});
    var pg=L.closest(".page"); pg.scrollTo({top:pg.scrollTop+L.getBoundingClientRect().top-80,behavior:reduce?"auto":"smooth"}); moreHint();
  });
});

/* ================= the end ================= */
function ending(){
  $("#shallow").classList.add("go");
  wait(2900).then(function(){ $("#endTail").classList.add("shown"); cannons(); });
}
$("#again").addEventListener("click",cannons);

/* ================= lightbox ================= */
var gal=$$(".ph img"), cur=0, lbImg=$("#lbImg"), lastFocus=null;
function show(i){cur=(i+gal.length)%gal.length;lbImg.src=gal[cur].src;lbImg.alt=gal[cur].alt}
function openLb(i){lastFocus=document.activeElement;show(i);lb.classList.add("on");$("#lbX").focus()}
function closeLb(){lb.classList.remove("on");if(lastFocus)lastFocus.focus()}
$$(".ph").forEach(function(f){
  var img=$("img",f); f.setAttribute("tabindex","0"); f.setAttribute("role","button"); f.setAttribute("aria-label","Open photo: "+(img.alt||"photo"));
  f.addEventListener("click",function(){openLb(gal.indexOf(img))});
  f.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(gal.indexOf(img))}});
});
$("#lbX").addEventListener("click",closeLb);
$("#lbP").addEventListener("click",function(){show(cur-1)});
$("#lbN").addEventListener("click",function(){show(cur+1)});
lb.addEventListener("click",function(e){if(e.target===lb)closeLb()});
addEventListener("keydown",function(e){
  if(!lb.classList.contains("on")) return;
  if(e.key==="Escape")closeLb(); if(e.key==="ArrowLeft")show(cur-1); if(e.key==="ArrowRight")show(cur+1);
});
var sx=0; lb.addEventListener("touchstart",function(e){sx=e.changedTouches[0].clientX},{passive:true});
lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(dx<0?cur+1:cur-1)},{passive:true});

/* ================= start ================= */
setTimeout(function(){try{$("#pw").focus({preventScroll:true})}catch(e){}},400);
})();
