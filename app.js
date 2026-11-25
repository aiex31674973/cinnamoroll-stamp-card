import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,onSnapshot,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {firebaseConfig,adminUid} from './config.js';
const $=id=>document.getElementById(id); const status=s=>$('status').textContent=s;
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let state={days:[]}, ready=false, admin=false,busy=false;
const positions=[16.8,33.3,49.9,66.4,82.9];
let previous=0;
function render(){document.querySelectorAll('.stamp').forEach(x=>x.remove());state.days.forEach((d,i)=>{const im=document.createElement('img');im.src='stamp.png';im.alt=`第 ${i+1} 點`;im.className='stamp'+(i>=previous?' new':'');im.style.left=positions[i%5]+'%';im.style.top=(i<5?39.8:64.7)+'%';$('card').append(im)});if(ready){if(state.days.length===10&&previous<10)burst(innerWidth/2,innerHeight/2,40);previous=state.days.length;const h=$('history');h.replaceChildren();state.days.forEach((d,i)=>{const el=document.createElement('span');el.textContent=`第 ${i+1} 點 · ${d}`;h.append(el)});if(!state.days.length)h.textContent='還沒有集點紀錄，期待第一個印章！';}$('count').textContent=ready?`${state.days.length} / 10 點`:'讀取中…';$('progress').style.width=state.days.length*10+'%';$('celebrate').hidden=state.days.length!==10;$('controls').hidden=!admin;$('login').hidden=admin;$('add').disabled=!ready||busy||state.days.length>=10;$('undo').disabled=!ready||busy||!state.days.length;$('reset').disabled=!ready||busy||!state.days.length;}
if(firebaseConfig.apiKey==='REPLACE_ME'){status('尚未設定 Firebase，請依 README 操作。');$('form').hidden=true;}else{
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),ref=doc(db,'cards','main');
onSnapshot(ref,s=>{state=s.exists()?s.data():{days:[]};ready=true;render();status('');},e=>{ready=false;render();status('無法讀取集點卡：'+e.message)});
onAuthStateChanged(auth,async u=>{admin=false;if(u){try{const token=await u.getIdTokenResult();admin=u.uid===adminUid;}catch{} }render();});
$('form').onsubmit=async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,$('email').value,$('password').value);$('password').value='';status('已登入');}catch(e){status('登入失敗，請確認帳號密碼。')}};
$('logout').onclick=()=>signOut(auth);
async function change(kind){if(!admin||busy)return;busy=true;render();try{await runTransaction(db,async tx=>{const snap=await tx.get(ref);let days=snap.exists()?[...snap.data().days]:[];if(kind==='add'){if(days.length>=10)throw Error('已集滿十點');days.push(day());}else if(kind==='undo')days.pop();else days=[];tx.set(ref,{days,updatedAt:serverTimestamp()});});status('已更新');}catch(e){status('更新失敗：'+e.message)}finally{busy=false;render();}}
$('add').onclick=()=>change('add');$('undo').onclick=()=>{if(confirm('取消最後一點？'))change('undo')};$('reset').onclick=()=>{if(confirm('確定清除所有點數？'))change('reset')};
}render();

function burst(x,y,n=14){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<n;i++){const el=document.createElement('span');el.className='spark';el.textContent=['💛','⭐','✨','🩵'][i%4];el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--dx',(Math.random()-.5)*300+'px');el.style.setProperty('--dy',(-30-Math.random()*180)+'px');document.body.append(el);setTimeout(()=>el.remove(),1100)}}

const wishes = {
    N: [
        '今天的你也很棒！',
        '把小小的快樂都收集起來吧！',
        '記得休息一下，喝口水喔！',
        '願你今天遇見好多好事！',
        '送你一朵軟綿綿的雲！'
    ],
    R: [
        '今天也有偷偷想你喔！',
        '辛苦了，給你一個大大的抱抱！',
        '希望你每天都有值得微笑的理由！'
    ],
    SR: [
        '今天的好運用完了也沒關係，我分你一點！',
        '你是今天最值得珍藏的小幸福！'
    ],
    SSR: [
        '恭喜你抽到了我偷偷藏起來的想念！',
        '全世界有這麼多人，但我最喜歡你！'
    ]
};

$('fortune').onclick = e => {
    const r = Math.random();
    let rarity;

    if (r < 0.70) {
        rarity = 'N';
    } else if (r < 0.95) {
        rarity = 'R';
    } else if (r < 0.99) {
        rarity = 'SR';
    } else {
        rarity = 'SSR';
    }

    const styles = {
        N:   { label: '☁️ N 普通', color: '#729bc2' },
        R:   { label: '💗 R 暖心', color: '#d66b9a' },
        SR:  { label: '💎 SR 稀有', color: '#9562cc' },
        SSR: { label: '👑 SSR 隱藏版', color: '#d49b00' }
    };

    const pool = wishes[rarity];
    const message = pool[Math.floor(Math.random() * pool.length)];
    const wish = $('wish');

    wish.replaceChildren();

    const label = document.createElement('strong');
    label.textContent = styles[rarity].label;
    label.style.color = styles[rarity].color;
    label.style.display = 'block';
    label.style.fontSize = '1.5em';
    label.style.marginBottom = '10px';

    const content = document.createElement('span');
    content.textContent = message;

    wish.append(label, content);

    wish.animate([
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1.08)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
    ], { duration: 500 });

    const particles = {
        N: 8,
        R: 18,
        SR: 35,
        SSR: 80
    };

    burst(
        e.clientX || innerWidth / 2,
        e.clientY || innerHeight / 2,
        particles[rarity]
    );
};


const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',hourCycle:'h23'}).format(new Date()));$('greeting').textContent=(hour<12?'早安':hour<18?'午安':'晚安')+'！歡迎來到你的小小幸福基地 ♡';
