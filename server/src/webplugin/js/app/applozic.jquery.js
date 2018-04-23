var $applozic = jQuery.noConflict(true);
if (typeof $original !== 'undefined') {
    $ = $original;
    jQuery = $original;
    if (typeof $.fn.template === 'function') {
        $applozic.fn.template = $.fn.template;
        jQuery.fn.template = $.fn.template;
    } else if (typeof $applozic.fn.template === 'function') {
        $.fn.template = $applozic.fn.template;
        jQuery.fn.template = $applozic.fn.template;
    }
}
