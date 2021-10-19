const intro = document.querySelector('.intro');
const showForm = document.querySelector('.main-page__button');

const nextBtn = document.querySelector('.radio-form__submit--1');
const resultBtn = document.querySelector('.radio-form__submit--2');
const firstQuestion = document.querySelector('.question-1');
const secondQuestion = document.querySelector('.question-2');

const resultBlock = document.querySelector('.result');
const QRBlock = document.querySelector('.send-block');
const imageButton = document.querySelector('.result__button');
const result = document.querySelector('.result__result');
const loadingBlock = document.querySelector('.loading');
const randomize = document.querySelector('.randomize');

const finalBlock = document.querySelector('.final'); 
const showFinalBlockBtn = document.querySelector('.send-block--finish'); 


function switchToForm(evt) {
    evt.preventDefault()
    intro.classList.add('intro--is-hidden');
    document.body.style.backgroundColor = "#ffffff";
}

function switchToNextQuestion() {
    firstQuestion.classList.add('hidden');
    secondQuestion.classList.remove('hidden');
}

function fetchNicknamesPage(offset) {
    return fetch(`https://api.airtable.com/v0/appcM5XpJx4Ghrw0r/tblVm2XRmKONfU09o?api_key=keyIiN3plrMmK76py&offset=${offset || ''}`)
        .then(response => response.json())
        .then(json => json)
        ;
}


const airtableRecords = [];
const airtablePerPage = 100;
function getAirtableRecords(offset) {
    return fetchNicknamesPage(offset)
        .then(page => {
            const { records } = page;
            airtableRecords.push(...records);
            if (records.length === airtablePerPage) {
                
                getAirtableRecords(page.offset);
            }
        });
}

const categoryNicknames = {};
function getNicknameOptions() {
    return getAirtableRecords()
        .then(() => {
            airtableRecords.forEach(record => {
                const category = record.fields['Category'].toLowerCase();
                const name = record.fields['Name'];
                if (!categoryNicknames[category]) {
                    categoryNicknames[category] = [];
                    
                }
                categoryNicknames[category].push(name);
            }) 
        })
}

getNicknameOptions();


function showLoadingBlock() {
    loadingBlock.classList.add('loading--is-shown');
    setTimeout(function(){ 
        loadingBlock.classList.remove('loading--is-shown');
     }, 3000);
}

let resultText = null;
function getData(evt) {
    evt.preventDefault();
    showLoadingBlock();
    setTimeout(function(){ 
        secondQuestion.classList.add('hidden');
        resultBlock.classList.remove('hidden');
     }, 2000);
    const cyclist = document.querySelector('input[name="cyclist"]:checked').value;
    const place = document.getElementsByName('place')[0].value;
    const nicknameOptions = categoryNicknames[cyclist];
    const nickname = nicknameOptions[Math.floor(Math.random()*nicknameOptions.length)]
    result.innerHTML = "The " + nickname + "<br>" + " of " + place;
    resultText = `The ${nickname} of ${place}`;
    resultText = resultText.toUpperCase();
}


function generateQR() {
    const url = `https://ksushana.github.io/aka/build/result.html?${resultText}`;
    // const qrcode = 
    new QRCode(document.getElementById('qrcode'), {
        text: url,
        width: 200,
        height: 200,
        colorDark : '#000',
        colorLight : '#fff', 
        correctLevel : QRCode.CorrectLevel.H
    });
    const link = document.querySelector('.send-block__link');
    link.setAttribute("href", url);
}

function switchToThankYouPage(evt) {
    evt.preventDefault()
    finalBlock.classList.add('final--is-shown');
    document.body.style.backgroundColor = "#000000";
    QRBlock.classList.add('hidden');
}

function shareSocial() {
    var fbButton = document.getElementById('fb-share-button');
    if (fbButton) {
        var url = window.location.href;
        const response = fetch(imageElem.src);
        const blob = response.blob();
        const filesArray = [
            new File(
            [blob],
            imageElem.src,
            {
                type: "image/jpeg",
                lastModified: new Date().getTime()
            }
        )
        ];

        const shareData = {
            title: 'Cycling Nickname',
            text: 'Check my Cycling Nickname',
            url: imageElem.src,
            files: filesArray,
          }
        
          const btn = document.getElementById('fb-share-button');
        
          btn.addEventListener('click',  () => {
            if (navigator.share) {
                try {
                navigator.share(shareData)
                } catch(err) {
                }
            } else {
                
            }
          });
    }
};


function generateImagePage() {
    resultBlock.classList.add('hidden');
    QRBlock.classList.remove('hidden');
}

function onGenerateBtnClick() {
    generateImagePage()
    generateQR()
}



function init() {
}

if(randomize) {
    nextBtn.addEventListener('click', switchToNextQuestion);
    resultBtn.addEventListener('click', getData);
    imageButton.addEventListener('click', onGenerateBtnClick, false);
    showForm.addEventListener('click', switchToForm);
    showFinalBlockBtn.addEventListener('click', switchToThankYouPage);
}

const imageElem = document.querySelector('.image-share-block img');
if (imageElem) {
    imageElem.src="https://img.bruzu.com/?bi=https://ucarecdn.com/8aeee6e6-1eea-4575-a6fb-7f3a53055868/&bi.o=NaN&h=1080&w=1080&a.tp=textbox&a.ox=center&a.oy=center&a.x=560&a.y=517&a.w=540&a.h=389&a.t=" + window.location.search.replace('?', '') + "&a.ta=center&a.fs=86&a.cs=-61&a.lh=1&a.fw=700&a.ff=Open Sans Condensed&a.maxHeight=488";
    var metaTags=document.getElementsByTagName("meta");

    var fbAppIdContent = "";
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "og:image") {
            fbAppIdContent = metaTags[i].setAttribute("content", "https://img.bruzu.com/?bi=https://ucarecdn.com/8aeee6e6-1eea-4575-a6fb-7f3a53055868/&bi.o=NaN&h=1080&w=1080&a.tp=textbox&a.ox=center&a.oy=center&a.x=560&a.y=517&a.w=540&a.h=389&a.t=" + window.location.search.replace('?', '') + "&a.ta=center&a.fs=86&a.cs=-61&a.lh=1&a.fw=700&a.ff=Open Sans Condensed&a.maxHeight=488");
            break;
        }
    }
    shareSocial()
}

// window.onload=function(){
//     document.getElementById("my_video").autoplay;
//   }



export default init;
