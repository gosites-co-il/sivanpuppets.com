var b = new builder("main-builder", siteVersion);

var __arrLayouts = ['onecolumn', 'nestedlayout', 'threecolumn', 'fourcolumn', 'sixcolumn', 'twelvecolumn', 'onethirdtwothirdcolumn', 'twothirdonethirdcolumn', 'onequarterthreequartercolumn', 'threequarteronequartercolumn', 'quarterhalfquartercolumn', 'sliderfullwidth'];
var __arrWidgets = ['text', 'title', 'image', 'embedcode', 'contactform', 'newsletterform', 'googlemap', 'jumbotron', 'pageheader', 'spacer', 'divider', 'socialicons', 'facebookpage', 'facebookcomments', 'facebooklike', 'facebookshare', 'facebookpost', 'button', 'youtube', 'bootstarpslider', 'fancyimagesgallery', 'textscroller', 'productssearch', 'textslider', 'thumbnailgallery', 'newsticker', 'productsgallery', 'productsticker', 'titleseparator', 'webclient', 'toucharousel', 'slider', 'searchbox', 'feature', 'brandscarousel', 'testimonialcarousel', 'accordion', 'tabs', 'blogsummary', 'countdown', 'productsautocomplete'];



if (Builder.__designversion == "2") {
    __arrLayouts.splice($.inArray("sliderfullwidth", __arrLayouts), 1);
    __arrWidgets.splice($.inArray("slider", __arrWidgets), 1);
}
if (typeof ccisEditMode != 'undefined') {
    if (ccisEditMode) {
        b.preinit();

        b.init(['sidebar', 'navigate', 'siteproperties', 'sitepages', 'preview', 'sitedesign', 'save', 'pageunload', 'blockemptymessage', 'sitejscss', 'mediagallery', 'sitenavigation', 'sitelinks', 'sitepinproducts', 'sitefontawesome', 'linksparser', 'devicepreview', 'seo', 'widgetstypography', 'contextmenu', 'ribbons', /*'bigstock',*/ 'payments', 'siteinformation', 'siteseochecker'], __arrWidgets, __arrLayouts, palleteName, function (builder) {
            // callback builder is ready.
        }, ccshopType);

    } else {
        b.initLive(['text', 'title', 'image', 'embedcode', 'contactform', 'newsletterform', 'slider', 'googlemap', 'jumbotron', 'pageheader', 'spacer', 'divider', 'socialicons', 'facebookpage', 'facebookcomments', 'facebooklike', 'facebookshare', 'facebookpost', 'button', 'youtube', 'productssearch', 'bootstarpslider', 'fancyimagesgallery', 'textscroller', 'textslider', 'searchbox', 'newsticker', 'thumbnailgallery', 'productsgallery', 'productsticker', 'titleseparator', 'webclient', 'toucharousel', 'feature', 'brandscarousel', 'testimonialcarousel', 'accordion', 'tabs', 'blogsummary', 'countdown', 'productsautocomplete'], ['onecolumn', 'nestedlayout', 'threecolumn', 'fourcolumn', 'sixcolumn', 'twelvecolumn', 'onethirdtwothirdcolumn', 'twothirdonethirdcolumn', 'onequarterthreequartercolumn', 'threequarteronequartercolumn', 'sliderfullwidth', 'quarterhalfquartercolumn']);


    }
}