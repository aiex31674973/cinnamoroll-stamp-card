import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,onSnapshot,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {firebaseConfig,adminUid} from './config.js';
const $=id=>document.getElementById(id); const status=s=>$('status').textContent=s;
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let state={days:[]}, ready=false, admin=false,busy=false;
const positions=[16.8,33.3,49.9,66.4,82.9];
function render(){document.querySelectorAll('.stamp').forEach(x=>x.remove());state.days.forEach((d,i)=>{const im=document.createElement('img');im.src='stamp.png';im.alt=`第 ${i+1} 點`;im.className='stamp';im.style.left=positions[i%5]+'%';im.style.top=(i<5?39.8:64.7)+'%';$('card').append(im)});$('count').textContent=ready?`${state.days.length} / 10 點`:'讀取中…';$('progress').style.width=state.days.length*10+'%';$('celebrate').hidden=state.days.length!==10;$('controls').hidden=!admin;$('login').hidden=admin;$('add').disabled=!ready||busy||state.days.length>=10||state.days.includes(day());$('undo').disabled=!ready||busy||!state.days.length;$('reset').disabled=!ready||busy||!state.days.length;}
if(firebaseConfig.apiKey==='REPLACE_ME'){status('尚未設定 Firebase，請依 README 操作。');$('form').hidden=true;}else{
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),ref=doc(db,'cards','main');
onSnapshot(ref,s=>{state=s.exists()?s.data():{days:[]};ready=true;render();status('');},e=>{ready=false;render();status('無法讀取集點卡：'+e.message)});
onAuthStateChanged(auth,async u=>{admin=false;if(u){try{const token=await u.getIdTokenResult();admin=u.uid===adminUid;}catch{} }render();});
$('form').onsubmit=async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,$('email').value,$('password').value);$('password').value='';status('已登入');}catch(e){status('登入失敗，請確認帳號密碼。')}};
$('logout').onclick=()=>signOut(auth);
async function change(kind){if(!admin||busy)return;busy=true;render();try{await runTransaction(db,async tx=>{const snap=await tx.get(ref);let days=snap.exists()?[...snap.data().days]:[];if(kind==='add'){if(days.length>=10||days.includes(day()))throw Error('今天已蓋章或已集滿');days.push(day());}else if(kind==='undo')days.pop();else days=[];tx.set(ref,{days,updatedAt:serverTimestamp()});});status('已更新');}catch(e){status('更新失敗：'+e.message)}finally{busy=false;render();}}
$('add').onclick=()=>change('add');$('undo').onclick=()=>{if(confirm('取消最後一點？'))change('undo')};$('reset').onclick=()=>{if(confirm('確定清除所有點數？'))change('reset')};setInterval(render,30000);
}render();
