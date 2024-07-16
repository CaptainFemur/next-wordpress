<?php
/**
 * UnderStrap functions and definitions
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$dir = get_template_directory() . '/inc';

// Array of files to include.
$file_includes = array(
	'/custom-post.php'

);


// Include files.
foreach ( $file_includes as $file ) {
	require_once $dir . $file;
}