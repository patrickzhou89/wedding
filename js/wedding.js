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
})(window, document, $);