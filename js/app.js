'use strict';
/* global Handlebars, $ */
let keywords = [];
let currentPage = 1;

function HornImage(url, title, description, keyword, horns, page){
  this.url = url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  this.page = page;
  HornImage.all.push(this);
}
HornImage.all = [];

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
    item.forEach((thing, i, a, page) => handleHornImageCreation(thing, page));
    keywords.sort();
    keywords.forEach(currValue => handleDropDown(currValue));
  });
};

const handleHornImageCreation = (thing, page) => {
  const newImage = new HornImage(thing.image_url, thing.title, thing.description, thing.keyword, thing.horns, page);
  newImage.renderImage();

  if(!keywords.includes(thing.keyword)){
    keywords.push(thing.keyword);
  }
};

const handleDropDown = currValue => {
  const $optionDropDown = $('#default').clone();
  $optionDropDown.text(currValue);
  $optionDropDown.attr('value', currValue);
  $('#filter').append($optionDropDown);
};

getJson();

const handlePage = () => {
  // e.preventDefault();
  if(currentPage === 1){
    currentPage = 2;
  } else { // if adding more than one page, change  to switch.
    currentPage = 1;
  }
  HornImage.all = [];
  getJson(currentPage);
};

$('button').on('click', handlePage);


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
    sortByHorns(HornImage.all);
    return HornImage.all.forEach((val) => val.renderImage());
  } else if($('#sort').val() === 'title'){
    sortByTitle(HornImage.all);
    return HornImage.all.forEach((val) => val.renderImage());
  }
};

$('#sort').on('change', handleSorting);
