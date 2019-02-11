<?php

/**
 * Plugin Name: ACF Flexible Content Modal
 * Description: Make ACF Flexible Content editing the content of each layout using a Modal window.
 * Plugin URI: http://wordpress.org/plugins/acf-flexible-content-modal/
 * Version: 1.2.3
 * Author: Edir Pedro
 * Author URI: http://edirpedro.com.br
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: acf-fc-modal
 */
 
 
// File Security Check
defined('ABSPATH') or die("No script kiddies please!");


class ACFFCM {

	// Unique name of the module
	static private $id = 'acf-fc-modal';
	
	// Path
	static private $path = '';

	/*
	*  Initialize function
	*/
	static public function init() {
		global $acf;
		
		// Path
		if($acf) {
			if(version_compare($acf->version, '5.7.0', '<'))
				self::$path = '/acf/5.6';
		}

		// Hooks
		add_action('init', array(__CLASS__, 'theme_css'));
		add_action('init', array(__CLASS__, 'theme_script'));
		add_action('admin_init', array(__CLASS__, 'admin_css'), 1, 999);
		add_action('admin_init', array(__CLASS__, 'admin_script'),1, 999);
		
	}
	
	/*
	*  Process plugin activation
	*/
	static public function activate() {
		
	}
	
	/*
	*  Process plugin deactivation
	*/
	static public function deactivate() {

	}
	
	/*
	*  Register Admin Stylesheets
	*/
	static public function admin_css() {
		wp_enqueue_style('acf-fc-modal', plugins_url(self::$path . '/style.css', __FILE__), array('acf-pro-input'));
	}
	
	/*
	*  Register Admin Scripts
	*/
	static public function admin_script() {
		wp_enqueue_script('acf-fc-modal', plugins_url(self::$path . '/script.js', __FILE__), array('acf-pro-input'));
	}
	
	/*
	*  Register Theme Stylesheets
	*/
	static public function theme_css() {
	
	}

	/*
	*  Register Theme Scripts
	*/
	static public function theme_script() {
	
	}
	
}

// Activating
register_activation_hook(__FILE__, array('ACFFCM', 'activate'));

// Deactivating
register_deactivation_hook(__FILE__, array('ACFFCM', 'deactivate'));

// Initialize
add_action('init', array('ACFFCM', 'init'));
