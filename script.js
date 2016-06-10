
jQuery(document).ready(function() {
	
	try {		
		
		// Add Elements button
		var acf_fc_render = acf.fields.flexible_content.render;
		acf.fields.flexible_content.render = function() {
			acf_fc_modal_init();
			return acf_fc_render.apply(this, arguments);
		}
		
		// ACF FC Modal
		acf_fc_modal_init();
		
	} catch(e) {}
	
});

// Init Modal
function acf_fc_modal_init() {
	
	jQuery('.acf-flexible-content .layout').each(function() {
		var layout = jQuery(this);
		
		// Remove Toggle button and click event
		layout.find('.acf-fc-layout-handle').off('click');
		layout.find('.acf-fc-layout-controlls li:last-child').remove();
		
		// Edit button
		layout.find('.acf-fc-layout-controlls').append('<li><a class="acf-icon -pencil small" href="#" data-event="edit-layout" title="Edit layout"></a></li>');
		layout.find('.acf-fc-layout-controlls a.-pencil').on('click', acf_fc_modal_open);
		
		// Add modal elements
		if(layout.find('.acf-fc-modal-title').length == 0) {
			layout.prepend('<div class="acf-fc-modal-title"></div>');
			layout.find('> .acf-fields, > .acf-table').wrapAll('<div class="acf-fc-modal-content"></div>');
		}
					
	});

}

// Open Modal
function acf_fc_modal_open() {
	var layout = jQuery(this).parents('.layout');
	if(!layout.hasClass('-modal')) {
		var caption = layout.find('.acf-fc-layout-handle').html();
		layout.find('.acf-fc-modal-title').html(caption + '<a class="acf-icon -cancel" href="javascript:acf_fc_modal_remove()">');
		layout.addClass('-modal');
		jQuery("body").append("<div id='TB_overlay'></div>");
		jQuery("#TB_overlay").click(acf_fc_modal_remove);
		jQuery('body').addClass('acf-modal-open');
	}
}

// Close Modal
function acf_fc_modal_remove() {
	jQuery('body').removeClass('acf-modal-open');
	jQuery('.acf-flexible-content .layout.-modal .acf-fc-layout-handle').click(); // To reload layout title
	jQuery('.acf-flexible-content .layout').removeClass('-modal');
	jQuery("#TB_overlay").remove();
}
