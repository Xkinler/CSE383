$(window).on('load',function(){
	setTimeout(function() {
		$(".light-bg").animate({
			opacity: 0.5
                }, 1000, function(){
                        $(".text-opacity-anim").animate({
                                opacity:1.0,
                        }, 2000);
                });
	}, 100);
});
