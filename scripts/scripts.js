$(document).ready(function() {

        /*Hide hackLink*/
        $("#jq_search a").css({
          "visibility":"hidden",
          "display":"block",
          "width":"0",
          "height":"0",
          "position":"absolute",/*observe this*/
          "top":"-100px",
          "left":"-100px"
        });

        $('#jq_search input[type=submit]').click(function()
        {
          a=encodeURI($("#jq_search input[type=search]").val());
          $("#jq_search a").attr("href", "https://www.google.be/search?q="+a);
          if($(this).val()=="Traduct")
          {
            $("#jq_search a").attr("href", "http://translate.google.fr/#fr/en/"+a);
          }
        });

        $('#jq_search').submit(function(){

            /*Click external page*/
            var link = $("#jq_search a");
            link.click();
            window.location.href = link.attr("href");

            return false;
        });
      });
