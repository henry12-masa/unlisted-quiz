const QUESTION_COUNT = 50;
let currentQuestions = [], currentIndex = 0, score = 0, locked = false;
const $ = id => document.getElementById(id);
const startScreen=$('startScreen'), quizScreen=$('quizScreen'), finishScreen=$('finishScreen');
const categoryButtons=$('categoryButtons'), groupButtons=$('groupButtons'), startAllBtn=$('startAllBtn'), restartBtn=$('restartBtn');
const questionText=$('questionText'), choicesBox=$('choices'), resultBox=$('resultBox');
const progressLabel=$('progressLabel'), categoryLabel=$('categoryLabel'), progressBar=$('progressBar');
const scoreText=$('scoreText'), commentText=$('commentText');
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeButton(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;return b;}
function buildCategories(filterGroup='all'){
  categoryButtons.innerHTML=''; groupButtons.innerHTML='';
  const groups=[...new Set(quizData.map(q=>q.group))];
  groupButtons.appendChild(makeButton('すべて表示',()=>buildCategories('all')));
  groups.forEach(g=>groupButtons.appendChild(makeButton(g,()=>buildCategories(g))));
  const cats=[...new Set(quizData.filter(q=>filterGroup==='all'||q.group===filterGroup).map(q=>q.category))];
  cats.forEach(c=>{const n=quizData.filter(q=>q.category===c).length;categoryButtons.appendChild(makeButton(`${c}（${n}問）`,()=>startQuiz(c)));});
}
function startQuiz(category='all'){const src=category==='all'?quizData:quizData.filter(q=>q.category===category);currentQuestions=shuffle(src).slice(0,Math.min(QUESTION_COUNT,src.length));currentIndex=0;score=0;startScreen.classList.add('hidden');finishScreen.classList.add('hidden');quizScreen.classList.remove('hidden');showQuestion();}
function showQuestion(){locked=false;resultBox.classList.add('hidden');resultBox.innerHTML='';choicesBox.innerHTML='';const q=currentQuestions[currentIndex];questionText.textContent=q.question;categoryLabel.textContent=`${q.group}｜${q.category}`;progressLabel.textContent=`${currentIndex+1} / ${currentQuestions.length}`;progressBar.style.width=`${(currentIndex/currentQuestions.length)*100}%`;shuffle(q.choices.map((text,idx)=>({text,idx}))).forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o.text;b.onclick=()=>answerQuestion(o.idx,b);choicesBox.appendChild(b);});}
function answerQuestion(originalIndex,btn){if(locked)return;locked=true;const q=currentQuestions[currentIndex];document.querySelectorAll('.choice').forEach(b=>{b.disabled=true;if(b.textContent===q.choices[q.answer])b.classList.add('correct');});if(originalIndex===q.answer){score++;resultBox.innerHTML=`<strong>正解！</strong><br>${q.explanation}`;}else{btn.classList.add('wrong');resultBox.innerHTML=`<strong>不正解</strong><br>正解：${q.choices[q.answer]}<br>${q.explanation}`;}resultBox.classList.remove('hidden');progressBar.style.width=`${((currentIndex+1)/currentQuestions.length)*100}%`;setTimeout(()=>{currentIndex++;currentIndex>=currentQuestions.length?finishQuiz():showQuestion();},1000);}
function finishQuiz(){quizScreen.classList.add('hidden');finishScreen.classList.remove('hidden');const rate=Math.round(score/currentQuestions.length*100);scoreText.textContent=`${score} / ${currentQuestions.length}問正解（${rate}%）`;commentText.textContent=rate>=80?'かなり良い仕上がりです。':rate>=60?'合格圏まであと少しです。間違えた分野を復習しましょう。':'まずは基礎用語を繰り返し確認しましょう。';}
startAllBtn.onclick=()=>startQuiz('all');restartBtn.onclick=()=>{finishScreen.classList.add('hidden');quizScreen.classList.add('hidden');startScreen.classList.remove('hidden');};
buildCategories();
