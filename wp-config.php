<?php
define( 'WP_MEMORY_LIMIT', '4096M' );
@ini_set( 'upload_max_size' , '300M' );
@ini_set( 'post_max_size', '300M');
@ini_set( 'memory_limit', '4048M' );
ini_set('max_execution_time', '300');
ini_set('max_input_vars', '2000');
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'projectfocal_wp_gt1tk' );

/** Database username */
define( 'DB_USER', 'projectfocal_wp_gmkmu' );

/** Database password */
define( 'DB_PASSWORD', 'ea0231sQ$kbG_SSu' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', '/-h@v50|mPh/2Q:8[45r10H9i5(ElJk@iy9q5~I5Y]9|##Z1uWm@Og*S56;H%_+7');
define('SECURE_AUTH_KEY', 'x6B7euUlKcroP|om7T(B:7:wEokBbe0j)ST2/8!T]zmxJM@_G3eH2:#k%2vu56eW');
define('LOGGED_IN_KEY', '2LkFtcSQAH0xz~M4-mbR5u]/~85JL5[U+nn+~J2ya:;0z0f;R5A+b9Kt;%*V;oab');
define('NONCE_KEY', ':1IY23Pc3Kz-*EGP)0!17-8SW+c2!~9)PM[8|XSm7g/ZO(36s[280*JLQ83O94qJ');
define('AUTH_SALT', '~s:06PJ-m(2avH9)-306ZM7/;63S7cp1!)54f&[I4Q0lhb3@K|YGH[41Ur0rD96Z');
define('SECURE_AUTH_SALT', 'a7@M[rla_68p_mT0Au|*#)zN3b4uLy3]q*iGpkYw4453B2UU7W-KTS-n&16c_Zn9');
define('LOGGED_IN_SALT', 'bYyc-78ekf0YA0i!nOA;W70p5Pj0~4z9ktK:(J5V/+5002e:/8U]8V)&Z#S6&:m4');
define('NONCE_SALT', 'D;gF52(CRsR):ibE6x5&2M0nj~u16f1C-!%WIyCF_M*11d7*31PSF1EN36EK@h%~');


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'eClbrqw7L_';


/* Add any custom values between this line and the "stop editing" line. */

define('WP_ALLOW_MULTISITE', true);
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
