<?php

/**
 * CUSTOM POST TYPE POUR LES FAQ
 */

register_post_type(
    'faq',
    array(
        'label' => 'FAQ',
        'labels' => array(
            'name' => 'FAQ',
            'singular_name' => 'FAQ',
            'all_items' => 'Toutes les FAQ',
            'add_new_item' => 'Ajouter une FAQ',
            'edit_item' => 'Éditer la FAQ',
            'new_item' => 'Nouvelle FAQ',
            'view_item' => 'Voir la FAQ',
            'search_items' => 'Rechercher dans les FAQ',
            'not_found' => 'Aucune FAQ trouvée',
            'not_found_in_trash' => 'Aucune FAQ trouvée dans la corbeille'
        ),
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'faq',
        'graphql_plural_name' => 'faqs',
        'hierarchical' => true,
        'menu_icon' => 'dashicons-editor-help',
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            'comments',
            'revisions', 
            'page-attributes',
            'custom-fields',
            'excerpt',
            'author',
            'thumbnail'
        )
    )
);