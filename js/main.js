$( document ).ready(function() {

tabPanels ();

navigationClick ();

shopingChart ();


var teamSlider = new Swiper('.t-slider', {
  slidesPerView: 5,
  slidesPerColumn: 2,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

});

 /* Tab panels */
function tabPanels () {

  $('.tab-menu__item').on('mouseenter', function (e) {

    $(this).addClass('hovered').removeClass('disabled').siblings().removeClass('hovered');
    var tab_id = $(this).attr('data-tab');
    $('#' + tab_id).addClass('hovered').removeClass('disabled').siblings().removeClass('hovered');

    //Hover and click, else mouseleave
    $(this).on('click', function(e) {
      e.preventDefault();
      $(this).addClass('clicked').siblings().removeClass('clicked');
      $('#' + tab_id).addClass('clicked').siblings().removeClass('clicked');
    })

    if ($(this).hasClass('hovered')) {
      $(this).siblings().removeClass('hovered').addClass('disabled');
      $('#' + tab_id).siblings().removeClass('hovered').addClass('disabled');
    }

  }).on('mouseleave', function (e) {
    $('.c-wrap').find('.tab-content clicked').addClass('ssss');

    $(this).removeClass('hovered');
    var tab_id = $(this).attr('data-tab');
    $('#' + tab_id).removeClass('hovered');
  });
}

/* Nav button toggle */
function navigationClick () {
  $('.btn-menu').on('click', function() {
    $('.nav-menu').toggleClass('open');
  })
}

/* Shoping chart */
function shopingChart () {
  var storage = Storages.localStorage;
  var itemSelected = $('.s-list').find('.s-list__item');

  var addLink = $('.add-link');

  var storageRead = function(idAttr) {

    var itemKey;
    var keys = storage.keys();

    var price = 0;

    for (itemKey in keys) {
      var singleItemKey = keys[itemKey];
      var getObjects = storage.get(singleItemKey);
      itemSelected.eq(singleItemKey - 1).addClass('selected').find('.add-link').addClass('checked').text('Remove');
      
      //console.log(singleItemKey);
      $(getObjects).each(function (index, value) {
        $('.shoping-chart-bag').append('<div class="bought-item selected" id="' + singleItemKey + '"><div class="item-desc"><h4 class="name">' + value.name + '</h4><p>'+ value.description +'</p></div> <a href="" class="remove-link">Remove from chart</a><div class="item-price"><p class="item-price__value">' + value.price + '</p><p class="item-price__dolar">$</p></div></div>');
        //Calculating total price
        var newPrice = parseInt(value.price);
        price += newPrice;

        $('.total').text(price);
      })
    }

  }

  //Function storage add
  var storageAdd = function(e) {
      e.preventDefault();

      var idAttr = $(this).parent().attr('id');
      var itemName = $(this).parent().find('.item-desc').find('.name').text();
      var itemDesc = $(this).parent().find('.item-desc').find('p').text();
      var itemPrice = $(this).parent().find('.item-price').find('.item-price__value').text();

      var boughtItem = {
        'name' : itemName,
        'description' : itemDesc,
        'price' : itemPrice
      }

      $(this).parent().addClass('selected').siblings().removeClass('selected');
      //Change text of button to remove
      $(this).toggleClass('checked');

      //Remove item on toogle click
      if ($(this).hasClass('checked')) {
        $(this).text('Remove');
        storage.set(idAttr,boughtItem);
      } else {
        $(this).text('Add to chart');
        storage.remove(idAttr);
      }

      //Remove all html and put new set
      var sChartBagItem = $('.shoping-chart-bag').find('.bought-item');
      sChartBagItem.remove();

      //Read items from local storage
      storageRead(idAttr);
      storageCounter();
  }

  //Read items in bag on load
  storageRead();

  //Function resetStorage
  var resetStorage = function (e) {
    e.preventDefault();
    storage.removeAll();

    $('.bought-item').remove();

    storageCounter();

    itemSelected.removeClass('selected').find('.add-link').removeClass('checked').text('Add to chart');
  }

  var storageCounter = function () {
    var storageState = storage.keys().length;
    $('.bought-items').text(storageState);
  }

  var removeBoughtItem = function (e) {
    e.preventDefault();
   
    var boughtAttr = $(this).parent().attr('id');
    $(this).parent().remove();

    itemSelected.eq(boughtAttr - 1).removeClass('selected').find('.add-link').removeClass('checked').text('Add to chart');

    storage.remove(boughtAttr);
    storageCounter();
    //storageRead(); 


    //Calculating on removing
    var removedPriceText = $(this).parent().find('.item-price').find('.item-price__value').text();

    var removedPriceNumber = parseInt(removedPriceText);
    var fullPrice = $('.total').text();
    var fullPriceNumber = parseInt(fullPrice);

    console.log(removedPriceNumber, fullPriceNumber);

    var newPrice = fullPriceNumber - removedPriceNumber;
    $('.total').text(newPrice);
  }

  //Remove link button
  $('.remove-link').on('click', removeBoughtItem);

  //Add item on clik event
  addLink.on('click',storageAdd);

  //Reset button
  $('.reset').on('click',resetStorage);

  storageCounter();
}
