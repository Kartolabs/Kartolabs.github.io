/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
//Get Data
const nameInput= document.querySelector("#name");
const email= document.querySelector("#email");
const message= document.querySelector("#message");
//Validate data
function ValidateForm(){
	clearMessages();
	let errorFlag=false
	if(nameInput.value.length<1){
		errorNodes[0].innerText='Name cannot be blank';
		nameInput.classList.add('error-boarder')
		errorFlag=true
	}
	
	if(!emailIsValid(email.value)){
		errorNodes[1].innerText='Invalid email address';
		email.classList.add('error-boarder');
		errorFlag=true;
	}
	
	if(message.value.length<1){
		errorNodes[2].innerText='Please enter message';
		message.classList.add('error-boarder');
		errorFlag=true;
	}
	if(!errorFlag){
		success.innerText= "Success"
	}
}

//Clear error/ success messages

function clearMessages(){
	for(let i=0;i<errorNodes.length; i++){
		errorNodes[i].innerText="";
		
	}
	success.innerText="";
	nameInput.classList.remove("error-border");
	email.classList.remove("error-border")
	message.classList.remove("error-border")
}
function emailIsValid(email){
	let pattern = /\S+@\S+\.\S+/;
	return pattern.test(email);

}


(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

})(jQuery);