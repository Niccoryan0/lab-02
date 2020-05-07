'use strict';
/* global Handlebars, $ */
let images = [];
let keywords = [];
let currentPage = 1;


function HornImage(url, title, description, keyword, horns, page){
  this.url = url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  this.page = page;
  images.push(this);
}

HornImage.prototype.renderImage = function() {
  const imageTemplate = Handlebars.compile($('#imageTemplate').html());
  const result = imageTemplate(this);
  $('main').append(result);
};

const sortByTitle = (arr) => {
  arr.sort((left, right) => {
    if(left.title > right.title){
      return 1;
    }else if(left.title < right.title){
      return -1;
    }else{
      return 0;
    }
  });
  return arr;
};

const sortByHorns = (arr) => {
  console.log('Check this', arr);
  arr.sort((left, right) => {
    if(left.horns > right.horns){
      return 1;
    }else if(left.horns < right.horns){
      return -1;
    }else{
      return 0;
    }
  });
  return arr;

};

const getJson = (page = 1) => {
  $('main').empty();
  $('#filter :nth-child(n + 2)').remove();
  keywords = [];
  $.get(`data/page-${page}.json`, function(item) {
    sortByTitle(item);
    item.forEach(thing => {

      const newImage = new HornImage(thing.image_url, thing.title, thing.description, thing.keyword, thing.horns, page);
      newImage.renderImage();

      if(!keywords.includes(thing.keyword)){
        console.log(thing.keyword);
        keywords.push(thing.keyword);
      }
    });
    keywords.sort();
    keywords.forEach((currValue) => {
      const $optionDropDown = $('#default').clone();
      $optionDropDown.text(currValue);
      $optionDropDown.attr('value', currValue);
      $('#filter').append($optionDropDown);
    });
  });
};
getJson();

const handlePage = (e) => {
  e.preventDefault();
  if(currentPage === 1){
    currentPage = 2;
  } else { // if adding more than one page, change  to switch.
    currentPage = 1;
  }
  images = [];
  getJson(currentPage);
};

$('button').on('click', handlePage);

// We got keywords displaying, lets make them filter.
// Click handler for select that checks through all things in json, and displays only ones with the keyword selected.
console.log(images);

$('#filter').on('change', function(){
  const chosenKeyword = $(this).val();
  $('section').hide();
  $(`.${chosenKeyword}`).show();

  if($(this).val() === 'default'){
    $('section').show();
  }
});

const handleSorting = () => {
  $('main').empty();
  if($('#sort').val() === 'horns'){
    sortByHorns(images);
    console.log('Sorting', images);
    return images.forEach((val) => val.renderImage());
  } else if($('#sort').val() === 'title'){
    sortByTitle(images);
    return images.forEach((val) => val.renderImage());
  }
};

$('#sort').on('change', handleSorting);
