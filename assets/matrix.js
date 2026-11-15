var ARCANA_DATA = {"1": {"name": "The Magician", "keywords": "will, skill, beginning", "short": "The Magician is the energy of starting something with your own hands. People with this arcana in a strong position tend to be quick to act, good with words and tools, and impatient with long meetings about things they could simply try."}, "2": {"name": "The High Priestess", "keywords": "intuition, patience, inner knowledge", "short": "The High Priestess stands for the knowledge that arrives quietly. This is not the loud confidence of the Magician, but the slower kind: noticing what is not being said, remembering what others forget, and waiting until the right moment to speak."}, "3": {"name": "The Empress", "keywords": "growth, care, abundance", "short": "The Empress is the energy of growth, care, and making things flourish. She is the gardener, the host, the parent, the friend who feeds people properly and remembers what they like."}, "4": {"name": "The Emperor", "keywords": "structure, order, authority", "short": "The Emperor is the energy of structure, order, and taking responsibility. Where this arcana sits, life asks for clear rules, honest limits, and a plan that actually holds."}, "5": {"name": "The Hierophant", "keywords": "tradition, learning, guidance", "short": "The Hierophant stands for tradition, teaching, and the knowledge passed down through families, schools, faiths, and crafts. This arcana values doing things properly: learning from a teacher, respecting the method, and understanding why a rule exists before breaking it."}, "6": {"name": "The Lovers", "keywords": "choice, love, values", "short": "The Lovers is the energy of choice, love, and living by your values. Despite the name, it is not only about romance."}, "7": {"name": "The Chariot", "keywords": "drive, focus, victory", "short": "The Chariot is the energy of drive, focus, and moving forward. It is the arcana of the person who sets a goal, gathers their energy, and keeps going when the road gets rough."}, "8": {"name": "Justice", "keywords": "balance, truth, fairness", "short": "Justice is the energy of balance, truth, and fairness. It is the arcana of weighing things honestly, seeing both sides, and living with the consequences of your choices."}, "9": {"name": "The Hermit", "keywords": "solitude, wisdom, search", "short": "The Hermit is the energy of solitude, wisdom, and the honest search for meaning. This is the arcana of the person who steps back from noise, thinks deeply, and returns with something worth saying."}, "10": {"name": "Wheel of Fortune", "keywords": "change, cycles, luck", "short": "The Wheel of Fortune is the energy of change, cycles, and timing. It reminds us that life moves in turns: good periods follow hard ones, and hard ones follow good ones, often without warning."}, "11": {"name": "Strength", "keywords": "courage, patience, inner power", "short": "Strength is the energy of courage, patience, and quiet inner power. It is not the loud strength of force, but the steady strength of the person who stays calm, keeps going, and tames their own fears instead of fighting everyone else."}, "12": {"name": "The Hanged Man", "keywords": "pause, new view, surrender", "short": "The Hanged Man is the energy of pause, a new point of view, and letting go of control. It appears when pushing harder will not help, and the only useful move is to stop, look at the situation upside down, and wait."}, "13": {"name": "Death", "keywords": "ending, change, rebirth", "short": "Death is the energy of ending, change, and rebirth. It is one of the most misunderstood arcana, because it rarely means a physical death."}, "14": {"name": "Temperance", "keywords": "balance, patience, blending", "short": "Temperance is the energy of balance, patience, and blending opposites into something that works. It is the arcana of the middle path: not too much and not too little, not rushing and not stalling, mixing work and rest, giving and receiving, until life feels steady."}, "15": {"name": "The Devil", "keywords": "desire, attachment, shadow", "short": "The Devil is the energy of desire, attachment, and the shadow side of human nature. It points to the things that hold us: money, status, pleasure, control, a habit, a person, a fear."}, "16": {"name": "The Tower", "keywords": "sudden change, truth, rebuilding", "short": "The Tower is the energy of sudden change, hard truth, and rebuilding. It is the arcana of the moment when something false collapses: a plan that was never going to work, a relationship built on pretence, a belief that could not hold."}, "17": {"name": "The Star", "keywords": "hope, healing, guidance", "short": "The Star is the energy of hope, healing, and quiet guidance. It often follows a hard period, like the calm after a storm, when you can finally see clearly and believe that things can get better."}, "18": {"name": "The Moon", "keywords": "dreams, fear, illusion", "short": "The Moon is the energy of dreams, fear, and illusion. It is the arcana of the night: things are not what they seem, feelings run deep, and the imagination can be a gift or a trap."}, "19": {"name": "The Sun", "keywords": "joy, clarity, success", "short": "The Sun is the energy of joy, clarity, and success. It is the brightest arcana, and where it sits in a chart, life tends to go well: things become clear, work bears fruit, and people enjoy being around you."}, "20": {"name": "Judgement", "keywords": "awakening, calling, renewal", "short": "Judgement is the energy of awakening, calling, and renewal. It is the arcana of the moment when you hear something clearly — a truth about yourself, a call to change, a chance to start again — and you cannot pretend you did not hear it."}, "21": {"name": "The World", "keywords": "completion, wholeness, arrival", "short": "The World is the energy of completion, wholeness, and arrival. It is the last numbered arcana before the Fool, and it marks the end of a long journey: the degree finished, the business built, the healing done, the circle closed."}, "22": {"name": "The Fool", "keywords": "freedom, new start, trust", "short": "The Fool is the energy of freedom, a new start, and trust. It is numbered 22 in this system, the last arcana and also the beginning of a new cycle."}};
/* Destiny Matrix calculation engine — same maths as the server pages.
   reduce22: digit-sum while > 22; 0 becomes 22; 22 stays 22.
   A=day, B=month, C=digit-sum(year) reduced, centre D=reduce22(A+B+C). */
(function(){
"use strict";
var ARCANA = ARCANA_DATA; // injected per page from matrix.js data file
function reduce22(n){var v=Math.abs(Math.trunc(n));while(v>22){v=String(v).split("").reduce(function(s,d){return s+Number(d);},0);}return v===0?22:v;}
function sumDigits(n){return String(Math.abs(Math.trunc(n))).split("").reduce(function(s,d){return s+Number(d);},0);}
function calcMatrix(y,m,d){
  var A=reduce22(d), B=reduce22(m), C=reduce22(sumDigits(y)), D=reduce22(A+B+C);
  return {A:A,B:B,C:C,D:D,E:D,F:reduce22(A+B),G:reduce22(B+C),H:reduce22(C+D),I:reduce22(D+A)};
}
function arcana(n){return ARCANA[n];}
function el(id){return document.getElementById(id);}
function renderChart(svgId, r, selected){
  var svg=el(svgId); if(!svg) return;
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
function detailHTML(r, key){
  var pos={A:"Day — character and natural talents",B:"Month — emotional nature and inner world",
    C:"Year — life purpose and direction",D:"Centre — the lesson that ties the chart together",
    E:"Centre point — same arcana as D, the centre value",F:"Top left — past heritage",
    G:"Top right — talents",H:"Bottom right — material side: work and money",
    I:"Bottom left — spiritual task"}[key];
  var a=arcana(r[key]);
  return "<h3>"+key+" — "+r[key]+" · "+a.name+"</h3><p class='muted'>"+pos+"</p><p>"+a.short+"</p>";
}
function tableHTML(r){
  var order=["A","B","C","D","F","G","H","I","E"];
  var label={A:"A — Day",B:"B — Month",C:"C — Year",D:"D — Centre",E:"E — Centre (same as D)",F:"F — Top left",G:"G — Top right",H:"H — Bottom right",I:"I — Bottom left"};
  var rows=order.map(function(k){var a=arcana(r[k]);return "<tr><td><strong>"+label[k]+"</strong></td><td>"+r[k]+"</td><td>"+a.name+"</td><td>"+a.keywords+"</td></tr>";}).join("");
  return "<table><thead><tr><th>Position</th><th>Arcana</th><th>Name</th><th>Keywords</th></tr></thead><tbody>"+rows+"</tbody></table>";
}
function stepsHTML(y,m,d,r){
  return "A = day "+d+" &rarr; "+r.A+".<br>B = month "+m+" &rarr; "+r.B+".<br>C = year "+y+": digit sum "+sumDigits(y)+" &rarr; "+r.C+".<br>"+
  "Centre D = "+r.A+" + "+r.B+" + "+r.C+" = "+(r.A+r.B+r.C)+" &rarr; "+r.D+".<br>"+
  "F = "+r.A+" + "+r.B+" = "+(r.A+r.B)+" &rarr; "+r.F+". &nbsp; G = "+r.B+" + "+r.C+" = "+(r.B+r.C)+" &rarr; "+r.G+".<br>"+
  "H = "+r.C+" + "+r.D+" = "+(r.C+r.D)+" &rarr; "+r.H+". &nbsp; I = "+r.D+" + "+r.A+" = "+(r.D+r.A)+" &rarr; "+r.I+".";
}
function shareURL(dob){var u=new URL(window.location.href);u.searchParams.set("dob",dob);return u.toString();}
function downloadPNG(svgId, filename){
  var svg=el(svgId); if(!svg) return;
  // Inline the chart styles: a serialised SVG carries no page CSS, so without
  // this the PNG renders dark-on-dark (the old bug). Clone, don't mutate the page.
  var clone=svg.cloneNode(true);
  clone.setAttribute("width","800"); clone.setAttribute("height","800");
  var st=document.createElementNS("http://www.w3.org/2000/svg","style");
  st.textContent=".pos-btn circle{fill:#1a212b;stroke:#d9a441;stroke-width:1.5}"+
    ".pos-btn.selected circle{fill:#d9a441}"+
    ".pos-btn text{fill:#f2efe8;font-family:Montserrat,system-ui,sans-serif;font-weight:700}"+
    ".pos-btn.selected text{fill:#171207}"+
    ".pos-label{fill:#a8b0bc;font-size:10px;font-family:Montserrat,system-ui,sans-serif}";
  clone.insertBefore(st, clone.firstChild);
  var xml=new XMLSerializer().serializeToString(clone);
  var img=new Image();
  img.onload=function(){
    var c=document.createElement("canvas");c.width=800;c.height=800;
    var ctx=c.getContext("2d");ctx.fillStyle="#0b0d10";ctx.fillRect(0,0,800,800);ctx.drawImage(img,0,0,800,800);
    var a=document.createElement("a");a.download=filename;a.href=c.toDataURL("image/png");a.click();
  };
  img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(xml);
}
window.DestinyMatrix={reduce22:reduce22,sumDigits:sumDigits,calcMatrix:calcMatrix,arcana:arcana,
  renderChart:renderChart,detailHTML:detailHTML,tableHTML:tableHTML,stepsHTML:stepsHTML,
  shareURL:shareURL,downloadPNG:downloadPNG};
})();
