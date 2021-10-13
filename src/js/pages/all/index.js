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
                console.log(name)
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
    console.log({ nicknameOptions })
    const nickname = nicknameOptions[Math.floor(Math.random()*nicknameOptions.length)]
    result.innerHTML = nickname + "<br>" + " of " + place;
    resultText = `${nickname} of ${place}`;
}


function generateQR() {
    const url = `https://ksushana.github.io/aka/build/result.html?${resultText}`;
    console.log({ url })
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

function shareFacebook() {
    var fbButton = document.getElementById('fb-share-button');
    if (fbButton) {
        var url = window.location.href;
        
        fbButton.addEventListener('click', function() {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
                'facebook-share-dialog',
                'width=800,height=600'
            );
            return false;
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
    imageElem.src="https://img.bruzu.com/?bi=https://source.unsplash.com/27HiryxnHJk/500x500&bi.o=undefined&h=500&w=500&a.tp=textbox&a.ox=center&a.oy=center&a.x=250&a.y=250&a.w=503&a.h=122&a.t=" + window.location.search.replace('?', '') + "&a.ta=center&a.fs=60&a.lh=0.8&a.fw=700&a.ff=Space Grotesk&a.maxHeight=500";
    var metaTags=document.getElementsByTagName("meta");

    var fbAppIdContent = "";
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "og:image") {
            fbAppIdContent = metaTags[i].setAttribute("content", "https://img.bruzu.com/?bi=https://source.unsplash.com/27HiryxnHJk/500x500&bi.o=undefined&h=500&w=500&a.tp=textbox&a.ox=center&a.oy=center&a.x=250&a.y=250&a.w=503&a.h=122&a.t=" + window.location.search.replace('?', '') + "&a.ta=center&a.fs=60&a.lh=0.8&a.fw=700&a.ff=Space Grotesk&a.maxHeight=500");
            break;
        }
    }
    shareFacebook()
}



export default init;
