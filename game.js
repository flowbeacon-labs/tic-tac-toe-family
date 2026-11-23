(()=>{'use strict';
const $=id=>document.getElementById(id);
const SAVE_KEY='flowbeacon-family-tic-tac-toe-v1';
const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const cells=[...document.querySelectorAll('.cell')];
const defaults=()=>({names:['Player 1','Player 2'],vsAI:false,difficulty:'easy',format:'5',target:5,autoSwap:true,symbols:['X','O'],board:Array(9).fill(''),turn:0,scores:[0,0],draws:0,round:1,history:[],ended:false,seriesWinner:null,winLine:null,result:null});
let state=defaults(),hasSave=false,aiTimer=null;
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));hasSave=true;}catch{}}
function restore(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(!s||!Array.isArray(s.board)||s.board.length!==9||!Array.isArray(s.names)||s.names.length!==2||!Array.isArray(s.scores)||s.scores.length!==2)return false;state={...defaults(),...s};state.target=Number(state.target)||5;state.names=state.names.map(n=>String(n).slice(0,22));return true;}catch{return false;}}
function name(i){return state.names[i]||('Player '+(i+1));}
function symbol(i){return state.symbols[i];}
function playerFor(mark){return state.symbols.indexOf(mark);}
function isUnlimited(){return state.format==='unlimited';}
function winsNeeded(){return Math.floor(state.target/2)+1;}
function resultFor(board){for(const line of WIN_LINES){const m=board[line[0]];if(m&&line.every(i=>board[i]===m))return{mark:m,line};}return board.every(Boolean)?{mark:null,line:null}:null;}
function finished(){return state.result!==null;}
function clearAI(){if(aiTimer!==null){clearTimeout(aiTimer);aiTimer=null;}}
function showModal(){clearAI();populateSetup();$('setup-modal').classList.remove('hidden');$('p1-name').focus();}
function hideModal(){$('setup-modal').classList.add('hidden');}
function populateSetup(){$('p1-name').value=state.names[0];$('p2-name').value=state.names[1]==='Computer'?'Player 2':state.names[1];$('vs-computer').checked=state.vsAI;$('difficulty').value=state.difficulty;$('format').value=state.format;$('custom-count').value=state.format==='custom'?state.target:11;$('setup-auto-swap').checked=state.autoSwap;updateConditional();$('resume-button').classList.toggle('hidden',!hasSave);$('restore-note').classList.toggle('show',hasSave);}
function updateConditional(){const computer=$('vs-computer').checked;$('p2-field').classList.toggle('hidden',computer);$('difficulty-field').classList.toggle('hidden',!computer);$('custom-field').classList.toggle('hidden',$('format').value!=='custom');}
$('vs-computer').addEventListener('change',updateConditional);$('format').addEventListener('change',updateConditional);
$('settings-button').addEventListener('click',showModal);
$('resume-button').addEventListener('click',()=>{hideModal();render();scheduleAI();});
$('setup-form').addEventListener('submit',e=>{e.preventDefault();const p1=$('p1-name').value.trim().slice(0,22),vsAI=$('vs-computer').checked,p2=vsAI?'Computer':$('p2-name').value.trim().slice(0,22);if(!p1||!p2){alert('Enter both player names.');return;}const format=$('format').value;let target=format==='unlimited'?0:format==='custom'?Number($('custom-count').value):Number(format);if(format==='custom'&&(!Number.isInteger(target)||target<1||target>99||target%2!==1)){alert('Best of N needs an odd whole number from 1 to 99.');return;}if(hasSave&&(state.history.length||state.board.some(Boolean))&&!confirm('Start a new match? This replaces the current match and its scores on this device.'))return;clearAI();state={...defaults(),names:[p1,p2],vsAI,difficulty:$('difficulty').value,format,target,autoSwap:$('setup-auto-swap').checked};save();hideModal();render();});
function applyMove(idx){if(state.ended||finished()||state.board[idx]||state.vsAI&&state.turn===1)return;playMove(idx);}
function playMove(idx){if(state.ended||finished()||state.board[idx])return;state.board[idx]=symbol(state.turn);const win=resultFor(state.board);if(win){state.result={winner:win.mark?playerFor(win.mark):null,line:win.line};state.winLine=win.line;if(win.mark){const winner=playerFor(win.mark);state.scores[winner]++;state.history.unshift({round:state.round,winner,label:`${name(winner)} won as ${win.mark}`});if(!isUnlimited()&&state.scores[winner]>=winsNeeded()){state.ended=true;state.seriesWinner=winner;celebrate();}else{celebrate(18);}}else{state.draws++;state.history.unshift({round:state.round,winner:null,label:'It was a draw'});}
 }else{state.turn=1-state.turn;}
 save();render();scheduleAI();}
function nextRound(){if(!finished()||state.ended)return;clearAI();state.round++;state.board=Array(9).fill('');state.result=null;state.winLine=null;if(state.autoSwap)state.symbols.reverse();state.turn=playerFor('X');save();render();scheduleAI();}
function swapNow(){if(state.board.some(Boolean)||state.ended){return;}clearAI();state.symbols.reverse();state.turn=playerFor('X');save();render();scheduleAI();}
$('next-round').addEventListener('click',nextRound);
$('swap-now').addEventListener('click',swapNow);
$('auto-swap').addEventListener('change',e=>{state.autoSwap=e.target.checked;save();render();});
$('reset-round').addEventListener('click',()=>{if(state.ended)return;if(state.board.some(Boolean)&&!finished()&&!confirm('Replay this round? Moves in progress will be cleared.'))return;if(finished()){alert('This round already counted. Select Next round or start a new match to reset scores.');return;}clearAI();state.board=Array(9).fill('');state.turn=playerFor('X');save();render();scheduleAI();});
$('reset-scores').addEventListener('click',()=>{if(!confirm('Reset all scores, draws and round history for these players?'))return;clearAI();state={...defaults(),names:[...state.names],vsAI:state.vsAI,difficulty:state.difficulty,format:state.format,target:state.target,autoSwap:state.autoSwap,symbols:[...state.symbols]};state.turn=playerFor('X');save();render();scheduleAI();});
for(const cell of cells){cell.addEventListener('click',()=>applyMove(Number(cell.dataset.cell)));}
function render(){const active=state.ended?-1:state.turn;for(let i=0;i<2;i++){$('player-name-'+i).textContent=name(i);$('player-score-'+i).textContent=state.scores[i];$('player-mark-'+i).textContent=symbol(i);$('player-mark-'+i).classList.toggle('o',symbol(i)==='O');$('player-card-'+i).classList.toggle('active',!finished()&&i===active);$('player-card-'+i).classList.toggle('winner',state.seriesWinner===i);}
 $('round-label').textContent=`Round ${state.round}`;$('draw-count').textContent=state.draws;
 cells.forEach((cell,i)=>{const mark=state.board[i];cell.textContent=mark;cell.dataset.mark=mark;cell.disabled=Boolean(mark)||Boolean(state.result)||state.ended||(state.vsAI&&state.turn===1);cell.classList.toggle('win',Boolean(state.winLine?.includes(i)));cell.setAttribute('aria-label',`${['Top left','Top middle','Top right','Middle left','Center','Middle right','Bottom left','Bottom middle','Bottom right'][i]}: ${mark||'empty'}`);});
 if(state.ended){$('status').textContent=`🏆 ${name(state.seriesWinner)} wins the series!`;}else if(state.result){$('status').textContent=state.result.winner===null?'🤝 It’s a draw!':`🎉 ${name(state.result.winner)} wins this round!`;}else{$('status').textContent=`${name(state.turn)}'s turn — place ${symbol(state.turn)}!`;}
 $('next-round').disabled=!finished()||state.ended;$('next-round').textContent=state.ended?'Series finished 🏆':'Next round ➜';$('swap-now').disabled=state.board.some(Boolean)||state.ended;$('reset-round').disabled=Boolean(state.ended);
 $('auto-swap').checked=state.autoSwap;$('swap-hint').textContent=state.autoSwap?'X and O swap automatically after every finished round.':'You can swap symbols before a round begins.';
 $('series-name').textContent=isUnlimited()?'Unlimited games':`Best of ${state.target}`;
 $('series-progress').textContent=isUnlimited()?'Play as many rounds as you like':`First to ${winsNeeded()} wins the series${state.ended?' · Complete!':''}`;
 $('played-count').textContent=state.history.length;$('decisive-count').textContent=state.scores[0]+state.scores[1];
 const total=isUnlimited()?Math.max(5,state.scores[0]+state.scores[1]):winsNeeded();$('meter-0').style.width=(100*state.scores[0]/total)+'%';$('meter-1').style.width=(100*state.scores[1]/total)+'%';
 const history=$('history');history.replaceChildren();if(!state.history.length){const li=document.createElement('li');li.className='empty';li.textContent='Your adventures will show up here.';history.append(li);}else{for(const h of state.history.slice(0,40)){const li=document.createElement('li');li.textContent=`Round ${h.round}: ${h.label}`;history.append(li);}}
 const finale=$('final-message');finale.classList.toggle('hidden',!state.ended);finale.textContent=state.ended?`${name(state.seriesWinner)} is the champion! 🥇 Start a new match for a rematch.`:'';}
function celebrate(n=55){const holder=$('confetti');holder.replaceChildren();const colors=['#f17f9c','#6fa9f7','#f7c04c','#9a78e5','#6bd0af'];for(let i=0;i<n;i++){const bit=document.createElement('i');bit.className='confetti-bit';bit.style.setProperty('--left',Math.random()*100+'%');bit.style.setProperty('--drift',(Math.random()-.5)*280+'px');bit.style.setProperty('--angle',Math.floor(Math.random()*360)+'deg');bit.style.setProperty('--fall-time',(1.5+Math.random()*1.7)+'s');bit.style.setProperty('--color',colors[i%colors.length]);holder.append(bit);}setTimeout(()=>{if(holder.children.length===n)holder.replaceChildren();},3600);}
function legalMoves(board){return board.map((x,i)=>x=== ''?i:-1).filter(i=>i!==-1);}
function chooseAI(){const b=state.board,ai=symbol(1),human=symbol(0),legal=legalMoves(b);if(!legal.length)return -1;
 if(state.difficulty==='easy'){// Child-friendly: sometimes blocks, often experiments.
 if(Math.random()<.23){const win=immediate(b,ai);if(win!==-1)return win;}return legal[Math.floor(Math.random()*legal.length)];}
 const win=immediate(b,ai);if(win!==-1)return win;const block=immediate(b,human);if(block!==-1)return block;
 if(state.difficulty==='medium'){if(Math.random()<.35)return legal[Math.floor(Math.random()*legal.length)];return legal.includes(4)?4:legal[Math.floor(Math.random()*legal.length)];}
 let best=-Infinity,move=legal[0];for(const i of legal){b[i]=ai;const score=minimax(b,false,ai,human,0);b[i]='';if(score>best){best=score;move=i;}}return move;}
function immediate(b,mark){for(const i of legalMoves(b)){b[i]=mark;const result=resultFor(b);b[i]='';if(result?.mark===mark)return i;}return -1;}
function minimax(b,maximizing,ai,human,depth){const result=resultFor(b);if(result)return result.mark===ai?10-depth:result.mark===human?depth-10:0;let best=maximizing?-Infinity:Infinity;for(const i of legalMoves(b)){b[i]=maximizing?ai:human;const v=minimax(b,!maximizing,ai,human,depth+1);b[i]='';best=maximizing?Math.max(best,v):Math.min(best,v);}return best;}
function scheduleAI(){clearAI();if(state.vsAI&&state.turn===1&&!finished()&&!state.ended&&$('setup-modal').classList.contains('hidden')){aiTimer=setTimeout(()=>{aiTimer=null;if(!state.vsAI||state.turn!==1||finished()||state.ended)return;const move=chooseAI();if(move!==-1)playMove(move);},420);}}
hasSave=restore();if(!hasSave){state=defaults();}render();populateSetup();$('setup-modal').classList.remove('hidden');
})();