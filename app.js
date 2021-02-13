const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const errMsg = document.getElementById('error-msg')

// searching by enter pressing
 document.querySelector('#search')
 .addEventListener('keypress',function (event){
   if(event.key == 'Enter'){
     searchBtn.click();
   }
 })

//  toggle spinner
 const toggleSpinner = () =>{
  const spinner = document.getElementById('spinner');
  spinner.classList.toggle('d-none');
}

// selected image 
let sliders = [];
const KEY = '20264472-413e5a573da989ae057344b48';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  errMsg.innerHTML = '';
  gallery.innerHTML = '';
  if(images.length < 1){
    displayingError(`No result found`)
  }
  else{
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
  }
  toggleSpinner();
}

const getImages = (query) => {
  toggleSpinner()
  imagesArea.style.display = 'none';
  errMsg.style.display = 'none'
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => {
      toggleSpinner();
      displayingError(`Something went wrong`)})
    
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img); 
  if (item === -1) {
    sliders.push(img);
  }
  if(element.classList[2]!=='added'){
    sliders.pop(event.target)}
  
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if(duration < 0 ) {
    duration = 1000;
  }
   
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
    
  },duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// displaying error
function displayingError(err){
  imagesArea.style.display = 'none'
  errMsg.style.display = 'block'
  errMsg.innerHTML = `<div class ="text-center bg-light mt-5 p-5 rounded"><h2>${err}</h2></div>`
  
}
