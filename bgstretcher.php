<?php

/*
Plugin Name: Gecka BG Stretcher
Plugin URI: http://gecka-apps.com/wordpress-plugins/geka-submenu/
Description: Implements the bgstretcher jquery script
Version: 0.2
Author: Gecka
Author URI: http://gecka-apps.com
Licence: GPL2
*/

/* Copyright 2010  Gecka SARL (email: contact@gecka.nc). All rights reserved

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

define('GKBGS_URL'  , WP_PLUGIN_URL . "/" . plugin_basename(dirname(__FILE__)) );

// global options array to use in wp_head hook
$GLOBALS['bgstretcher_options'] = array();

/**
 * Registers script and css
 */
function bgstretcher_plugins_loaded() {
    wp_register_script( 'jquery-bgstretcher', GKBGS_URL . '/bgstretcher.js', array('jquery'), '1.2');
    wp_register_style( 'jquery-bgstretcher', GKBGS_URL . '/bgstretcher.css', '', '1.2');
}    
add_action('plugins_loaded', 'bgstretcher_plugins_loaded');

function add_streched_background ($options='') {
    
    // options
    $defaults =  array( 'imageContainer' => 'bgstretcher',
                        'resizeProportionally' => 'true',
                        'resizeAnimate' => 'false',
                        'imageWidth' =>1024,
                        'imageHeight' => 768,
                        'nextSlideDelay' => 3000,
                        'slideShowSpeed' => 'normal',
                        'slideShow' => 'true',
                        'background' => '',
                        'background_cb' => null,
                        'pageWrapper' => '#wrapper',
                        'shuffle' => false );
    
    $options = wp_parse_args( $options, $defaults );
    extract( $options, EXTR_SKIP );
    
    /* no function level defined background */
    if(!$background && !$background_cb) {
        
        $repeat = get_theme_mod( 'background_repeat', 'repeat' );
        $position = get_theme_mod( 'background_position_x', 'left' );
        $attachment = get_theme_mod( 'background_attachment', 'scroll' );
    
        $background = $options['background'] = get_background_image();
        
        if( !$background || $repeat !== 'no-repeat' || $position !== 'center' || $attachment !== 'fixed' ) return;
    
    }
    
    wp_enqueue_script('jquery-bgstretcher');
    wp_enqueue_style('jquery-bgstretcher');
    
    $GLOBALS['bgstretcher_options'] = $options;
    add_action('wp_head', '_stretched_bg_cb');
    
}

function _stretched_bg_cb ($options) {

    extract( $GLOBALS['bgstretcher_options'], EXTR_SKIP );

    if($background_cb) $background = call_user_func( $background_cb );

    if( !is_array($background) && $background ) $background = array($background);
    
    if(!sizeof($background)) return;
    
    $_bg = array();
    foreach ($background as $bg)     
        $_bg[] = "'$bg'";
    
    if($shuffle) shuffle($_bg);    
    
    $background = implode(', ', $_bg);
    
?>

<script type="text/javascript">
    jQuery( document).ready(function($){
            $(document).bgStretcher({
                images: [<?php echo $background ?>], imageWidth: <?php echo $imageWidth ?>, imageHeight: <?php echo $imageHeight ?>, 
                imageContainer: '<?php echo $imageContainer ?>', resizeProportionally: <?php echo $resizeProportionally ?>, resizeAnimate: <?php echo $resizeAnimate ?>, nextSlideDelay: <?php echo $nextSlideDelay ?>, 
                slideShowSpeed: '<?php echo $slideShowSpeed ?>', slideShow: <?php echo $slideShow ?>
            });
    });
</script>
<style type="text/css">
    <?php echo $pageWrapper ?> {
        z-index: 2;
        position: relative;
    }
</style>
<?php
    
}
