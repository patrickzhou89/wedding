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
	var index=1,galleryLength=10;
	function setGalleryImage(index){
		$('#gallery-image').attr('src',"./styles/images/gallery/"+index+".jpg");
		$('#navigator > ul').children('.filled').removeClass('filled');
		$('#navigator > ul > li[data-index="'+index+'"]').addClass('filled');
	}
	function closeGallery(){
		$('#modal').hide();
		$('body').removeClass('noscroll');
		$('#navigator > ul').empty();
	}
	$('#view-gallery').on('click',function(){
		setGalleryImage(index);
		let appendString="<li class='filled' data-index='1'></li>";
		for(let i=2;i<=galleryLength;i++){
			appendString+="<li data-index='"+i+"'></li>";
		}
		$('#navigator > ul').append(appendString);
		$('body').addClass('noscroll');
		$('#modal').show();
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
		closeGallery();
	})
	$('#modal').on('click',function(e){
		if (e.target !== this){
   		 return;
		}else{
			closeGallery();
		}
	});
	$(window).on('keyup',function(e){
		if(e.keyCode == 27 && $('#modal').is(':visible')){
			closeGallery();
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