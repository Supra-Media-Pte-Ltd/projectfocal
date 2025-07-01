<?php
/**
 * Enqueue script and styles for child theme
 */
function woodmart_child_enqueue_styles() {
	wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'woodmart-style' ), woodmart_get_theme_info( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'woodmart_child_enqueue_styles', 10010 );
function custom_admin_footer() {
    echo 'Aks Tech eCommerce Masterplan ver 2.0-Basic.';
}
add_filter('admin_footer_text', 'custom_admin_footer');
