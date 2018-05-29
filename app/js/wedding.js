(function(window, document, $, undefined){
	/* Lazy load images*/
	if(window.outerWidth>1024){
		$('.section-image').each(function(i){
			$(this).attr('src', $(this).attr('src').replace('1024','1600'));
		});
	}

	$("a").on('click',function(e){
		if(this.hash !==""){
			e.preventDefault();
			var hash=this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top,
				easing:'swing'
			},300, function(){
				window.location.hash=hash;
			});
		}
	});
	/* Mobile Menu Icon*/
	$('#mobile-menu-icon').on('click',function(){
		$(this).toggleClass('toggle-menu');
		$('#top-nav').slideToggle();
	});
	if(window.outerWidth<=768){
		$('#top-nav > li > a ').on('click',function(){
			$('#mobile-menu-icon').toggleClass('toggle-menu');
			$('#top-nav').slideToggle(200);
		});
	}

	/* Scrolling Fixed Menu */
	if ($(this).scrollTop() > 147) {
		$('#top-nav').addClass("scroll");
	} 
	$(window).on("scroll", debounce(function() {
		if ($(window).scrollTop() > 147 && window.outerWidth>768) {
			$('#top-nav').addClass("scroll");
		} else {
			if($('#top-nav').hasClass('scroll')){
				$('#top-nav').removeClass("scroll");
			}
		}
	},100));

	/* Photo Gallery Navigator */
	var index=1,galleryLength,type;
	function setGalleryImage(index){
		var src = "./styles/images/gallery/";
		galleryLength=10;
		if(type!=null && type=="church"){
			src="./styles/images/churchwedding/gallery/";
			galleryLength=5;
		}
		$('#gallery-image').attr('src',src+index+".jpg");
		$('#navigator > ul').children('.filled').removeClass('filled');
		$('#navigator > ul > li[data-index="'+index+'"]').addClass('filled');
	}
	function closeModal(){
		$('#modal').hide();
		$('#picture-gallery').hide();
		$('#rsvp-form').hide();
		$('body').removeClass('noscroll');
		$('#navigator > ul').empty();
	}
	function openModalBase(){
		$('body').addClass('noscroll');
		$('#modal').show();
}
	$('#view-gallery').on('click',function(){
		type=$(this).attr("data-type");
		setGalleryImage(index);
		var appendString="<li class='filled' data-index='1'></li>";
		for(var i=2;i<=galleryLength;i++){
			appendString+="<li data-index='"+i+"'></li>";
		}
		$('#navigator > ul').append(appendString);
		openModalBase();
		$('#picture-gallery').show();
	});
	$('#navigator > ul').on('click','li',function(){
		var $this=$(this);
		setGalleryImage($this.attr('data-index'));
		$this.siblings('.filled').removeClass('filled');
		$this.addClass('filled');
	})
	$('#left-arrow').on('click',function(){
		if(index==1){
			index=galleryLength;
		}else{
			index--;
		}
		setGalleryImage(index);
	});
	$('#right-arrow').on('click',function(){
		if(index==galleryLength){
			index=1;
		}else{
			index++;
		}
		setGalleryImage(index);
	});
	$('#close-modal').on('click',function(){
		closeModal();
	})
	$('#modal').on('click',function(e){
		if (e.target !== this){
   		 return;
		}else{
			closeModal();
		}
	});
	$(window).on('keyup',function(e){
		if(e.keyCode == 27 && $('#modal').is(':visible')){
			closeModal();
		}
	})

	/* Bridal Party*/
	var brideanimating=false;
	$('#bridesmaid-pic-list').on('click','li',function(){
		if(!brideanimating){
			brideanimating=true;
			var $this = $(this);
			$('#bridesmaids-wrapper').addClass('selected');
			var position = $this.position();
			$this.css({'left':position.left+'px','top':(position.top)+'px','opacity':'.5'}).addClass('selected');
			var bio = $this.attr('id')+'-bio';
			$('#bridesmaids-bio').show().html($('#'+bio).html());
			$this.siblings('.selected').removeClass('selected').css({'margin-left':"",'opacity':""});
			$this.animate({'top':0,'left':'50%','margin-left':(window.outerWidth>1025)?'-100px':'-62.5px','opacity':'1'},400,'swing',function(){
				brideanimating=false;
			});
		}
	})
	var groomsmenanimating=false;
	$('#groomsmen-pic-list').on('click','li',function(){
		var $this = $(this);
		if(!$this.hasClass('no-bio')){
			if(!groomsmenanimating){
				groomsmenanimating=true;
				$('#groomsmen-wrapper').addClass('selected');
				var position = $this.position();
				$this.css({'left':position.left+'px','top':(position.top)+'px','opacity':'.5'}).addClass('selected');
				var bio = $this.attr('id')+'-bio';
				$('#groomsmen-bio').show().html($('#'+bio).html());
				$this.siblings('.selected').removeClass('selected').css({'margin-left':"",'opacity':""});
				$this.animate({'top':0,'left':'50%','margin-left':(window.outerWidth>1025)?'-100px':'-62.5px','opacity':'1'},400,'swing',function(){
					groomsmenanimating=false;
				});
			}
		}
	})

	//RSVP
	$('#rsvp-button').on('click', function(){
		openModalBase();
		$('#rsvp-form-wrapper').show();
	})
	$('#rsvp-name').on('click', function(){
		var $rsvpNameForm=$("#rsvp-form");
			$.ajax({
				method: "POST",
				url: "/rsvp",
				data: $rsvpNameForm.serializeFormJSON(),
				success:function(data, status, jqXhr){
					if(data){
						$rsvpNameForm.hide();
						renderRSVP(data);
					}
				},
				error:function(data, status, jqXhr){
					console.error(jqXhr);

				}
			});
		return false;
	})
	function renderRSVP(data){
		var $rsvpResponse = $('#rsvp-response-form');
		$rsvpResponse.show();
		var html = '<p class="align-center">Your reservation was found!</p><input type="hidden" name="guestPartyId" value='+data.guestPartyId+'>',
			guestList=data.guestList;
		if(guestList){
			html+="<ul class='rsvp-guest-list'>"
			$.each(guestList,function(index, value){
				html+="<li class='rsvp-guest-list-names'>"+value.firstName+"&nbsp&nbsp&nbsp"+value.lastName+"</li>"
			})
			html+="</ul>"
		}
		html+="<div>Will you be attending the wedding?</div><div class='rsvp-radio-button-wrapper'><input type='radio' name='attending' value='true' checked>Yes! I/We will be attending</input><input type='radio' name='attending' value='false'>Sorry, we respectfully decline</input></div>";
		if(data.plusOne){
			html+="<div>Bringing +1?</div><div class='rsvp-radio-button-wrapper'><input type='radio' name='plusOneResponse' value='true' checked>Yes</input><input type='radio' name='plusOneResponse' value='false'>No</input></div><div id='plus-one-section'><input type='text' class='rsvp-input' name='plusOneName'/ placeholder='Name'></div>";
		}
		html+="<div>Will you be attending mass on 9/1/2018?</div><div class='rsvp-radio-button-wrapper'><input type='radio' name='massAttending' value='true' checked>Yes</input><input type='radio' name='massAttending' value='false'>No</input></div>";
		html+="<div>Will you be attending the gathering on 9/3/2018?</div><div class='rsvp-radio-button-wrapper'><input type='radio' name='gatheringAttending' value='true' checked>Yes</input><input type='radio' name='gatheringAttending' value='false'>No</input></div>";
		html+="<input type='submit' value='Confirm' id='rsvp-response-confirm'/>";

		$rsvpResponse.append(html);
		$rsvpResponse.on('click','input[type="radio"][name="attending"]',function(){
			//this.value=="true"?
		});
		$rsvpResponse.on('click','input[type="radio"][name="plusOneResponse"]',function(){
			var $plusOneSection = $rsvpResponse.find('#plus-one-section');
			this.value=="true"?$plusOneSection.show():$plusOneSection.hide();
		});
		function nextQuestion(element){
			$(element).hide();
		}
		$rsvpResponse.find('#rsvp-response-confirm').on('click',function(){
			var $rsvpMadlib = $('#rsvp-mad-lib-form');
			$.ajax({
				method: "POST",
				url: "/rsvp/response",
				data: $rsvpResponse.serializeFormJSON(),
				success:function(data, status, jqXhr){
					$rsvpResponse.hide();
					$rsvpMadlib.show();
					if(data){
						renderMadLib(data);
					}
				},
				error:function(data, status, jqXhr){
					console.error(jqXhr);
				}
			});
			return false;
		})
	}
	function renderMadLib(data){
		var $rsvpMadlib = $('#rsvp-mad-lib-form');
		$('#rsvp-mad-lib-groupid').val(data.guestPartyId);
		$rsvpMadlib.find('#rsvp-mad-lib-submit').on('click',function(){
			$.ajax({
				method: "POST",
				url: "/rsvp/madlib",
				data: $rsvpMadlib.serializeFormJSON(),
				success:function(data, status, jqXhr){
				},
				error:function(data, status, jqXhr){
					console.error(jqXhr);
				}
			});
			return false;
		});
	}

})(window, document, $);

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);