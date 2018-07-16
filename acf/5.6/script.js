
jQuery(document).ready(function() {
	
	try {		
		
		// Add Elements button
		var acf_fc_render = acf.fields.flexible_content.render;
		acf.fields.flexible_content.render = function() {
			acf_fc_modal_init();
			acf_fc_modal_handle_validation();
			return acf_fc_render.apply(this, arguments);
		}
		
		// ACF FC Modal
		acf_fc_modal_init();
		
	} catch(e) {}
	
});

// Init Modal
function acf_fc_modal_init() {
	
	jQuery('.acf-flexible-content .layout:not(.acf-clone)').each(function() {
		var layout = jQuery(this);
				
		// Ignoring if it is a nested FC
		if(layout.parents('.acf-fields').length > 1)
			return true;
		else
			layout.addClass('fc-modal');
		
		// Remove Toggle button and click event
		layout.find('> .acf-fc-layout-handle').off('click');
		layout.find('> .acf-fc-layout-controlls > li:last-child').remove(); // ACF 5.4
		layout.find('> .acf-fc-layout-controlls > a:last-child').remove(); // ACF 5.5
		
		// Edit button
		var controls = layout.find('> .acf-fc-layout-controlls');
		if(controls.is('ul'))
			controls.append('<li><a class="acf-icon -pencil small light" href="#" data-event="edit-layout" title="Edit layout"></a></li>');
		else
			controls.append('<a class="acf-icon -pencil small light" href="#" data-event="edit-layout" title="Edit layout"></a>');
		layout.find('> .acf-fc-layout-controlls a.-pencil').on('click', acf_fc_modal_open);
		
		// Add modal elements
		if(layout.find('> .acf-fc-modal-title').length == 0) {
			layout.prepend('<div class="acf-fc-modal-title"></div>');
			layout.find('> .acf-fields, > .acf-table').wrapAll('<div class="acf-fc-modal-content"></div>');
		}
					
	});

}

// Open Modal
function acf_fc_modal_open() {
	var layout = jQuery(this).parents('.layout');
	if(!layout.hasClass('-modal')) {
		layout.removeClass('-collapsed');
		var caption = layout.find('> .acf-fc-layout-handle').html();
		layout.find('.acf-fc-modal-title').html(caption + '<a class="acf-icon -cancel" href="javascript:acf_fc_modal_remove()">');
		layout.addClass('-modal');
		jQuery("body").append("<div id='acf-flexible-content-modal-overlay'></div>");
		jQuery("#acf-flexible-content-modal-overlay").click(acf_fc_modal_remove);
		jQuery('body').addClass('acf-modal-open');
	}
}

// Close Modal
function acf_fc_modal_remove() {
	jQuery('body').removeClass('acf-modal-open');
	jQuery('.acf-flexible-content .layout.-modal > .acf-fc-layout-handle').click(); // To reload layout title
	jQuery('.acf-flexible-content .layout').removeClass('-modal');
	jQuery("#acf-flexible-content-modal-overlay").remove();
}

// Indicate after validation failures
function acf_fc_modal_handle_validation() {
	
	acf.add_action('validation_begin', function() { 
		jQuery('.acf-flexible-content .layout').removeClass('layout-error-messages'); 
	}); 
	
	acf.add_action('add_field_error', function($field) { 
		$field.parents('.layout:not(.acf-clone)').addClass('layout-error-messages'); 
	});
	
	acf.add_action('remove_field_error', function($field) { 
		$field.parents('.layout:not(.acf-clone)').each(function() {
			var layout = jQuery(this);
			if(layout.find('.acf-error').length == 0)
				layout.removeClass('layout-error-messages'); 
		});
	});
	
}
