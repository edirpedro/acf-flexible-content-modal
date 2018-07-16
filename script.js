(function($) {
		
	var ACFFCM = {

		init: function() {
			
			if(typeof acf === 'undefined') {
				console.error('ACF JavaScript library not found!');
				return false;
			}
			
			// Add modal to current layouts
			acf.addAction('load_field/type=flexible_content', function(field) {
				field.$el.find('.layout:not(.acf-clone):not(.fc-modal)').each(function() {
					var $layout = $(this);
					if(!ACFFCM.isNested($layout))
						ACFFCM.addModal($layout);
				});
			});

			// Add modal to new layouts
			acf.addAction('after_duplicate', function($clone, $el) {
				if($el.is('.layout') && !ACFFCM.isNested($clone))
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
						
		},
		
		// Check for nested FC fields to do not include a modal in it
		isNested: function($layout) {
			
			return $layout.parents('.acf-fields').length > 1;
			
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
			
			var $layout = $(this).parents('.layout');
			
			var caption = $layout.find('> .acf-fc-layout-handle').html();
			var a = $('<a class="acf-icon -cancel" />').on('click', ACFFCM.close);
			
			$layout.find('.acf-fc-modal-title').html(caption).append(a);
			$layout.addClass('-modal');
			
			$('body').append("<div id='acf-flexible-content-modal-overlay' />");
			$('#acf-flexible-content-modal-overlay').on('click', ACFFCM.close);
			$('body').addClass('acf-modal-open');

		},
		
		close: function() {

			// Refresh layout title
			$('.acf-flexible-content .layout.-modal > .acf-fc-layout-handle').click();
						
			$('body').removeClass('acf-modal-open');
			$('.acf-flexible-content .layout').removeClass('-modal');
			$('#acf-flexible-content-modal-overlay').remove();

		},
		
		invalidField: function($el) {
			
			$el.parents('.layout:not(.acf-clone)').addClass('layout-error-messages'); 
			
		},
		
		validField: function($el) {
		
			$el.parents('.layout:not(.acf-clone)').each(function() {
				var $layout = $(this);
				if($layout.find('.acf-error').length == 0)
					$layout.removeClass('layout-error-messages');
			});
			
		}
		
	};
	
	ACFFCM.init();
	
})(jQuery);