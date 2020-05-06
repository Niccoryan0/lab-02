'use strict';
/* global $ */
const images = [];
const keywords = [];

function Image(url, title, desc, keyword, horns){
  this.url = url;
  this.title = title;
  this.desc = desc;
  this.keyword = keyword;
  this.horns = horns;
  images.push(this);
}

Image.prototype.renderImage = function() {
  // Get the template
  const $imageTemplateClone = $('#photo-template').clone();
  $imageTemplateClone.attr('id', null);

  $imageTemplateClone.attr('class', this.keyword);

  $imageTemplateClone.find('h2').text(this.title);
  $imageTemplateClone.find('img').attr('src', this.url);
  $imageTemplateClone.find('p').text(this.desc);

  // Append that ish
  $('main').append($imageTemplateClone);
};

$.get('data/page-1.json', function(item) {

  item.forEach(thing => {
    const newImage = new Image(thing.image_url, thing.title, thing.description, thing.keyword, thing.horns);
    newImage.renderImage();

    if(!keywords.includes(thing.keyword)){
      keywords.push(thing.keyword);
    }
  });

  keywords.forEach((currValue) => {
    const $optionDropDown = $('option:first-child').clone();
    $optionDropDown.text(currValue[0].toUpperCase() + currValue.slice(1));
    $optionDropDown.attr('value', currValue);
    $('select').append($optionDropDown);
  });
});


// Click handler for select that checks through all things in json, and displays only ones with the keyword selected.
$('select').on('click', function(){
  const selectedKeyword = $(this).val();

  $('section').hide();

  $(`.${selectedKeyword}`).show();

  if (selectedKeyword === 'default') $('section').show();
});
