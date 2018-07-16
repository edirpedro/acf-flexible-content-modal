(function($) {
		
	var ACFFCM = {
		
		init: function() {
			
			try {
					
				acf.addAction('load_field/type=flexible_content', function(field) {
					field.$el.find('.layout:not(.acf-clone):not(.fc-modal)').each(function() {
						ACFFCM.addModal($(this));
					});
				});

				acf.addAction('append', function($el) {
					if($el.is('.layout')) {
						ACFFCM.addModal($el);
						// automatically open after append it, to improve usability
						$el.find('> .acf-fc-layout-controls a.-pencil').trigger('click');
					}
				});
				
				acf.addAction('load_field', function($el) {
					console.log('load_field');
				});

				acf.addAction('invalid_field', function(field) {
					ACFFCM.invalidField(field.$el);
				});
				
				acf.addAction('valid_field', function(field) {
					ACFFCM.validField(field.$el);
				});
				
			} catch(e) {};
						
		},
		
		addModal: function($layout) {
			
			// Don't add modal to nested FC fields
			if($layout.parents('.acf-fields').length > 1)
				return false;
						
			$layout.addClass('fc-modal');
			
			// Remove collapse button and click event
			$layout.find('> .acf-fc-layout-handle').off('click');
			$layout.find('> .acf-fc-layout-controls > a.-collapse').remove();
					
			// Edit button
			var edit = $('<a class="acf-icon -pencil small light" href="#" data-event="edit-layout" title="Edit layout" />').on('click', ACFFCM.open);
			$layout.find('> .acf-fc-layout-controls').append(edit);
			
			// Add modal elements
			$layout.prepend('<div class="acf-fc-modal-title" />');
			
			// FIXME: breaks TinyMCE after append a new layout on page
			$layout.find('> .acf-fields, > .acf-table').wrapAll('<div class="acf-fc-modal-content" />');
			
		},
		
		open: function() {
			
			var $layout = $(this).parents('.layout');
			
			if(!$layout.hasClass('-modal')) {
				
				$layout.removeClass('-collapsed');
				
				var caption = $layout.find('> .acf-fc-layout-handle').html();
				var a = $('<a class="acf-icon -cancel" />').on('click', ACFFCM.close);
				
				$layout.find('.acf-fc-modal-title').html(caption).append(a);
				$layout.addClass('-modal');
				
				$('body').append("<div id='acf-flexible-content-modal-overlay' />");
				$('#acf-flexible-content-modal-overlay').on('click', ACFFCM.close);
				$('body').addClass('acf-modal-open');
				
			}

		},
		
		close: function() {
			
			$('body').removeClass('acf-modal-open');
			$('.acf-flexible-content .layout.-modal > .acf-fc-layout-handle').click(); // To reload layout title
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