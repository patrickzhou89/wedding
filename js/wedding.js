(function(window, document, $, undefined){
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

	var index=1,galleryLength=9;
	function setGalleryImage(index){
		$('#gallery-image').attr('src',"./styles/images/gallery/"+index+".jpg");
	}
	$('#view-gallery').on('click',function(){
		setGalleryImage(index);
		let appendString="<li class='filled' data-index='1'></li>";
		for(let i=2;i<galleryLength;i++){
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

	$('#modal').on('click',function(e){
		if (e.target !== this){
   		 return;
		}else{
			$('#modal').hide();
			$('body').removeClass('noscroll');
			$('#navigator > ul').empty();
		}
	});
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