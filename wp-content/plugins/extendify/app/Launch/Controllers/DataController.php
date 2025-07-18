<?php
/**
 * Data Controller
 */

namespace Extendify\Launch\Controllers;

defined('ABSPATH') || die('No direct access.');

use Extendify\Http;

/**
 * The controller for handling general data
 */
class DataController
{
    /**
     * Get Goals information.
     *
     * @param \WP_REST_Request $request - The wp rest request.
     *
     * @return \WP_REST_Response
     */
    public static function getGoals($request)
    {
        $params = [
            'title' => $request->get_param('title'),
            'site_type' => $request->get_param('site_type'),
            'site_profile' => $request->get_param('site_profile'),
            'site_objective' => $request->get_param('site_objective'),
            'site_id' => $request->get_param('site_id'),
        ];
        $response = Http::get('/goals?' . http_build_query($params));

        if (is_wp_error($response)) {
            return new \WP_REST_Response([], 500);
        }

        return new \WP_REST_Response($response);
    }
}
