var th = document.getElementById('thumbnails');

th.addEventListener('click', function(e) {
  var t = e.target, new_src = t.parentNode.href,
      large = document.getElementById('large'),
      cl = large.classList,
      lgwrap = document.getElementById('lg-wrap');
  lgwrap.style.backgroundImage = 'url(' +large.src + ')';
  if(cl) cl.add('hideme');
  window.setTimeout(function(){
    large.src = new_src;
    if(cl) cl.remove('hideme');
  }, 50);
  e.preventDefault();
}, false);

$(document).ready(function(){
  $('input[type=button]').click(function(){
    ajaxForm($(this));
  });
});
function ajaxForm(button){
  var form = button.closest('form'),
      formElements = ['input:not([type=button]):not([type=submit])', 'select', 'textarea'],
      formNames = new Array(),
      dataString = '';
  for (var i in formElements) {
    form.find(formElements[i]).each(function(){
      formNames.push([$(this).attr('name'), $(this).val()]);
    });
  }
  for (var i in formNames) {
    if (dataString!=='') {
      dataString += '&'
        }
    dataString += formNames[i][0]+'='+escape(formNames[i][1]);
  }
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: dataString,
    success: function(){
      console.log(dataString); // Success actions go here.
    }
  });
}
(function() {

  var app = angular.module('LocalObjectSynch', ['ngStorage']);

  // Represents a single course. Might send info to the Booking Service
  app.controller('ProductController', ['CartService',function(CartService) {
    this.addToCart = function() {
      CartService.addProduct({
        name:  this.name,
        price: this.price
      });
      // Clear flieds after including.
      this.name  = null;
      this.price = null;
    };
  }]);


  app.controller('CartController', ['CartService', function(CartService) {

    this.getProducts = function (){
      return CartService.getProducts();
    }

    this.remove = function (p) {
      return CartService.remove(p);
    }
  }]);


  // Saves all the products of the cart
  app.service('CartService', function($localStorage){

    //$localStorage.$reset({});
    this.storage = $localStorage;

    this.addProduct = function(p) {
      p.date_added = new Date().toDateString();
      this.storage.products = this.storage.products || [];
      this.storage.products.push(p);
    }

    this.remove = function(p) {
      var index = this.storage.products.indexOf(p)
      this.storage.products.splice(index,1);
    }

    this.getProducts = function () {
      return this.storage.products;
    }
  });

})();
