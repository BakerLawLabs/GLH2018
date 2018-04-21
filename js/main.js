function saveContract() {
	//$('#result_items').hide();
	$('#resultMsg').show(); 
	setTimeout( showSaveResultMsg, 5200);
}

function showSaveResultMsg() {
    window.scrollBy(0, 460); 
	$('#resultMsg').hide(); 
	$('#saveResultsMsg').show();
	$('#results_foot_msg').hide(); 
}


$(window).load(function () {

	jQuery(".ie *:first-child").addClass("firstChild");

	_global_vars.content_width = $('.buttonHolder').width();
			
	detectBrowser();
	resizeContainer();

	$('#flowchart').flowchart({type_person:_global_vars.type_person});

});

function resizeContainer()
{
	if(_global_vars.browser_type == 'tablet_portrait' || _global_vars.browser_type == 'mobile_landscape' || _global_vars.browser_type == 'desktop')
    {
    $('.ctrlHolder').each(function() {
        var row = $(this);
        var maxHeight = $('.question p, .yes, .no',row).outerHeight(true) ;
        $('.question, .yes, .no', row).height(maxHeight);
    });
    }
}
		
$(window).resize(function(){
	detectBrowser();
    resizeContainer();
});

function detectBrowser()
{ 
	_global_vars.browser_changed = false;
	var width = $(window).width();
	var height = $(window).height();
	if(width >= 960) temp = 'desktop';
	//if(width <= 1024 && width >= 960 && width > height) temp = 'tablet_portrait'; 
	if(width < 960 && width >=768) temp = 'tablet_portrait';
	if(width < 768 && width >=530) temp = 'mobile_landscape';
	if(width < 530 ) temp = 'mobile_portrait';
	if(temp != _global_vars.browser_type) { //alert(width+' - '+height);
		_global_vars.browser_type = temp;
		_global_vars.browser_changed = true;
        _global_vars.content_width = $('.buttonHolder').width();
	}
}



// Avoid console errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



// Place any jQuery/helper plugins in here.


;(function($,window,undefined){

$.fn.flowchart = function(settings)
{
    function Flowchart(elem, options)
	{
        var flowchart = this;
        
        flowchart.data = {};
        
        var defaults = {
			//propertyName: 'value',
			//onSomeEvent: function() {}
			type_person : 'buyer'
		}
		
		flowchart.settings = {};
		
		function hideAfter(questionId)
		{
			try
			{
				var question = $('#flowchart_item_'+questionId+'')
				var nextQuestion = question.nextAll(':not(.buttonHolder)');
				nextQuestion.hide();//.css({'display':'none'});
				$('.choice',nextQuestion).removeClass('active');
				$('#flowchart_item_'+questionId+' .choice').removeClass('active');
			}
			catch(err)
			{
			}
		}
        
        flowchart.choice = function(questionId, choice)
		{
            try
			{
			hideAfter(questionId);
            resetResults();
            if(choice == 'yes' || choice == 'no')
            {
                $('#flowchart_item_'+questionId+' .'+choice).addClass('active');
				var nextItemId = $('input#question_'+questionId+'_'+choice+'', $('#flowchart_item_'+questionId)).val();
				hideAfter(nextItemId);
				displayItem(nextItemId);
            }
			}
			catch(err)
			{
				txt="<p>There was an error on this page.<br>";
				txt+="Error description: " + err.message + "</p>";
				//$('#error').html(txt);
				//alert(txt);
			}
        }
        
        flowchart.undo = function() 
        {
            if($('#flowchart .items .ctrlHolder').length > 1)
            {
                $("#flowchart  .items .ctrlHolder[style*='block']").last().hide();
            }
			resetResults()
            $('.choice', $("#flowchart .ctrlHolder[style*='block']").last()).removeClass('active');
        }
		
		function resetResults() {
			$('.result #result_items .result_item').hide();
			$('.result').hide();
		}
        
        function displayItem(nextItemId)
        {
			resetResults();
            var item = $('#flowchart_item_'+nextItemId+',#flowchart_result_'+nextItemId+'');
			if(item.hasClass('choice_item'))
            {
				item.show();
				var maxHeight = $('.question p, .yes, .no',$(item)).outerHeight(true) ;

					$('.question, .yes, .no', $(item)).height(maxHeight);
					$('.yes span, .no span', $(item)).css({'line-height':maxHeight+'px','margin':0,'vertical-align':'center'});
            }
            else if(item.hasClass('result_item'))
            {
                $('.delivery-risk,.cost', $(item)).css({'width':'auto'});
				$('.result').show();
				item.show();
				$(window).scrollTo( $('.result'), 800 );
				
				var params = {
					bar1_width:$('.delivery-risk', $(item)).attr('width_percent'),
					bar2_width:$('.cost', $(item)).attr('width_percent'),
					bar3_width:$('.insurance', $(item)).attr('width_percent'),
					bar3_before_width:$('.insurance', $(item)).attr('before_width_percent'),
					bar4_width:$('.booking-freight', $(item)).attr('width_percent'),
					bar4_before_width:parseFloat($('.booking-freight', $(item)).attr('before_width_percent'))
				}
				//var width1 = $('.delivery-risk', $(item)).attr('width_percent');
				//var width2 = $('.cost', $(item)).attr('width_percent');
				$('.graphics .bar').hide().css({width:'1px'});
				setTimeout(function(){flowchart.animation(params)},1000);
            }
        }
		
		flowchart.animation = function(params)
		{
			//console.debug( _global_vars.content_width, width1, width2 );
			/*
			var width1 = _global_vars.content_width / 100 * params.bar1_width;
			var width2 = _global_vars.content_width / 100 * params.bar2_width;
			var width3 = _global_vars.content_width / 100 * params.bar3_width;
			var bar3_before_width = _global_vars.content_width / 100 * params.bar3_before_width;
			var width4 = _global_vars.content_width / 100 * params.bar4_width;
			var bar4_before_width = _global_vars.content_width / 100 * params.bar4_before_width;
			
			$(".graphics .bar.delivery-risk").show().animate({width: width1+'px' }, {queue:false, duration:1700, easing:'easeOutCirc'});
			$(".graphics .bar.cost").show().animate({width: width2+'px' }, {queue:false, duration:1700, easing:'easeOutCirc'});
			$(".graphics .bar.insurance").css({'margin-left':bar3_before_width}).show().animate({width: width3+'px' }, {queue:false, duration:1700, easing:'easeOutCirc'});
			$(".graphics .bar.booking-freight").css({'margin-left':bar4_before_width}).show().animate({width: width4+'px' }, {queue:false, duration:1700, easing:'easeOutCirc'});
			*/
		}
        
        
		function initialise(options)
		{
			flowchart.settings = $.extend({}, defaults, options);            
		}
		
		$.extend(
			flowchart,
			{
				reinitialise: function(options)
				{
					s = $.extend({}, settings, s);
					initialise(s);
				}
				/*,foomethod: function() {
					console.debug('in foomethod');
				}*/
			}
		);
		
		initialise(options);

    }
    return this.each(
		function()
		{
			var elem = $(this), flowchartApi = elem.data('flowchart');
			if (flowchartApi) {
				//flowchartApi.reinitialise(settings);
			} 
			else {
				$("script",elem).filter('[type="text/javascript"],:not([type])').remove();
					flowchartApi = new Flowchart(elem, settings);
					elem.data('flowchart', flowchartApi);
			}
		}
	);

};

$.fn.flowchart.defaults = {
	type_person : 'buyer'
};

})(jQuery,this);