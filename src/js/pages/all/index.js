const nextBtn = document.querySelector('.radio-form__submit--1');
const resultBtn = document.querySelector('.radio-form__submit--2');
const firstQuestion = document.querySelector('.question-1');
const secondQuestion = document.querySelector('.question-2');
const resultBlock = document.querySelector('.result');
const ImageBlock = document.querySelector('.send-block');
const imageButton = document.querySelector('.result__button');
const result = document.querySelector('.result__result');
const loadingBlock = document.querySelector('.loading');
// const canvastext = document.getElementById('textCanvas').getContext('2d'); 
// const imageElem = document.getElementById('image');

function switchToNextQuestion() {
    firstQuestion.classList.add('hidden');
    secondQuestion.classList.remove('hidden');
}
nextBtn.addEventListener('click', switchToNextQuestion);

// const getPeopleRecords = () =>
//   fetch("https://api.airtable.com/v0/appcM5XpJx4Ghrw0r/tblVm2XRmKONfU09o?api_key=keyIiN3plrMmK76py&")
//     .then(response => response.json())
//     .then(records => console.log("RECORDS: ", records));
// function getDataFromTable() {
//     getPeopleRecords();
// }

function showLoadingBlock() {
    loadingBlock.classList.add('loading--is-shown');
    setTimeout(function(){ 
        loadingBlock.classList.remove('loading--is-shown');
     }, 3000);
}
function getData(evt) {
    evt.preventDefault();
    showLoadingBlock();
    setTimeout(function(){ 
        secondQuestion.classList.add('hidden');
        resultBlock.classList.remove('hidden');
     }, 2000);
    const cyclist = document.getElementsByName('cyclist')[0].value;
    const place = document.getElementsByName('place')[0].value;
    // getDataFromTable();
    const categoryNicknames = {
        "mountain goat": ['Eagle', 'Tornado','Concorde', 'Butterfly', 'Goat','Sherpa', 'Squirrel'],
        "full gas sprinter": ['Volcano', 'Bomb','Boiling Pan', 'Combustion Engine','Dynamite', 'Throttle'],
        "breakaway bandit": ['Houdini', 'Hermit','Monk', 'Fugitive','Swashbuckler', 'Buttered Herring'],
        "broom wagon botherer": ['Worm', 'Snail','Pensioner', 'Slug','Bus Queue', 'Dial-up Internet'],
        "super domestique": ['Toaster', 'Kettle','Spatula', 'Tote Bag','Butler', 'Soap Dish'],
        "captain of the road": ['Headteacher', 'Scoutmaster','Calculator', 'Filofax','Skipper', 'Boss'],
    };
    const nicknameOptions = categoryNicknames[cyclist]
    console.log(cyclist)
    const nickname = nicknameOptions[Math.floor(Math.random()*nicknameOptions.length)]
    result.innerHTML = nickname + "<br>" + " of " + place;
    // var canvas = document.getElementById("canvas");
    // var context = canvas.getContext("2d");
    // context.font = "20px Georgia";
    // context.textAlign = "center";
    // var ele = document.getElementById("contentToWrite1");
    // if (ele.textContent) {
    // // for firefox
    // context.fillText(ele.textContent, 10, 90);
    // } else {
    // // for other browser
    // context.fillText(ele.innerText, 10, 90);
    // }
    // var img = document.getElementById("exportedImage");
    // img.src = canvas.toDataURL('image/png');
}

resultBtn.addEventListener('click', getData);

function generateImagePage() {
    resultBlock.classList.add('hidden');
    ImageBlock.classList.remove('hidden');
}


function onGenerateBtnClick() {
    generateImagePage();
    // generateCanvas();
}


imageButton.addEventListener('click', onGenerateBtnClick, false);


export default init;
