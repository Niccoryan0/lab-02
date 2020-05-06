'use strict';
/* global Handlebars, $ */
const images = [];
let keywords = [];
let currentPage = 1;


function Image(url, title, desc, keyword, horns, page){
  this.url = url;
  this.title = title;
  this.desc = desc;
  this.keyword = keyword;
  this.horns = horns;
  this.page = page;
  images.push(this);
  
}

Image.prototype.renderImage = function() {
  // Get the template
  const $imageTemplateClone = $('#photo-template').clone();

  // Set the correct elements
  $imageTemplateClone.find('h2').text(this.title);
  $imageTemplateClone.find('img').attr('src', this.url);
  $imageTemplateClone.find('p').text(this.desc);
  $imageTemplateClone.attr('class', this.keyword);
  $imageTemplateClone.attr('id', null);
  // Append that ish
  $('main').append($imageTemplateClone);
};

const getJson = (page = 1) => {
  $('main').empty();
  $('select :nth-child(n + 2)').remove();
  keywords = [];
  $.get(`data/page-${page}.json`, function(item) {
    item.forEach(thing => {
      const newImage = new Image(thing.image_url, thing.title, thing.description, thing.keyword, thing.horns, page);
      newImage.renderImage();
  
      if(!keywords.includes(thing.keyword)){
        console.log(thing.keyword);
        keywords.push(thing.keyword);
      }
    });
    keywords.forEach((currValue) => {
      const $optionDropDown = $('option:first-child').clone();
      $optionDropDown.text(currValue);
      $optionDropDown.attr('value', currValue);
      $('select').append($optionDropDown);
    });
  });
}
getJson();

const handlePage = (e) => {
  e.preventDefault();
  if(currentPage === 1){
    currentPage = 2;
  } else { // if adding more than one page, change  to switch. 
    currentPage = 1;
  }
  getJson(currentPage);
}

$('button').on('click', handlePage);

// We got keywords displaying, lets make them filter.
// Click handler for select that checks through all things in json, and displays only ones with the keyword selected.
console.log(images);
$('select').on('change', function(event){
  const chosenKeyword = $(this).val();
  $('section').hide();
  $(`.${chosenKeyword}`).show();



  // event.preventDefault();
  // $('main').empty();
  // console.log(this.value); // Good to go
  // images.forEach((currentImage) => {
  //   if(currentImage.keyword === this.value){
  //     currentImage.renderImage();
  //   }
  // });
  // if(this.value === 'default'){
  //   images.forEach((currentImage) => {
  //     currentImage.renderImage();
  //   });
  // }
});


