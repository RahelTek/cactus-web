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
  <button onclick="store()" type="button">StoreEmail</button>

  <script  type="text/javascript">
    function store(){
       var inputEmail= document.getElementById("email");
       localStorage.setItem("email", inputEmail.value);
      }
  </script>
