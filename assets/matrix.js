var ARCANA_DATA = {"1": {"name": "The Magician", "keywords": "will, skill, beginning", "short": "You start things with your own hands — an idea becomes a plan, and a plan becomes a first step."}, "2": {"name": "The High Priestess", "keywords": "intuition, patience, inner knowledge", "short": "You often know things before you can explain how — you notice what is not being said."}, "3": {"name": "The Empress", "keywords": "growth, care, abundance", "short": "You make things grow: people, projects, and rooms you walk into feel warmer with you in them."}, "4": {"name": "The Emperor", "keywords": "structure, order, authority", "short": "You are at your best when life has clear rules, honest limits, and a plan that actually holds."}, "5": {"name": "The Hierophant", "keywords": "tradition, learning, guidance", "short": "You learn best from a teacher, a method, and doing things properly — then you pass it on."}, "6": {"name": "The Lovers", "keywords": "choice, love, values", "short": "You live by what you value, and the people closest to you help you see yourself clearly."}, "7": {"name": "The Chariot", "keywords": "drive, focus, victory", "short": "You move forward by choosing one direction and staying on it, even when the road gets rough."}, "8": {"name": "Justice", "keywords": "balance, truth, fairness", "short": "You weigh things honestly — you want a fair outcome, even when it is uncomfortable."}, "9": {"name": "The Hermit", "keywords": "solitude, wisdom, search", "short": "You find your answers in quiet: a walk, a book, time alone with your own thoughts."}, "10": {"name": "Wheel of Fortune", "keywords": "change, cycles, luck", "short": "Your life moves in turns — good periods follow hard ones, and nothing stays the same for long."}, "11": {"name": "Strength", "keywords": "courage, patience, inner power", "short": "Your strength is quiet: you stay calm, keep going, and carry more than people realise."}, "12": {"name": "The Hanged Man", "keywords": "pause, new view, surrender", "short": "You are in a pause right now — pushing harder will not help, and looking at it differently will."}, "13": {"name": "Death", "keywords": "ending, change, rebirth", "short": "Something in your life has finished, and this arcana is about letting it end cleanly so something new can begin."}, "14": {"name": "Temperance", "keywords": "balance, patience, blending", "short": "You do your best work in the middle path — not too much, not too little, steady over time."}, "15": {"name": "The Devil", "keywords": "desire, attachment, shadow", "short": "You want something badly enough that it is starting to own you — and you know exactly what it is."}, "16": {"name": "The Tower", "keywords": "sudden change, truth, rebuilding", "short": "Something false in your life is collapsing, and once it falls you will finally see clearly."}, "17": {"name": "The Star", "keywords": "hope, healing, guidance", "short": "You are coming out of a hard period, and hope is returning — quietly, but for real."}, "18": {"name": "The Moon", "keywords": "dreams, fear, illusion", "short": "You feel things deeply and sense what others miss — but right now, not everything you feel is true."}, "19": {"name": "The Sun", "keywords": "joy, clarity, success", "short": "You are at your brightest when you are direct, warm, and willing to be seen."}, "20": {"name": "Judgement", "keywords": "awakening, calling, renewal", "short": "You are hearing something clearly about yourself — a truth, a call, a second chance."}, "21": {"name": "The World", "keywords": "completion, wholeness, arrival", "short": "You have come full circle: something long is finished, and you understand how the pieces fit."}, "22": {"name": "The Fool", "keywords": "freedom, new start, trust", "short": "You are standing at the start of something new, and the brave move is to take the first step."}};
var POSITIONS_DATA = {"A": {"label": "Day", "desc": "Your day energy: character and natural talents."}, "B": {"label": "Month", "desc": "Your month energy: emotional nature and inner world."}, "C": {"label": "Year", "desc": "Your year energy: life purpose and direction."}, "D": {"label": "Centre", "desc": "Your centre: the lesson that ties the chart together."}, "E": {"label": "Centre", "desc": "The centre, repeated at the heart of the chart — the same arcana as D."}, "F": {"label": "Heritage", "desc": "Past heritage: what you bring with you."}, "G": {"label": "Talents", "desc": "Talents: what comes naturally to you."}, "H": {"label": "Material corner", "desc": "Material side: work, money and the physical world."}, "I": {"label": "Spiritual task", "desc": "Spiritual task: the quieter work of a lifetime."}};
var ROMAN_DATA = {"1": "I", "2": "II", "3": "III", "4": "IV", "5": "V", "6": "VI", "7": "VII", "8": "VIII", "9": "IX", "10": "X", "11": "XI", "12": "XII", "13": "XIII", "14": "XIV", "15": "XV", "16": "XVI", "17": "XVII", "18": "XVIII", "19": "XIX", "20": "XX", "21": "XXI", "22": "XXII"};
/* Destiny Matrix calculation engine — same maths as the server pages.
   reduce22: digit-sum while > 22; 0 becomes 22; 22 stays 22.
   A=day, B=month, C=digit-sum(year) reduced, centre D=reduce22(A+B+C).
   Single sources of truth (C5/C6/C7): POSITIONS, ROMAN and MONTHS come
   from build.py (POSITIONS_DATA / ROMAN_DATA); "short" comes from Python
   short_meaning() — nothing is re-derived in JS. */
(function(){
"use strict";
var MAX_YEAR = 2100; var YEAR_MIN = 1900;
var ARCANA = ARCANA_DATA; // injected per page from matrix.js data file
var POSITIONS = POSITIONS_DATA;
var ROMAN = ROMAN_DATA;
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function reduce22(n){if(typeof n!=="number"||!isFinite(n)) throw new Error("reduce22: non-finite input");var v=Math.abs(Math.trunc(n));while(v>22){v=String(v).split("").reduce(function(s,d){return s+Number(d);},0);}return v===0?22:v;}
function sumDigits(n){if(typeof n!=="number"||!isFinite(n)) throw new Error("sumDigits: non-finite input");return String(Math.abs(Math.trunc(n))).split("").reduce(function(s,d){return s+Number(d);},0);}
function calcMatrix(y,m,d){
  if(![y,m,d].every(function(v){return typeof v==="number"&&isFinite(v);})) throw new Error("calcMatrix: non-finite input");
  var A=reduce22(d), B=reduce22(m), C=reduce22(sumDigits(y)), D=reduce22(A+B+C);
  return {A:A,B:B,C:C,D:D,E:D,F:reduce22(A+B),G:reduce22(B+C),H:reduce22(C+D),I:reduce22(D+A)};
}
function arcana(n){return ARCANA[n];}
function roman(n){return ROMAN[n];}
function articleFor(n){return ([8,11,18].indexOf(n)>=0)?"an":"a";}
function fmtDateLong(iso){if(!validISO(iso)) throw new Error("fmtDateLong: invalid ISO date");var p=iso.split("-");return parseInt(p[2],10)+" "+MONTHS[parseInt(p[1],10)-1]+" "+p[0];}
function parseDateInput(s){
  // S13: accept what the page's own examples say — "14 June 1995",
  // "14/06/1995" and ISO "1995-06-14" — and return ISO, or null.
  if(!s) return null; s=String(s).trim();
  if(validISO(s)) return s;
  var m=s.match(/^(\d{1,2})[\/\-. ](\d{1,2})[\/\-. ](\d{4})$/);
  if(m){var d1=+m[1],d2=+m[2]; if(d2>12&&d1<=12){var _t=d1;d1=d2;d2=_t;} /* v12 C2: MM/DD/YYYY when the second number cannot be a month; DD/MM otherwise */ var iso=m[3]+"-"+("0"+d2).slice(-2)+"-"+("0"+d1).slice(-2); return validISO(iso)?iso:null;}
  var m2=s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if(m2){var mi=MONTHS.findIndex(function(x){return x.toLowerCase()===m2[2].toLowerCase();});
    if(mi>=0){var iso2=m2[3]+"-"+("0"+(mi+1)).slice(-2)+"-"+("0"+m2[1]).slice(-2); return validISO(iso2)?iso2:null;}}
  return null;
}
function validISO(s){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  var p=s.split("-").map(Number);
  if(p[0]<YEAR_MIN||p[0]>MAX_YEAR||p[1]<1||p[1]>12||p[2]<1||p[2]>31) return false;
  var dt=new Date(Date.UTC(p[0],p[1]-1,p[2]));
  return dt.getUTCFullYear()===p[0]&&dt.getUTCMonth()===p[1]-1&&dt.getUTCDate()===p[2];
}
function el(id){return document.getElementById(id);}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function renderChart(svgId, r, selected){
  var svg=el(svgId); if(!svg) return;
  svg.classList.remove("ghost");
  // A real chart must never carry the EXAMPLE watermark (v7 self-review).
  if (svg.querySelectorAll) svg.querySelectorAll('.ghost-watermark').forEach(function(t){ t.style.display = 'none'; });
  ["A","B","C","D","E","F","G","H","I"].forEach(function(k){
    var g=svg.querySelector('[data-pos="'+k+'"]'); if(!g) return;
    var t=g.querySelector("text.num"); if(t) t.textContent=r[k];
    // Keep the screen-reader label in sync with the visible number: without
    // this, after Calculate the aria-label still described the example chart
    // (e.g. F read "arcana 20, Judgement" while the circle showed 6).
    g.setAttribute("aria-label","Position "+k+": arcana "+r[k]+", "+arcana(r[k]).name);
    g.classList.toggle("selected", k===selected);
  });
}
function renderNeutral(svgId){
  var svg=el(svgId); if(!svg) return;
  ["A","B","C","D","E","F","G","H","I"].forEach(function(k){
    var g=svg.querySelector('[data-pos="'+k+'"]'); if(!g) return;
    var t=g.querySelector("text.num"); if(t) t.textContent="?";
    g.setAttribute("aria-label","Position "+k+": not calculated yet");
    g.classList.remove("selected");
  });
}
function detailHTML(r, key){
  var a=arcana(r[key]);
  return "<h3>"+escapeHTML(key)+" — "+r[key]+" · "+escapeHTML(a.name)+"</h3><p class='muted'>"+escapeHTML(POSITIONS[key].desc)+"</p><p>"+escapeHTML(a.short)+"</p>";
}
function tableHTML(r, keys){
  var order=["A","B","C","D","F","G","H","I","E"];
  if(keys) order=order.filter(function(k){return keys.indexOf(k)>=0;});
  var list=order.map(function(k){var a=arcana(r[k]);return "<div class='pos-row"+(k==="D"?" centre":"")+"'><div class='pos-letter'>"+escapeHTML(k)+"</div><div><div class='pos-head'>"+escapeHTML(POSITIONS[k].label)+" — <span class='num'>"+escapeHTML(ROMAN[r[k]])+"</span> · "+escapeHTML(a.name)+"</div><div class='pos-kw'>"+escapeHTML(a.keywords)+"</div></div><div class='pos-head'><span class='num'>"+r[k]+"</span></div></div>";}).join("");
  return "<div class='pos-table'><div class='pos-list'>"+list+"</div></div>";
}
function stepsHTML(y,m,d,r){
  return "A = day "+d+" &rarr; "+r.A+".<br>B = month "+m+" &rarr; "+r.B+".<br>C = year "+y+": digit sum "+sumDigits(y)+" &rarr; "+r.C+".<br>"+
  "Centre D = "+r.A+" + "+r.B+" + "+r.C+" = "+(r.A+r.B+r.C)+" &rarr; "+r.D+".<br>"+
  "F = "+r.A+" + "+r.B+" = "+(r.A+r.B)+" &rarr; "+r.F+". &nbsp; G = "+r.B+" + "+r.C+" = "+(r.B+r.C)+" &rarr; "+r.G+".<br>"+
  "H = "+r.C+" + "+r.D+" = "+(r.C+r.D)+" &rarr; "+r.H+". &nbsp; I = "+r.D+" + "+r.A+" = "+(r.D+r.A)+" &rarr; "+r.I+".";
}
function shareURL(dob){var u=new URL(window.location.href);u.searchParams.set("dob",dob);return u.toString();}
function pngError(msg){var e=el("png-error");if(e){e.textContent=msg;e.hidden=false;}}
function chartCanvas(svgId, onOk, onErr){
  var svg=el(svgId); if(!svg){onErr();return;}
  var clone=svg.cloneNode(true);
  clone.setAttribute("width","800"); clone.setAttribute("height","800");
  var st=document.createElementNS("http://www.w3.org/2000/svg","style");
  st.textContent=".pos-btn circle{fill:#f8f2e2;stroke:#8f7422;stroke-width:1.5}"+
    ".pos-btn.selected circle{fill:#a04d28}"+
    ".pos-btn text{fill:#2a2115;font-family:system-ui,sans-serif;font-weight:650}"+
    ".pos-btn.selected text.num{fill:#f8f2e2}"+
    ".pos-label{fill:#6e6046;font-size:13px;font-weight:600;font-family:system-ui,sans-serif;stroke:#efe6d2;stroke-width:3px;paint-order:stroke}";
  clone.insertBefore(st, clone.firstChild);
  var xml=new XMLSerializer().serializeToString(clone);
  var img=new Image();
  img.onload=function(){
    try{
      var c=document.createElement("canvas");c.width=800;c.height=800;
      var ctx=c.getContext("2d");ctx.fillStyle="#efe6d2";ctx.fillRect(0,0,800,800);ctx.drawImage(img,0,0,800,800);
      onOk(c);
    }catch(err){onErr();}
  };
  img.onerror=function(){onErr();};
  img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(xml);
}
function downloadPNG(svgId, filename){
  chartCanvas(svgId, function(c){
    try{
      var a=document.createElement("a");a.download=filename;a.href=c.toDataURL("image/png");
      document.body.appendChild(a);a.click();a.remove();
    }catch(err){pngError("Download failed — please try again.");}
  }, function(){pngError("Download failed — please try again.");});
}
function renderSharePreview(svgId, imgId){
  var img=el(imgId); if(!img) return;
  chartCanvas(svgId, function(c){
    try{img.src=c.toDataURL("image/png");img.hidden=false;}
    catch(err){pngError("Chart preview could not be made — the link still works.");}
  }, function(){pngError("Chart preview could not be made — the link still works.");});
}
function initNav(){
  var btn=el("nav-toggle"); var links=el("nav-links");
  if(!btn||!links) return;
  btn.addEventListener("click", function(){
    var open=links.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open?"true":"false");
  });
}
initNav();
window.DestinyMatrix={maxYear:MAX_YEAR,reduce22:reduce22,sumDigits:sumDigits,calcMatrix:calcMatrix,arcana:arcana,roman:roman,parseDateInput:parseDateInput,
  articleFor:articleFor,fmtDateLong:fmtDateLong,validISO:validISO,renderChart:renderChart,renderNeutral:renderNeutral,
  detailHTML:detailHTML,tableHTML:tableHTML,escapeHTML:escapeHTML,stepsHTML:stepsHTML,
  shareURL:shareURL,downloadPNG:downloadPNG,renderSharePreview:renderSharePreview};
})();
