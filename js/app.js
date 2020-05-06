'use strict';
/* global $ */
const keywords = [];

function Image(url, title, desc, key, horns){
  this.url = url;
  this.title = title;
  this.desc = desc;
  this.key = key;
  this.horns = horns;
}

Image.prototype.renderImage = function() {
  // Get the template
  const $imageTemplateClone = $('#photo-template').clone();

  // Set the correct elements
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
});

