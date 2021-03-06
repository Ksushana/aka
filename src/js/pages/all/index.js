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
  evt.preventDefault();
  intro.classList.add('intro--is-hidden');
  document.body.style.backgroundColor = '#ffffff';
}

function switchToNextQuestion() {
  firstQuestion.classList.add('hidden');
  secondQuestion.classList.remove('hidden');
}

function fetchNicknamesPage(offset) {
  return fetch(
    `https://api.airtable.com/v0/appcM5XpJx4Ghrw0r/tblVm2XRmKONfU09o?api_key=keyIiN3plrMmK76py&offset=${
      offset || ''
    }`
  )
    .then(response => response.json())
    .then(json => json);
}

const airtableRecords = [];
const airtablePerPage = 100;
function getAirtableRecords(offset) {
  return fetchNicknamesPage(offset).then(page => {
    const { records } = page;
    airtableRecords.push(...records);
    if (records.length === airtablePerPage) {
      getAirtableRecords(page.offset);
    }
  });
}

const categoryNicknames = {};
function getNicknameOptions() {
  return getAirtableRecords().then(() => {
    airtableRecords.forEach(record => {
      const category = record.fields['Category'].toLowerCase();
      const name = record.fields['Name'];
      if (!categoryNicknames[category]) {
        categoryNicknames[category] = [];
      }
      categoryNicknames[category].push(name);
    });
  });
}

getNicknameOptions();

function showLoadingBlock() {
  loadingBlock.classList.add('loading--is-shown');
  setTimeout(function () {
    loadingBlock.classList.remove('loading--is-shown');
  }, 3000);
}

let resultText = null;
function getData(evt) {
  evt.preventDefault();
  showLoadingBlock();
  setTimeout(function () {
    secondQuestion.classList.add('hidden');
    resultBlock.classList.remove('hidden');
  }, 2000);
  const cyclist = document.querySelector('input[name="cyclist"]:checked').value;
  const place = document.getElementsByName('place')[0].value;
  const nicknameOptions = categoryNicknames[cyclist];
  const nickname = nicknameOptions[Math.floor(Math.random() * nicknameOptions.length)];
  result.innerHTML = 'The ' + nickname + '<br>' + ' of ' + place;
  resultText = `The ${nickname} of ${place}`;
  resultText = resultText.toUpperCase();
}

function generateQR() {
  const url = `./result.html?${resultText}`;
  // const qrcode =
  new QRCode(document.getElementById('qrcode'), {
    text: url,
    width: 200,
    height: 200,
    colorDark: '#000',
    colorLight: '#fff',
    correctLevel: QRCode.CorrectLevel.H,
  });
  const link = document.querySelector('.send-block__link');
  link.setAttribute('href', url);
}

function switchToThankYouPage(evt) {
  evt.preventDefault();
  finalBlock.classList.add('final--is-shown');
  document.body.style.backgroundColor = '#000000';
  QRBlock.classList.add('hidden');
}
const imageElem = document.querySelector('.image-share-block img');

function shareSocial() {
  var fbButton = document.getElementById('fb-share-button');
  if (fbButton) {
    var url = window.location.href;

    const shareData = {
      url: imageElem.src,
    };

    const btn = document.getElementById('fb-share-button');

    btn.addEventListener('click', () => {
      if (navigator.share) {
        try {
          navigator.share(shareData);
        } catch (err) {}
      } else {
        window.open(imageElem.src);
      }
    });
  }
}

function generateImagePage() {
  resultBlock.classList.add('hidden');
  QRBlock.classList.remove('hidden');
}

function onGenerateBtnClick() {
  generateImagePage();
  generateQR();
}

function init() {}

if (randomize) {
  nextBtn.addEventListener('click', switchToNextQuestion);
  resultBtn.addEventListener('click', getData);
  imageButton.addEventListener('click', onGenerateBtnClick, false);
  showForm.addEventListener('click', switchToForm);
  showFinalBlockBtn.addEventListener('click', switchToThankYouPage);
}

if (imageElem) {
  const nickname = window.location.search.replace('?', '').replaceAll('%20', ' ');
  const nicknamesplit = nickname.split(' ');
  const name = nickname.substring(4, nickname.indexOf('OF') - 1).toUpperCase();
  const place = nickname.substring(nickname.indexOf('OF') + 3).toUpperCase();
  let size;
  if (name.length > 10 || place.length > 10) {
    size = 90;
  } else if (name.length > 12 || place.length > 12) {
    size = 80;
  } else {
    size = 120;
  }

  imageElem.src =
    'https://img.bruzu.com/?ak=BRUZU-1ndVgyOzb&bi=https://ucarecdn.com/49a68861-2435-4d58-b782-c616e78a5166/&bi.o=NaN&h=1080&w=1080&a.tp=textbox&a.ox=center&a.oy=center&a.x=540&a.y=591&a.w=540&a.h=136&a.t=OF&a.ta=center&a.fs=' +
    size +
    '&a.cs=-34&a.lh=1&a.fw=400&a.ff=Archivo Black&a.maxHeight=488&b.tp=textbox&b.ox=center&b.oy=center&b.x=540&b.y=484&b.w=1076&b.h=136&b.t=' +
    name +
    '&b.ta=center&b.fs=' +
    size +
    '&b.cs=-35&b.lh=1&b.fw=400&b.ff=Archivo Black&b.maxHeight=488&c.tp=textbox&c.ox=center&c.oy=center&c.x=540&c.y=379&c.w=1013&c.h=136&c.t=THE&c.ta=center&c.fs=' +
    size +
    '&c.cs=-36&c.lh=1&c.fw=400&c.ff=Archivo Black&c.maxHeight=488&d.tp=textbox&d.ox=center&d.oy=center&d.x=540&d.y=697&d.w=1078&d.h=136&d.t=' +
    place +
    '&d.ta=center&d.fs=' +
    size +
    '&d.cs=-65&d.lh=1&d.fw=400&d.ff=Archivo Black&d.maxHeight=488';
  shareSocial();
}

export default init;
