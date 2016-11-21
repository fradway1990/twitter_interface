'use strict';


function toggleActivityDisplay(duration){
	if(duration === 'undefined'){
		duration = 400;
	}
	$('.activity-label').on('click',function(){
		var caret = $(this).children('i');
		$(this).parent().children('.slimScrollDiv').children().show();
		$(this).parent().children('.slimScrollDiv').slideToggle(duration,function(){
			if($(this).parent().children('.slimScrollDiv').is(':visible')){
				caret.attr('class','fa fa-caret-up');
			}else{
				caret.attr('class','fa fa-caret-down');
				
				
			}
		});
	});
	
}
$('.activity-container').slimScroll({
    height: '300px'
});
toggleActivityDisplay(200);

