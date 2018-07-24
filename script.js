(function($) {
		
	var ACFFCM = {
		
		modals: [],

		init: function() {
			
			if(typeof acf === 'undefined') {
				console.error('ACF JavaScript library not found!');
				return false;
			}
			
			// Add modal to current layouts
			
			acf.addAction('load_field/type=flexible_content', function(field) {
				field.$el.find('.acf-flexible-content:first > .values > .layout:not(.fc-modal)').each(function() {
					ACFFCM.addModal($(this));
				});
			});

			// Add modal to new layouts
			
			acf.addAction('after_duplicate', function($clone, $el) {
				if($el.is('.layout'))
					ACFFCM.addModal($el);
			});

			// Automatically open the new layout after append it, to improve usability
			
			acf.addAction('append', function($el) {
				if($el.is('.layout'))
					$el.find('> .acf-fc-layout-controls a.-pencil').trigger('click');
			});

			// Point error messages inside FC
			
			acf.addAction('invalid_field', function(field) {
				ACFFCM.invalidField(field.$el);
			});
			
			// Remove error messages
			
			acf.addAction('valid_field', function(field) {
				ACFFCM.validField(field.$el);
			});
			
			// Pressing ESC makes the modal to close
			
			$(document).keyup(function(e) {
				if(e.keyCode == 27 && $('body').hasClass('acf-modal-open'))
					ACFFCM.close();
			});
						
		},
		
		addModal: function($layout) {
										
			$layout.addClass('fc-modal');
			$layout.removeClass('-collapsed');
			
			// Remove collapse button and click event
			
			$layout.find('> .acf-fc-layout-handle').off('click');
			$layout.find('> .acf-fc-layout-controls > a.-collapse').remove();
					
			// Edit button
			
			var edit = $('<a class="acf-icon -pencil small light" href="#" data-event="edit-layout" title="Edit layout" />');
			edit.on('click', ACFFCM.open);
			$layout.find('> .acf-fc-layout-controls').append(edit);
			
			// Add modal elements
			
			$layout.prepend('<div class="acf-fc-modal-title" />');			
			$layout.find('> .acf-fields, > .acf-table').wrapAll('<div class="acf-fc-modal-content" />');
			
		},
		
		open: function() {
						
			var $layout = $(this).parents('.layout:first');
			
			var caption = $layout.find('> .acf-fc-layout-handle').html();
			var a = $('<a class="dashicons dashicons-no -cancel" />').on('click', ACFFCM.close);
			
			$layout.find('> .acf-fc-modal-title').html(caption).append(a);
			$layout.addClass('-modal');
			
			ACFFCM.modals.push($layout);
			
			ACFFCM.overlay(true);
			
		},
		
		close: function() {
			
			var $layout = ACFFCM.modals.pop();
			
			// Refresh layout title
			
			var fc = $layout.parents('.acf-field-flexible-content:first');
			fc = acf.getInstance(fc);
			var field = fc.getField(fc.data.key);
			field.closeLayout(field.$layout($layout.index()));
			
			// Close

			$layout.find('> .acf-fc-modal-title').html(' ');
			$layout.removeClass('-modal').css('visibility', '');
						
			ACFFCM.overlay(false);

		},
		
		overlay: function(show) {
						
			if(show === true && !$('body').hasClass('acf-modal-open')) {
				
				var overlay = $('<div id="acf-flexible-content-modal-overlay" />').on('click', ACFFCM.close);
				$('body').addClass('acf-modal-open').append(overlay);
				
			} else if(show === false && ACFFCM.modals.length == 0) {
						
				$('#acf-flexible-content-modal-overlay').remove();
				$('body').removeClass('acf-modal-open');

			}
			
			ACFFCM.refresh();
			
		},
		
		refresh: function() {
		
			$.each(ACFFCM.modals, function() {
				$(this).css('visibility', 'hidden').removeClass('-animate');
			});
			
			var index = ACFFCM.modals.length - 1;
			
			if(index in ACFFCM.modals)
				ACFFCM.modals[index].css('visibility', 'visible').addClass('-animate');
							
		},
		
		invalidField: function($el) {
			
			$el.parents('.layout').addClass('layout-error-messages'); 
			
		},
		
		validField: function($el) {
		
			$el.parents('.layout').each(function() {
				var $layout = $(this);
				if($layout.find('.acf-error').length == 0)
					$layout.removeClass('layout-error-messages');
			});
			
		}
		
	};
	
	ACFFCM.init();
	
})(jQuery);