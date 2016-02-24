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
      console.log(dataString);
    }
  });
  var xmlhttp = new XMLHttpRequest();
  var url = "reviews.txt"; //contains all posts

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var arr = JSON.parse(xmlhttp.responseText);
          getReview(arr);
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  function getReviews(arr) {
   var out = "";
   for(i = 0; i < arr.reviews.length; i++) {
        out +='<div class="review-item"> <h2 class="reviewer">'+arr.reviews[i].user+'</h2> <p class-"review-content">'+arr.reviews[i].review'</p></div>'
    }
    document.getElementById("outlet").innerHTML = out; //adds all the content in the #out element
}
// Dropdown Menu
var dropdown = document.querySelectorAll('.dropdown');
var dropdownArray = Array.prototype.slice.call(dropdown,0);
dropdownArray.forEach(function(el){
	var button = el.querySelector('a[data-toggle="dropdown"]'),
			menu = el.querySelector('.dropdown-menu'),
			arrow = button.querySelector('i.icon-arrow');

	button.onclick = function(event) {
		if(!menu.hasClass('show')) {
			menu.classList.add('show');
			menu.classList.remove('hide');
			arrow.classList.add('open');
			arrow.classList.remove('close');
			event.preventDefault();
		}
		else {
			menu.classList.remove('show');
			menu.classList.add('hide');
			arrow.classList.remove('open');
			arrow.classList.add('close');
			event.preventDefault();
		}
	};
})

Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};
