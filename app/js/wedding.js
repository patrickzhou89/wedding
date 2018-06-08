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
		$('#rsvp-form-wrapper').hide();
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
	$('#rsvp-form').on('submit', function(e){
		e.preventDefault();
		var $this=$(this);
		var $rsvpError=$('.rsvp-error');
		var $rsvpNameForm=$("#rsvp-form");
			$.ajax({
				method: "POST",
				url: "/rsvp",
				data: $rsvpNameForm.serializeFormJSON(),
				success:function(data, status, jqXhr){
					if(data){
						$this.hide();
						$rsvpError.hide();
						renderRSVP(data);
					}
				},
				error:function(data, status, jqXhr){
					$rsvpError.hide();
					if(data.status==404){
						$('#rsvp-not-found').show();
					}else if(data.status==400){
						$('#rsvp-bad-request').show();
					}
				}
			});
		//return false;
	})
	function renderRSVP(data){
		var $rsvpResponse = $('#rsvp-response-form'),
			guestList=data.guestList;
		$rsvpResponse.show();
		var $rsvpError=$('.rsvp-error');
		var html="";
		if(guestList){
			
			$.each(guestList,function(index, value){
				html+="<li class='rsvp-guest-list-names'>"+value.firstName+"&nbsp&nbsp&nbsp"+value.lastName+"</li>"
			})
			$('.rsvp-guest-list').html(html);
			$('#guest-party-id').val(data.guestPartyId)
		}
		if(data.plusOne){
			var plusOneSection="<div><p>Will you be bringing a +1?</p><p class='rsvp-error' id='rsvp-validation-plusone'>Please fill out +1 name.</p><div class='rsvp-radio-button-wrapper'><span><input type='radio' name='plusOneResponse' value='true' required checked/>Yes</span><span><input type='radio' name='plusOneResponse' value='false'/>No</span></div><div id='plus-one-section'><input type='text' class='rsvp-input rsvp-full-input' id='plus-one-name' name='plusOneName' placeholder='Name'></div></div>";
			$('#rsvp-response-form-questions').last().append(plusOneSection);
		}
		$rsvpResponse.on('click','input[type="radio"][name="plusOneResponse"]',function(){
			var $plusOneSection = $rsvpResponse.find('#plus-one-section');
			if(this.value=="true"){
				$plusOneSection.show();
			}else{
				$plusOneSection.hide(); 
				$rsvpResponse.find('#plus-one-name').val('');
			}
		});
		var $rsvpResponseDiet = $('#rsvp-response-diet');
		var $rsvpSong = $('#rsvp-song');
		var $dietOther = $('#rsvp-diet-other-textfield');
		$rsvpResponse.on('click','input[type="radio"][name="attending"]',function(){
			if(this.value=="true"){
				$rsvpResponseDiet.show();
				$rsvpSong.show();
			}else{
				$dietOther.val('');
				$rsvpResponseDiet.hide(); 
				$rsvpSong.hide();
			}
		});
		
		$rsvpResponse.on('click','input[type="radio"][name="dietary"]',function(){
			if(this.value=="other"){
				$dietOther.show();
			}else{
				$dietOther.val('').hide(); 
			}
		});
		$rsvpResponse.on('submit',function(e){
			$rsvpResponse.find('.rsvp-error').hide();
			data = $rsvpResponse.serializeFormJSON();
			if(data.plusOneResponse=='true' && !data.plusOneName){
				$rsvpResponse.find('#rsvp-validation-plusone').show();
			}else if(data.attending=='true' && data.dietary=='other' && !data.dietOther){
				$rsvpResponse.find('#rsvp-validation-diet').show();
			}else{
				$.ajax({
					method: "POST",
					url: "/rsvp/response",
					data: data,
					success:function(data, status, jqXhr){
						$rsvpResponse.hide();
						if(data){
							$rsvpResponse.hide();
							if(data.attending=='true'){
								renderMadLib(data);
							}else{
								renderThankYou();
							}
						}
					},
					error:function(data, status, jqXhr){
						console.error(jqXhr);
					}
				});
			}
			e.preventDefault();
		})
	}
	function renderMadLib(data){
		var $rsvpMadlib = $('#rsvp-mad-lib-form');
		$rsvpMadlib.show();
		$('#rsvp-mad-lib-groupid').val(data.guestPartyId);
		$rsvpMadlib.on('submit',function(e){
			$.ajax({
				method: "POST",
				url: "/rsvp/madlib",
				data: $rsvpMadlib.serializeFormJSON(),
				success:function(data, status, jqXhr){
					$rsvpMadlib.hide();
					renderThankYou(true);
				},
				error:function(data, status, jqXhr){
					console.error(jqXhr);
				}
			});
			e.preventDefault();
		});
	}
	function renderThankYou(attending){
		var $rsvpThankYou = $('#rsvp-thank-you-wrapper');
		$rsvpThankYou.show();
		var html = 'Thank you for response!';
		if(attending){
			html+=' We look forward to seeing you!';
		}
		$('#rsvp-thank-you').html(html);
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
