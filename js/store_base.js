/* Minification failed. Returning unminified contents.
(4021,58-59): run-time error JS1100: Expected ',': =
(4021,64-65): run-time error JS1002: Syntax error: ,
(4021,84-85): run-time error JS1100: Expected ',': =
(4148,98-99): run-time error JS1100: Expected ',': =
 */
function backstore() {
    $.facebox.close();

}

function OpenWhatIsPayPal() {
    window.open("https://www.paypal.com/us/cgi-bin/webscr?cmd=xpt/Marketing/popup/OLCWhatIsPayPal-outside", "_blank", "width=400, height=500,menubar=1,resizable=1");
}

function fbLoginCallback(fbId, login, customerId, fname, lname, email, isAutoFill) {
    if (isAutoFill) {
        $("#facebox #FirstName").val(unescape(fname));
        $("#facebox #LastName").val(unescape(lname));
        $("#facebox #Email").val(unescape(email));

        if ($("#facebox #Phone").val() == "") {
            $("#facebox #Phone").css("background", "rgb(255, 232, 236)").css("border", "solid 1px red").closest("td").css("color", "red");
        }

    }

}

function shareproduct(id) {
    var host = "";
    try {
        host = encodeURIComponent(window.location.href);
    }
    catch (e) { }

    GlobalClicksEvents.CallClickEvent(storeContext, 'step_1', 'share_product', 3, id);

    window.open(appUrl + "/Tab/FacebookConnect/?pageid=" + PageId + "&productId=" + id + "&view=ShareProductCallback&host=" + host, "_blank", "width=400, height=400");
}

function OpenCustomerMessageDialog(ttype) {
    if (!ttype) { ttype = 1; }

    var width = "700px";
    if (isMobile) {
        width = "100%"
    }

    OpenDialog('send_customer_message_diag', ['send'], function (type, e) { if (type == 'send') { SaveCustomerMessage(); } }, ['center', 150], null, width/*"auto"*/);
    CallAjax("/Tab/OpenCustomerMessageDialog", { ttype: ttype }, "ajax_dialog_customer_message_cont", null, function () {

    }, function (msg) {

    }, "GET");

}

function SaveCustomerMessage() {
    $('#send_customer_message_diag #Url').val(location.href);
    var form = bindForm($("#ajax_dialog_customer_message_cont").find("form")[0], true);
    form = merge_options(form, GetTokenStr());
    CallAjax("/Tab/SendCustomerMessage/", form,
        "ajax_dialog_customer_message_cont", null, function (msg) {
            // $("#send_customer_message_diag").dialog("close");
            var pixel = "";

            //if (facebook_leads_pixel_id && facebook_leads_pixel_id != "") {
            //    var splitFBleads = facebook_leads_pixel_id.split(',');

            //    for (var i = 0; i < splitFBleads.length; i++) {
            //        if (splitFBleads[i] != null && splitFBleads[i] != "") {
            //            pixel += "<img height='1' width='1' alt='' style='display:none' src='https://www.facebook.com/offsite_event.php?id=" + splitFBleads[i] + "&amp;value=0&amp;currency=USD' />";
            //        }
            //    }
            //}
            facebookEvent('Lead');
            tikTokEvent('Lead');

            if (google_leads_pixel_id && google_leads_pixel_id != "") {
                var splitGoogleleads = google_leads_pixel_id.split(',');

                for (var i = 0; i < splitGoogleleads.length; i++) {
                    if (splitGoogleleads[i] != null && splitGoogleleads[i] != "") {
                        var replacer = splitGoogleleads[i].split('-');
                        if (replacer.length > 1) {
                            pixel += "<img height='1' width='1' style='border-style:none;' alt='' src='//www.googleadservices.com/pagead/conversion/" + replacer[0] + "/?label=" + replacer[1] + "&amp;guid=ON&amp;script=0'/>";
                        }
                    }
                }
            }

            var msgsaved = Resources.DataSaved;

            if (Resources.MessageSentSuccesfuly) {
                msgsaved = Resources.MessageSentSuccesfuly;
            }

            $("#ajax_dialog_customer_message_cont").empty().html(pixel + "<div class='ui-state-success'>" + msgsaved + "</div>");
            $("#send_customer_message_diag #sendMsgLabel_okButton").hide();

            //$("#send_customer_message_diag").dialog({ buttons: [{ text: Resources.Close, click: function () { $(this).dialog("close"); } }] });

        }, function (msg) {
            ccValidations.DisplaySummaryErr('ajax_dialog_customer_message_cont', Resources.RequiredErr);
        }, "POST", null, 'ajax_dialog_customer_message_cont');
}

function sendActionType(stype, pid) {

    var host = "";
    try {
        host = encodeURIComponent(window.location.href);
    }
    catch (e) { }

    window.open(appUrl + "/Tab/GetPerm/publish_actions,email?productId=" + pid + "&host=" + host, "_blank", "width=400, height=400");
}
function megaLike_confirmed(productId, oid) {
    if ($('#confirm_megalike').length > 0) {
        if ($('#confirm_megalike').is(':checked')) {
            getPermisionTab('publish_actions,email', 'megalike', productId, oid);
        }
        else {
            //$('#confirm_megalike_label').addClass('input-validation-error');
            $('#confirm_megalike_err').show();
        }
    }
    else {
        getPermisionTab('publish_actions,email', 'megalike', productId, oid);
    }

}

function getPermisionTab(perm, type, productId, oid) {

    var host = "";
    try {
        host = encodeURIComponent(window.location.href);
    }
    catch (e) { }

    var str = appUrl + "/Tab/GetPerm/" + perm + (type ? "?type=" + type : "") + (productId ? (type ? "&" : "?") + "productId=" + productId : "&host=" + host);

    if (oid && oid != "") {
        if (str.indexOf("?") > -1) {
            str += "&oid=" + oid;
        }
        else {
            str += "?oid=" + oid;
        }

    }

    window.open(str, "_blank", "width=400, height=400");
}

function fbWantedCallback(productId) {
    window.scrollTo(0, 0);
    if (typeof (FB) != "undefined" && FB.Canvas) {
        FB.Canvas.scrollTo(0, 0);
    }

    jQuery.facebox('<div class="" id="likestore_cont"><br/><h3>' + Resources.WantedCallbackMsg + '.</h3><br/><br/><div style="background:#eee;padding:10px;border-top:solid 1px #DDD; text-align:left;" ><input type="button" class="button" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/></div>');
}

var like_source = "store_loaded";
function ShowLikeMessage(isHideClose, isNotRefreshCallback) {


    GlobalClicksEvents.CallClickEvent(storeContext, 'step_1', 'like_product', 3, 0);

    //if (context != null && context != "") {
    //    if (isSystemDomain == "true") {

    //        FB.login(function (response) {
    //            if (response.authResponse) {
    //                FB.api('/me/permissions', function (perms) {

    //                    var isvalid = false;
    //                    for (var i = 0; i < perms["data"].length; i++) {
    //                        if (perms["data"][i].permission == "user_likes"
    //                            && perms["data"][i].status == "granted") {
    //                            isvalid = true;
    //                        }
    //                    }

    //                    if (!perms.data || !isvalid) {
    //                        var buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" class="uibutton special big right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
    //                        $.facebox("<div class='alert  alert-danger'>" + Resources.grantPermsTitle + "</div>" + buttons);
    //                        return;
    //                    }
    //                    else {
    //                        var page_id = PageId;

    //                        FB.api({
    //                            method: 'fql.query',
    //                            query: "SELECT uid FROM page_fan WHERE page_id = " + page_id + " and uid=" + response.authResponse.userID
    //                        }, function (resp) {
    //                            if (resp.length) {
    //                                isNotRefreshCallback.call(this);
    //                                return;
    //                            } else {
    //                                renderLikeMessage(isHideClose, isNotRefreshCallback);
    //                                return;
    //                            }
    //                       });

    //                    }
    //                });
    //            } else {
    //                alert(Resources.LogInToFacebookToGetLikePrice);
    //                return;
    //            }
    //        }, { scope: 'user_likes' });
    //    }
    //    else {
    //        getPermisionTab("user_likes", "like_fan_page", null, PageId);

    //    }


    //    return;
    //}

    //renderLikeMessage(isHideClose, isNotRefreshCallback); 

    renderLikeMessage(false, function () {
        unlockitem(2);
        $('.close_image').click();
    }, true);

}

function renderLikeMessageAfterExternalSiteCallback() {
    renderLikeMessage(false, function () {
        unlockitem(2);
        $('.close_image').click();
    });
}

function renderLikeMessage(isHideClose, isNotRefreshCallback, isproductLike) {
    var buttons = "";
    var url = "http://www.facebook.com/pages/-/" + PageId;

    if (isproductLike) {
        url = cc_page_info.store_root_url + cc_page_info.getParsedInfo().fullrelativeLink + "?v=" + Math.random();
    }

    if (!isHideClose) {
        buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" class="uibutton special big right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
    }

    jQuery.facebox('<div class="padd" style="width:100%; padding: 30px 15px; box-sizing: border-box;" id="likestore_cont"><div class="left" style="padding: 0 10px;"><img src="https://graph.facebook.com/v2.8/' + PageId + '/picture?type=large" width="100" /></div><div class="left"><div class=" needparse_fb rendered_fb dir align"><h3 style="color:#000;font-size:16px; padding-bottom:5px;">' + Resources.GiveALike + ':</h3><div class="fb-like" data-href="' + url + '" data-send="false" data-width="400" data-show-faces="true" style="height:120px;"></div></div></div><div class="clear"></div></div>' + buttons);

    if (isHideClose) {
        $(".popup .close_image").hide();
    }

    FB.XFBML.parse();

    FB.Event.subscribe('edge.create',
        function (response) {
            if (isNotRefreshCallback) {
                isNotRefreshCallback.call(this);
                if (like_source == "product_like_fan_page") {
                    isLiked = true;
                    cart.IsLikePrices = true;
                }
            }
            else {
                if (like_source == "store_loaded") {
                    if (typeof (istorewinlike) == "undefined" || istorewinlike) {
                        if (typeof (istorewinlike) != "undefined") {
                            istorewinlike = false;
                        }
                        top.location = "http://www.facebook.com/pages/-/" + PageId + "?sk=app_" + appid;
                    }
                }
            }
        }
    );


}

// only for desktop devices!
function fbShareCallback(pid, type) {
    unlockitem(type);
    var buttons = '<div><input type="button" class="btn btn-default right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
    cs.SetTop();
    jQuery.facebox("<div class='alert alert-info'><div class='text text-default' style='padding-bottom:10px;'>" + Resources.ShareTnx + "</div><div class='text text-default' style='padding-bottom:10px;'><b>" + Resources.ShareActive + "</b>!</div><input type='button' class='btn btn-default' value='" + Resources.CloseAndContinueBuying + "' onclick='$.facebox.close()'/> &nbsp;<input type='button' class='btn btn-primary' onclick=\"$('.add.showcheckout').click()\" value='" + Resources.BuyNow + "'/></div>" + buttons);
    $("#istp").val("1");
    // $(".ttipshare").powerTip();
    // $.powerTip.showTip($(".ttipshare"));

    GlobalClicksEvents.CallClickEvent(storeContext, 'step_2', 'share_product', 3, pid);
}


function OpenStoreDetails() {
    var diag = MessageDialog(Resources.TermsOfUseAndPurchase, "<div class='tscrollbar' id='terms_content' style='height:200px;'></div>", function () {
        $(this).dialog('close');
    }, "auto", 100);

    CallAjax("/Tab/GetTermsText", { enc_sid: window.cc_page_info.enc_store_id }, "terms_content", null, function () {
        fallbackfixedDialogs(diag);

        $(".tscrollbar").mCustomScrollbar({
            scrollButtons: {
                enable: false
            },
            advanced: {
                updateOnContentResize: true
            },
            theme: 'dark',
            autoDraggerLength: false
        })

    }, function (msg) { }, "GET");


}

function showPaypalHelp() {
    window.open(appUrl.replace("https://", "http://") + '/Tab/CustomerPaypalHelp', '_blank', 'width=520, height=540,scrollbars=1');
}

function fallbackfixedDialogs(diag) {
    $(diag).closest(".ui-dialog").css("position", "fixed").css("z-index", "99999999999999").css("top", "30px");
}

// --------------------------------------------------- end only for tab ----------------------------------------------------------------------------------------------------------


function CallAjax(url, data, targetId, caller, onCallback, onError, method, dataType, validateContainerId, isNotReplaceWithLoading, isNotAutoPos, isValidateHiddens) {

    var isRemoteOption = false;

    if (typeof (isRemote) != "undefined") {
        isRemoteOption = isRemote;
    }
    if (!isNullOrUndefined(validateContainerId)) {
        if (ccValidations.ValidateForm($("#" + validateContainerId), { isValidateHiddens: isValidateHiddens }) == false) {
            if (!isNullOrUndefined(onError)) {
                onError.call(this, Resources.Error_Required);
            }
            return false;
        }
    }

    if (targetId && !isNotReplaceWithLoading) {
        var applicationurl = "";
        if (typeof (appUrl) != "undefined") {
            applicationurl = appUrl;
        }

        $("#" + targetId).html("<div class='loading-cont'><img src='/images/ajax-loader.gif' title='" + Resources.PleaseWait + "...'/></div>");
    }

    if (caller && $(caller).parent().length > 0) {
        if ($(caller).parent()[0].tagName == "LI") {
            $(caller).closest("ul").find("li.selected").removeClass("selected");
            $(caller).parent().addClass("selected");
        }
        else {
            $(caller).addClass("selected");
        }
    }

    if (!isNotAutoPos) {
        GetCurrentTopPos();
    }


    var xhr = $.ajax({
        type: method ? method : "POST",
        url: (isRemoteOption && url.indexOf("http") == -1 ? "/Store/GetAjax/?url=" + appUrl : "") + url,
        data: merge_options(data, GetTokenStr(url, true)),
        error: function (msg) {
            var diag = null;
            if (!onError) {
                diag = MessageDialog(Resources.OopsAnErrorOccurred + ":(", "<div class='ui-state-error padd'><div class='ui-state-error-text'>" + Resources.ErrorReportText1 + "<br/><br/><a href='javascript:OpenFeedBack();'>" + Resources.ErrorReportText2 + "</a></div>" + (false ? "<br/><br/>debug msg:<br/><textarea style='width:100%;' rows='4'>url:" + this.url + "\n\n" + msg.responseText + "</textarea>" : "") + "</div>", function (e) {
                    $(this).dialog('close');
                }, 500);

                return false;
            }

            onError.call(this, msg);

            if (!isNotAutoPos) {
                GetCurrentTopPos();
            }
        },
        cache: false,
        traditional: true,
        dataType: dataType ? dataType : null
    }).done(function (msg) {

        if (isRemoteOption) { msg = msg.replace(/"\//gi, "\"" + appUrl + "/"); }

        if (targetId) {
            $("#" + targetId).html(msg);
        }

        RenderAll();

        if (msg && ($(msg).find(".input-validation-error:visible").length > 0 || $(msg).find(".ui-state-error:visible").length > 0)) {
            onError.call(this, msg);
            return false;
        }

        if (onCallback)
            onCallback.call(this, msg);

        if (url.indexOf("checknotifications") == -1 && !isNotAutoPos) {
            GetCurrentTopPos();
        }
    });

    return xhr;
}

function RenderAll() {

    $(".normal").removeClass("special");
    $("object").attr("wmode", "transparent");
    $("param").attr("wmode", "transparent");


    $(".required-star").next().addClass("field-required");

    $(".needparse_fb:not(.rendered_fb)").addClass("rendered_fb").each(function (i, n) {
        if (typeof (FB) != "undefined") {
            try {
                FB.XFBML.parse(n);
            }
            catch (err) {
                console.error("errWob: " + err.message);
            }

        }
    })

    setWinSize();
    if (typeof (onRender) != "undefined") {
        onRender.call(this);
    }


    $('.ttip[title]').each(function (i, n) {
        if ($(n).hasClass("ttiptopright")) {
            $(n).powerTip({ placement: 'ne', fadeInTime: 0, fadeOutTime: 0 });
        }
        else if ($(n).hasClass("ttiptop")) {
            $(n).powerTip({ placement: 'n', fadeInTime: 0, fadeOutTime: 0 });
        }
        else {
            var al = store_dir == "rtl" ? "sw" : "se";
            $(n).powerTip({ placement: al, fadeInTime: 0, fadeOutTime: 0 });
        }
    });



}
function OpenFeedBack() {

    var diagFeedbck = OpenDialog('send_feedback_diag', ['send'], function (type) { if (type == 'send') { SendFeedBack(true); } }, ['center', 100]);
    CallAjax("/Public/SendFeedBack", {}, "ajax_dialog_send_feedback_cont", null, function () {

    }, function (msg) {

    }, "GET");

}
function SendFeedBack(isFront) {
    var form = bindForm($("#ajax_dialog_send_feedback_cont").find("form")[0]);
    form = merge_options(form, GetTokenStr());

    CallAjax("/Public/SendFeedBack?isFront=" + isFront, form, "ajax_dialog_send_feedback_cont", null, function () {
        $('#ajax_dialog_send_feedback_cont').html('<div id="alert" class="alert alert-success" role="alert">' + Resources.DataSaved + '</div>');
        $("#send_feedback_diag #SendFeedbakLabel_okButton").hide();

    }, function () { }, "POST", null, "ajax_dialog_send_feedback_cont");



}
function clear_form_elements(contId) {

    $("#" + contId).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });

}
function siteSearch(q) {
    window.location.href = window.cc_page_info.store_root_url + "/search?q=" + q;
}
function filterProducts(context, url, pageNum) {
    var subSubjectsOrCategories = [];
    $('input[name="storefiltercheckbox"]:checked').each(function () {
        subSubjectsOrCategories += this.value + ",";
    });

    var cats = [];
    var priceFrom, priceTo, orderType, displayType, rowsNum, term, sidebarType, subjectDropdowL1, subjectDropdowL2, subjectDropdowL3;
    if ($('#txt-filter-by option:selected').length > 0) {
        for (var i = 0; i < $('#txt-filter-by option:selected').length; i++) {
            cats += $($('#txt-filter-by option:selected')[i]).val() + ",";
        }

    }

    priceFrom = $('#txt-price-from').val() ? $('#txt-price-from').val() : "";
    priceTo = $('#txt-price-to').val() ? $('#txt-price-to').val() : "";
    orderType = $('#txt-order-type').val() ? $('#txt-order-type').val() : "";
    displayType = $('.cc-categories-layout-button-group.btn-group > .btn.active').val() ? $('.cc-categories-layout-button-group.btn-group > .btn.active').val() : "";
    rowsNum = $('#sel-show-rows').val() ? $('#sel-show-rows').val() : "";
    term = $('#txt-text').val() ? $('#txt-text').val() : "";

    sidebarType = $('#sidebarType').val() ? $('#sidebarType').val() : "";
    subjectDropdowL1 = $('#filter-by-sub-leve1').val() ? $('#filter-by-sub-leve1').val() : "";
    subjectDropdowL2 = $('#filter-by-sub-leve2').val() ? $('#filter-by-sub-leve2').val() : "";
    subjectDropdowL3 = $('#filter-by-sub-leve3').val() ? $('#filter-by-sub-leve3').val() : "";

    location.href = url + "?context=" + context + "&cats=" + cats + "&priceFrom=" + priceFrom + "&priceTo=" + priceTo
        + "&orderType=" + orderType + "&displayType=" + displayType + "&rowsNum=" + rowsNum +
        "&pageNum=" + pageNum + "&search=" + term + "&subSubjectsOrCategories=" + subSubjectsOrCategories +
        "&sidebarType=" + sidebarType + "&subjectDropdownLevel1=" + subjectDropdowL1 + "&subjectDropdownLevel2=" + subjectDropdowL2 + "&subjectDropdownLevel3=" + subjectDropdowL3;
}
function BtnGroup(divSelector, selectedValue) {
    $(divSelector + ' button[value="' + selectedValue + '"]').attr("aria-pressed", "true");
    $(divSelector + ' button[value="' + selectedValue + '"]').addClass("active");
    $(divSelector).attr('value', $(divSelector + ' button.active').val());
    $(divSelector + ' button').click(function () {
        $(divSelector + ' button').attr("aria-pressed", "false");
        $(divSelector + ' button').removeClass("active");
        $(this).attr("aria-pressed", "true");
        $(this).addClass("active");
        $(divSelector).attr('value', $(divSelector + ' button.active').val());
    });
}
function LoginAction() {
    $("#loginForm").validate();
    return;
    //var form = bindForm($("#loginModal").find("form")[0]);    
    var email = $('#cc-login-email').val();
    var pass = $('#cc-login-password').val();
    var isRem = $("#cc-login-rememberme").is(':checked');
    CallAjax("/Home/ValidateUser", { userid: email, password: pass, rememberme: isRem }, "loginModal", null, function () {
        // diagFeedbck.dialog("close");
        alert('Success');
    }, function () { }, "POST", null, "loginModal");



}
//pad(10, 4, '-'); // --10
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function filterOrders(url, pageNum) {
    var dtFrom = $('#dtFrom').val();
    var dtTo = $('#dtTo').val();
    var OrderStatusId = $('#OrderStatusId').val();

    location.href = url + "?dtFrom=" + dtFrom + "&dtTo=" + dtTo +
        "&OrderStatusId=" + OrderStatusId + "&page=" + pageNum;
}
function OrderDetailsModalShow(id) {
    // Show modal
    $('#ModalOrders').modal();
    CallAjax("/User/OrderTabs", { id: id }, "ajax_dialog_order_tabs", null, function () {

    }, function (msg) {

    }, "GET");
}
$(document).ready(function () {
    $('.float-nav').click(function () {
        $('.main-nav, .menu-btn').toggleClass('active');
    });
});

;
if (typeof (cart) == "undefined") {
    window.cart = new Cart();
}
function Cart() {
    this.Products = [];
    this.DestinationId = -1;
    this.CustomShipingId = 0;
    this.IsSelfDelivery = false; // obsolete
    this.IsLikePrices = false;
    this.StoreId = 0;
    this.OrderId = 0;
    this.CustomerFields = new CustomerFields();
    this.CuponCode = null;
    this.customerClubDiscountValue = 0;
    this.customerClubUsedPoints = 0;
    this.IsNotSupportAddress = false;
    this.IsFallbackAddress = false;
    this.ShipingOption = 0; // none 
    this.ShipingArgs = [];
    this.SelfPickupBranchId = 0;
    this.CartPreviewEnabled = false;
}

function CustomerFields() {
    this.FirstName = "";
    this.LastName = "";
    this.Phone = "";
    this.Email = "";
    //this.Address = "";
    this.Address2 = "";
    this.Zip = "";
    this.IsConfirmNewsLetter = false;
    this.Instroductions = "";
    this.FbId = 0;
    // new destinations
    this.Lat = 0;
    this.Lng = 0;
    this.CountryId = 0;

    this.City = "";
    this.CityId = 0;
    this.Street = "";
    this.StreetId = 0;
    this.HouseNum = "";

    this.RecipientFirstName = "";
    this.RecipientLastName = "";
    this.RecipientPhone = "";
    this.RecipientAddress = "";
    this.ShowDifferentCompanyNameForInvoice = false;
    this.CompanyName = "";
    this.CompanyNumber = "";
    this.IdentityNumber = false;
    // end
}

function Product(id, attrs, actions, qty, title, categoryName, price) {
    this.Guid = "";
    this.Title = title;
    this.CategoryName = categoryName;
    this.Price = price;
    this.Pid = id;
    this.Attrs = attrs;
    this.Actions = actions;
    this.IsShare = actions.IsShare;
    this.Qty = qty;
    this.DealType = 0;
    this.CustomerMegalikeId = 0;
    this.DealId = 0;
    this.SaleDealAttrs = new Object();
    this.SpecialSettings = new SpecialSettings();
    this.DealSecondChosenProduct = null;
    this.ExternalId = "";
    
}
function SpecialSettings() {
    this.TypesSpecialProduct = 0;
    this.ExtraField1 = "";
    this.ExtraField2 = "";
    this.ExtraField3 = "";
    this.ExtraField4 = "";
    this.ExtraField5 = "";
    this.ExtraField6 = "";
    this.NextraField1 = "";
    this.NextraField2 = "";
}
function isProductExistsInCart(prd, cart) {
    if (cart == null || cart.Products.length == 0) {
        return null;
    }
    if (prd.SpecialSettings != null && prd.SpecialSettings.TypesSpecialProduct > 0) {
        // Product has SpecialSettings
        return null;
    }
    var isEqual;
    for (var i = 0; i < cart.Products.length; i++) {
        isEqual = isProductsEqual(prd, cart.Products[i]);
        if (isEqual) {
            return cart.Products[i];
        }
    }
    return null;
}
function isProductsEqual(prd1, prd2) {
    try {
        // Check id
        if (prd1.Pid != prd2.Pid) {
            return false;
        }
        // Check Price
        if (prd1.Price != prd2.Price) {
            return false;
        }
        // Check Deal
        if (prd1.DealId != prd2.DealId || prd1.DealSecondChosenProduct != prd2.DealSecondChosenProduct) {
            return false;
        }
        if ((prd1.Attrs == null && prd2.Attrs == null) ||
            prd1.Attrs.length == 0 && prd2.Attrs.length == 0) {
            return true;
        }
        // check all attrs in prd1 exists in  prd2.Attrs
        var i, isExist;
        for (i = 0; i < prd1.Attrs.length; ++i) {
            isExist = isExistAtrrInArray(prd1.Attrs[i], prd2.Attrs);
            if (!isExist) {
                return false;
            }
        }
        // check all attrs in prd2 exists in  prd1.Attrs    
        for (i = 0; i < prd2.Attrs.length; ++i) {
            isExist = isExistAtrrInArray(prd2.Attrs[i], prd1.Attrs);
            if (!isExist) {
                return false;
            }
        }
        if (prd1.SpecialSettings != null && typeof prd1.SpecialSettings != 'undefined' &&
            prd2.SpecialSettings != null && typeof prd2.SpecialSettings != 'undefined') {

            if (prd1.SpecialSettings.ExtraField1 != prd2.SpecialSettings.ExtraField1) {
                return false;
            }
            if (prd1.SpecialSettings.ExtraField2 != prd2.SpecialSettings.ExtraField2) {
                return false;
            }
            if (prd1.SpecialSettings.ExtraField3 != prd2.SpecialSettings.ExtraField3) {
                return false;
            }
            if (prd1.SpecialSettings.ExtraField4 != prd2.SpecialSettings.ExtraField4) {
                return false;
            }
            if (prd1.SpecialSettings.ExtraField5 != prd2.SpecialSettings.ExtraField5) {
                return false;
            }
            if (prd1.SpecialSettings.ExtraField6 != prd2.SpecialSettings.ExtraField6) {
                return false;
            }
            if (prd1.SpecialSettings.NextraField1 != prd2.SpecialSettings.NextraField1) {
                return false;
            }
            if (prd1.SpecialSettings.NextraField2 != prd2.SpecialSettings.NextraField2) {
                return false;
            }
            if (prd1.SpecialSettings.TypesSpecialProduct != prd2.SpecialSettings.TypesSpecialProduct) {
                return false;
            }
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function isExistAtrrInArray(attr, array) {
    if (attr == null || array == null || array.length == 0) {
        return false;
    }
    for (i = 0; i < array.length; ++i) {
        if (attr.OptionId == array[i].OptionId &&
            attr.AttrId == array[i].AttrId &&
            attr.OptionText == array[i].OptionText) {
            return true;
        }
    }
    return false;
}

function Attribute() {
    this.OptionId = 0;
    this.AttributeId = 0;
    this.AnswerText = "";
}

function Action() {
    this.IsLike = false;
    this.IsShare = false;
}

function calculate() {
    if (typeof (onItemAddedToCart) != "undefined") {
        onItemAddedToCart.call(this);
    }
    if (cart != null && cart.Products != null) {
        $("#totalp,.cc-total-cart-number").val(cart.Products.length);
        $("#totalp,.cc-total-cart-number").text(cart.Products.length);
        UpdateTotalPrice();
    }
}


function checkout(IsGotoCart,IsFromCarClick) {

    

    //location.hash = 'checkout';
    $(window).on('resize', function () {

        $(".long-scroll").css({ 'min-height': (window.innerHeight) + "px", "position": "relative" });
    })


    cs.SetTop();

    if (cart.Products.length == 0) {
        buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" class="textAlignOpp" ><input type="button" class="uibutton special big" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
        cs.SetTop();
        jQuery.facebox('<div class=\'alert  alert-danger\'>' + Resources.NoProducts + '</div>' + buttons);
        return false;
    }
    $('[onclick="checkout()"]').popover('hide');
    //$(".cc-checkout-group").popover('hide');
    $(".icon-mobile-container").popover('hide');

    if ((IsGotoCart != undefined && (IsGotoCart == true || IsGotoCart == 'true') && (cart.CartPreviewEnabled == 'true' || cart.CartPreviewEnabled == true))
        || (cart.CartPreviewEnabled == 'false' || cart.CartPreviewEnabled == false || cart.CartPreviewEnabled == undefined)) {
        location.href = window.cc_page_info.cart_url;
        return;
    }
    

    
    // we have pure object!
    // now show dialog

    //jQuery.facebox(GetCheckoutContainers());
    //$("#facebox").css({ "position": "absolute", "-webkit-backface-visibility": "hidden" });
    //$("body,html").css("overflow", "hidden").css("position", "relative");
    //$(".cc-page-main-container").addClass("no-scroll");
    //$("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px" });

    //var divcont = document.createElement("div");
    //$(divcont).addClass("long-scroll").css({ 'min-height': (window.innerHeight) + "px", "position": "relative" });


    //$(".long-scroll").show();

    //$("body").append(divcont);
    //$(divcont).append($("#facebox_overlay")[0]);
    //$(divcont).append($("#facebox")[0]);

    if (cart.CartPreviewEnabled == 'true' || cart.CartPreviewEnabled == true) {

   

        if (IsFromCarClick == undefined) {
            $('[onclick="checkout()"]').popover({
                content: GetCartPreviewContainers(),
                placement: 'bottom',
                container: 'body',
                html: true

            });

            $('[onclick="checkout()"]').popover('show');

            //$(".cc-checkout-group").popover('show');
            $(".icon-mobile-container").popover('hide');
        }
    
   
        if (IsFromCarClick) {

            $(".icon-mobile-container").popover({
                content: GetCartPreviewContainers(),
                placement: 'bottom',
                container: 'body',
                html: true

            });

            $('[onclick="checkout()"]').popover('hide');

            $(".icon-mobile-container").popover('show');
            //$(".cc-checkout-group").popover('hide');
            
        }
    

        CallAjax('/Tab/CartPreview/', { data: JSON.stringify(cart, null, 2), orderId: cs.OrderId, lang: window.cc_page_info.store_current_lang_id }, null, null, function (msg) {

            //$("#popoverContainer").html(msg);
            $(".popoverContainer").html(msg);
            //if (typeof (onCheckoutDetails) != "undefined") { onCheckoutDetails.call(this); }

             //cs.UpdateSpinner(function () { cs.UpdateCartProducts(); });
            //cs.UpdateMaps();
            //findFaceboxCenter();        

            //$("#facebox").css({ "z-index": "999999" });
            //$("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px", 'z-index': '99999' });
            //$("#facebox_overlay").css({ 'overflow': 'auto' });

            //$("#cc-cart-title").focus();
            //$('[data-toggle="popover"]').prop('popShown', false).popover('hide');
        
            //$(".cc-checkout-group").find(":button").attr("data-content", msg);
            //if ($('[data-toggle="popover"]').prop('popShown') == undefined) {
            //    $('[data-toggle="popover"]').prop('popShown', true).popover({ container: 'body' });
            //}

        }, null, "POST");



    }

}



function onfaceboxClose() {
    //location.hash = '';
    $("body").append($("#facebox")[0]);
    $(".long-scroll").hide().remove();
    $("body,html").css("overflow", "auto").css("position", "static");
    $(".cc-page-main-container").removeClass("no-scroll");

}

function GetCartPreviewContainers(isNotincCheckout) {

    var html = '<div style="width:250px;"><label>' + Resources.CartPreview + '</label></div>' + '<div class="popoverContainer"><div style="text-align:center; padding:10px;"><img src="https://cdnw.wobily.com/system/loading.svg"/></div></div>';

    return html;

}

function GetCheckoutContainers(isNotincCheckout) {
    var checkout_cont = "";
    var checkout_cont_suffix = "";

    if (!isNotincCheckout) {
        checkout_cont = '<div class="textAlignLang" id="checkout_container"><div id="checkout_dialog_cont" class="cartstep"><div style="text-align:center; padding:10px;"><img src="https://cdnw.wobily.com/system/loading.svg"/></div></div>';
        checkout_cont_suffix = "</div>";
    }

    var html = checkout_cont + '<div id="cart_details" class="cc-hidden cartstep"></div><div id="cart_payment" class="cartstep cc-hidden"></div><div id="cart_confirm" class="cartstep cc-hidden"></div>' + checkout_cont_suffix;

    return html;
}

function findFaceboxCenter() {
    $("#facebox").css("width", "100%").css("left", "0");
}

function getArrAttrs(attrs, pId) {
    var arrAttrs = "";
    if (attrs != null && attrs.length > 0) {
        for (var i = 0; i < attrs.length; i++) {
            var val = pId + "~" + attrs[i].AttrId + "~" +
                attrs[i].OptionId + "~" + attrs[i].OptionText + "|";
            arrAttrs += val;
        }
    }
    return arrAttrs;
}

function addToCart(pid, img, title, price, isshare, dealType, customerMegalikeId, dealId, qty, attributes, pGuid, category,
    specialSettings, dealSecondChosenProduct) {

    
    //$.facebox.close();// Close prev dialogs(like min price dialog)
    if (!category) {
        category = $('.product').attr('data-catname');
    }
    cart.CartPreviewEnabled = $('.productdetailscont').attr('data-cartpreview');
    if (!qty)
        qty = 1;

   


    if (!attributes) {
        attributes = GetPrdAttrs(".p" + pid + ".attributes").ArrAttrs;
    }

    var actions = new Action();
    actions.IsLike = isLiked;
    actions.IsShare = isshare;
    var cartProduct = new Product(pid, attributes, actions, qty, title);
    cartProduct.CategoryName = category;
    cartProduct.Price = price;
    cartProduct.DealType = dealType;
    cartProduct.CustomerMegalikeId = customerMegalikeId;
    cartProduct.DealId = dealId;
    cartProduct.SaleDealAttrs = GetPrdAttrs('#deal-container-' + dealId).ArrAttrs;
    cartProduct.SpecialSettings = specialSettings;
    cartProduct.DealSecondChosenProduct = dealSecondChosenProduct;
    cartProduct.ExternalId = $(".product-sku").data("externalId");

    var prdInCart = isProductExistsInCart(cartProduct, cart);
    var actionType = "add";
    if (pGuid != null) {
        // product edit
        cartProduct.Guid = pGuid;
        cart.Products.push(cartProduct);
        actionType = "update";
    }
    if (prdInCart == null) {
        // new product in cart
        cartProduct.Guid = createGuid();
        cart.Products.push(cartProduct);
        actionType = "add";
    }
    else {
        // product exist in cart
        prdInCart.Qty = (parseInt(prdInCart.Qty) + parseInt(qty)).toString();
    }

    calculate();


    CartStorage.set(storeid, cart);
    UpdateTotalPrice();

    GlobalProductCartEvents.CallProductCartEvent(actionType, pid, title, category, price, qty, cart);
}



function createGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}
function UpdateTotalPrice() {

    if (window.store_settings &&
        typeof window.store_settings.DisplayTotalPriceOnCartIcon !== "undefined" &&
        window.store_settings.DisplayTotalPriceOnCartIcon != "" &&
        window.store_settings.DisplayTotalPriceOnCartIcon != null) {

        CallAjax('/Tab/CalcCartPrice/', { data: JSON.stringify(cart, null, 2), orderId: cs.OrderId, lang: window.cc_page_info.store_current_lang_id }, null, null, function (msg) {

            var price = msg.TotalPrice;
            if (window.store_settings.DisplayTotalPriceOnCartIcon.toLowerCase() == 'totalcartpricewithoutshipping') {
                price = msg.TotalPriceWithoutShipingPrice;
            }
            var txt = "(" + price + ' ' + window.cc_page_info.store_currency_symbol + ")";
            // desktop(and somw templats on mobile also)
            if ($('.cart_li #ttprice').length == 0) {
                $('.cart_li').append('<span id="ttprice">' + txt + '</span>')
            }
            else {
                $('.cart_li #ttprice').html(txt);
            }
            // Mobile
            if ($('.icon-mobile-container.cc-ecommerce-checkout #m-ttprice').length == 0) {
                $('.icon-mobile-container.cc-ecommerce-checkout').append('<span id="m-ttprice">' + txt + '</span>')
            }
            else {
                $('.icon-mobile-container.cc-ecommerce-checkout #m-ttprice').html(txt);
            }


        }, null, "POST");
    }
}
var cart_events = function () {
    return {
        onCheckout: null,
        onCustomerFields: null,
        onPaymentOptions: null,
        onConfirmationCompleted: null,
        onAddToCartMessage: null
    }
}();


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = $.trim(ca[i]);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays, domain) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    var path = "/";

    if (window.location.href.indexOf(appUrl) > -1) {
        path += storeid;
    }
    if (typeof (domain) == "undefined") {
        domain = "";
    }
    else {
        domain = ";domain=" + domain;
    }
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=" + path + domain;
}

function deleteCookie(name) {
    var path = "/";

    if (window.location.href.indexOf(appUrl) > -1) {
        path += storeid;
    }

    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=' + path;
};


$(window).resize(function () {
    findFaceboxCenter();
})

function CartStorage() {
}

CartStorage.Seprator = "|$%$|";
CartStorage.set = function (storeid, cart) {
    var key = "cart" + storeid;

    if (key.indexOf("cartcart") > -1) {
        key = key.replace("cartcart", "cart");
    }

    var val = encodeURIComponent(JSON.stringify(cart, null, 0));
    if (isSupportLocalStorage()) {
        // localStorage
        localStorage.setItem(key, val);
        //alert('localStorage');
    }
    else if (isSupportSessionStorage()) {
        // sessionStorage
        sessionStorage.setItem(key, val);
        //alert('sessionStorage');
    }
    else if (isSupportCookies()) {
        // Cookie
        setCookie(key, val, 1);
        //alert('Cookie');
    }
    else {
        // window.name
        window.name = key + CartStorage.Seprator + val;
        //alert('window.name');
    }
}
CartStorage.get = function (storeid) {
    var key = "cart" + storeid;

    if (key.indexOf("cartcart") > -1) {
        key = key.replace("cartcart", "cart");
    }

    var val = "";
    if (isSupportLocalStorage()) {
        // localStorage
        val = localStorage.getItem(key);
    }
    else if (isSupportSessionStorage()) {
        // sessionStorage
        val = sessionStorage.getItem(key);
    }
    else if (isSupportCookies()) {
        // Cookie
        val = getCookie(key);
    }
    else {
        // window.name
        if (window.name.indexOf(CartStorage.Seprator) > -1) {
            var arr = window.name.split(CartStorage.Seprator);
            if (arr[0] == key) {
                val = arr[1];
            }
        }
        return "";
    }
    return decodeURIComponent(val);
}
CartStorage.remove = function (storeid) {

    var key = "cart" + storeid;

    if (key.indexOf("cartcart") > -1) {
        key = key.replace("cartcart", "cart");
    }

    if (isSupportLocalStorage()) {
        // localStorage
        localStorage.removeItem(key);
    }
    else if (isSupportSessionStorage()) {
        // sessionStorage
        sessionStorage.removeItem(key);
    }
    else if (isSupportCookies()) {
        // Cookie
        deleteCookie(key);
    }
    else {
        // window.name
        if (window.name.indexOf(CartStorage.Seprator) > -1) {
            var arr = window.name.split(CartStorage.Seprator);
            if (arr[0] == key) {
                window.name = "";
            }
        }
    }

    if (typeof (cart) != "undefined") {
        cart.Products = [];
        $("#totalp").text("0");
    }
}
function DuplicateCartOk(cartJson, store_id) {
    confirm(heading, question, cancelButtonTxt, okButtonTxt, callback);
}
function DuplicateCart(cartJson, store_id) {
    showConfirmDialog(Resources.ThisWillDeleteAll, function () {

        // Empty cart
        CartStorage.remove("cart" + store_id);
        cart.OrderId = 0;
        cs.OrderId = 0;

        // Get the cart object
        var cartObj = JSON.parse(cartJson);

        // Car products loop
        for (var i = 0; i < cartObj.Products.length; i++) {
            var prd = cartObj.Products[i];
            addToCart(prd.Pid, prd.Image, prd.Title, prd.Price, prd.IsShare, prd.DealType,
                prd.CustomerMegalikeId, prd.DealId, prd.Qty, prd.Attrs, /*prd.Guid*/null,
                null, prd.SpecialSettings, prd.DealSecondChosenProduct);
        }
    });
}


;
(function ($) {

    $.extend({
        add2cart: function (source_id, target_id, callback) {
            var source = $(source_id);
            var target = $('#' + target_id);

            source_id = $(source_id).data("pid");

            var shadow = $('#' + source_id + '_shadow');
            if (!shadow.attr('id')) {
                $('body').prepend('<div id="' + source.data('pid') + '_shadow" class="mover" style="display: none; background-color: #ddd; border: solid 1px darkgray; position: static; top: 0px; z-index: 100000;">' + source.html() + '</div>');
                var shadow = $('#' + source.data('pid') + '_shadow');
            }

            if (!shadow) {
                alert('Cannot create the shadow div');
            }

            shadow.width(source.width()).height(source.css('height')).css('top', source.offset().top).css('left', source.offset().left).css('opacity', 0.5).show();
            shadow.css('position', 'absolute');

            shadow.animate({ width: target.innerWidth(), height: target.innerHeight(), top: target.offset().top, left: target.offset().left }, { duration: 300, complete: function () { $(this).hide(); } })
        .animate({ opacity: 0 }, { duration: 100, complete: callback });

        }
    });
})(jQuery);;
function formatNumber(number, decimalPlaces) {
    if (typeof decimalPlaces == 'undefined') {
        decimalPlaces = 2;
    }
    // 1. Parse the number string into a Number instance
    var actualNumber = Number(number);//+number.replace(/,/g, '');
    actualNumber = actualNumber.toFixed(2);
    // 2. Format the string to a given locale with a maximum of 2 decimal places
    //const formatted = actualNumber.toLocaleString('en-US', { maximumFractionDigits: decimalPlaces });
    const formatted = Math.round(actualNumber * 100) / 100;// actualNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted;
}

var megalikeDiag = null;
function setWinSize() {

    var h = $(".cc-page-main-container").outerHeight();

    if ($(".long-scroll").is(":visible")) {
        if (h < 1000) {
            h = 1000;
        }
    }

    var resizer;

    if (h < 700) {
        h = 700;
    }

    if (typeof (Wix) != "undefined") {
        Wix.setHeight(h + 100);
    }
    else if (typeof (FB) != 'undefined' && FB.Canvas) {
        FB.Canvas.setSize({ height: h + 150 });

        if (resizer != null)
            window.clearInterval(resizer);
    }
    else {

    }
}

var cs = function () {

    return {
        domobilecheckoutmenu: function () {

            var API = $("#mobile-menu").data("mmenu");
            API.close();
            checkout(true);
        },

        mmenusearch: function () {
            if ($(".mm-navbar-top").find(".cc-search-mobile-element").length == 0) {
                var o = document.createElement("div");
                $(o).addClass("cc-search-mobile-element").append("<form method='get' action='" + window.cc_page_info.store_root_url + "/Search'><input type='text' class='entry_form' name='q' placeholder='" + T.Global.Search + "...'/><button type='submit' class='cc-search-mobile-element-search-button'><i class='fa fa-search'></i></button>&nbsp;&nbsp;<button class='cc-search-mobile-element-close-button' type='button' onclick='cs.closemobilemenusearch()'><i class='fa fa-times'></i></button></form>");
                $(".mm-navbar-top").append(o);

                if (storeContext == "facebook") {
                    attachSuggest();

                    $(".cc-search-mobile-element-search-button").on("click.search", function (e) {
                        e.preventDefault();
                        return false;
                    })
                }
            }

            $(".cc-search-mobile-element").show();



        },

        closemobilemenusearch: function () {

            $(".cc-search-mobile-element").hide();

        },

        UpdateCatCamp: function (id) {

            $("[data-id=" + cc_oid + "]").addClass("active");

        },


        UpdateProdCamp: function (id, name, catname, e, text, category) {

            $("[data-id=" + category + "]").addClass("active");
            $("[data-id=" + cc_oid + "]").addClass("active");
        },

        LoadImageUploaderForAttribute: function (onFinish) {
            var that = this;

            $(".attribute-file-uploader").each(function (i, n) {

                var uploader = new qq.FileUploader({
                    // pass the dom node (ex. $(selector)[0] for jQuery users)
                    element: n,
                    // path to server-side upload script
                    action: "/Tab/UploadImage",

                    allowedExtensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'],

                    sizeLimit: 10500000 /*704800*/,

                    onComplete: function (id, fileName, responseJSON) {

                        if (responseJSON.success) {
                            that.ObjectImage(responseJSON.filename_thumb, n);
                            $("#" + n.id + " .qq-upload-list > li").remove();
                        }
                        else {
                            $("#" + n.id + " .qq-upload-list").show();

                        }

                        if (!responseJSON.success) {
                            $(".qq-upload-failed-text").html(Resources.Error);
                            return false;
                        }

                        $("#image" + $(n).data("id")).val(responseJSON.filename);


                    },
                    onSubmit: function (id, fileName) {
                        $("#" + n.id + " .qq-upload-list").show();
                        $("#" + n.id + " #piccont").remove();
                    }
                });



            });
        },

        UploadAgain: function (el, type) {
            var targetEl = null;
            if ($(el).closest(".piccont").length > 0) {
                targetEl = $(el).closest(".piccont")[0].id;
            }
            if (type == "del") { $(el).closest(".piccont").next().val(""); if (typeof (onUploadDelete) != "undefined") { onUploadDelete.call(this, el, $(el).closest(".piccont").next()); } }
            $("#" + (targetEl ? targetEl : "file-uploader") + " .qq-upload-list").hide();
            $("#" + (targetEl ? targetEl : "file-uploader") + " .qq-upload-list").prev().show();
            $("#" + (targetEl ? targetEl : "file-uploader") + " #piccont").remove();
        },

        ObjectImage: function (filename, targetEl) {

            $("#" + (targetEl.id)).append("<div id='piccont'><img src=\"" + filename + "\" class=\"hand\" alt=\"Image\" onclick=\"window.open(this.src)\" style=\"width:50px;vertical-align:top;\"/>&nbsp;&nbsp;<a href='javascript:void(0);' onclick='cs.UploadAgain(this)'>" + Resources.Change + "</a>|<a href='javascript:void(0);' onclick='cs.UploadAgain(this, \"del\")'>" + Resources.Delete + "</a></div>");
            $("#" + (targetEl.id) + " .qq-upload-list").prev().hide();
            $("#" + (targetEl.id) + " .qq-upload-list").hide();

        },

        BannerPicUrl: null,

        UpdateBanner: function (obj) {

            if (!obj || obj.data("banner") == "") {
                $("#banner img").attr("src", this.BannerPicUrl);
                return;
            }

            if (obj.data("banner") == $("#banner img").attr("src"))
                return;

            $("#banner img").attr("src", obj.data("banner"));

        },

        StopAllAjax: function () {
            $.xhrPool.abortAll();
        },

        SetTop: function () {


            if (typeof (FB) != "undefined" && FB && FB.Canvas) {
                FB.Canvas.scrollTo(0, 359);
                if (storeContext != "facebook") {
                    window.scroll(0, 0);

                    if (window.parent) {
                        window.parent.postMessage("set_scroll_top", "*");
                    }
                }
                else {
                    window.scroll(0, 0);


                }
            }
            else {
                window.scroll(0, 0);

                if (window.parent) {
                    window.parent.postMessage("set_scroll_top", "*");
                }

            }
            if (typeof (WixObject) != 'undefined') {
                Wix.scrollTo(0, 0);
            }

        },

        ClearSearchInput: function () {

            $(".entry_form").val("");

        },

        SendActionType: function (stype, pid) {
            var host = "";
            try {
                host = encodeURIComponent(window.location.href);
            }
            catch (e) { }

            window.open(appUrl + "/tab/GetPerm/publish_actions,email?productId=" + pid + "&host=" + host, "_blank", "width=400, height=400");
        },

        UpdateCategoriesListColor: function (id) {
            if (!id) {
                id = $("#catcbx").val();
            }

            $(".cat-showover").addClass("hidden");
            $("li").removeClass("cc-layout-nav-selected");


            if ($("li[data-id=" + id + "]").closest(".cat-showover").length > 0) {
                $("div.second-nav-ul li.active").removeClass("active");
                $("li[data-id=" + id + "]").addClass("active");


                $("li[data-id=" + id + "]").parents(".cat-showover").removeClass("cc-hidden");
                $("li[data-id=" + id + "]").parents("li").addClass("cc-layout-nav-selected");

            } else {

                $("div.second-nav-ul li.active, div.second-nav-ul li.active").removeClass("active");
                $("li[data-id=" + id + "]").addClass("active");
                //  this.SetTop();
            }
            this.Counter = 2;
            this.State = 0;
        },

        Counter: 2,
        State: 0, // pending
        PageSize: 9,

        GetMoreItems: function (url, isClearContainer, page, overrideIsPagerMode) {

            var that = this;

            if (!url) {
                return;
            }

            if (isClearContainer) {
                $("#innerstore").empty();
            }

            if (page && page > 0) {
                that.Counter = page;
            }




            if (that.State == 0) {
                that.State = 1; // progress

                var loading = $("<div id='loading_products'/>").html("<img src='https://cdnw.wobily.com/system/loading.svg'/>");
                $("#innerstore").append(loading[0]);

                CallAjax(url, { page: that.Counter, context: storeContext, isPreview: isPreview, IsPagerMode: overrideIsPagerMode ? true : isPager }, null, null, function (msg) {

                    $("#loading_products").remove();

                    if (msg == null || msg == "" || msg == "<div/>" || $(msg).find(".no-results").length > 0) {
                        that.State = 3;
                        $(".cc-load-more-items-container").addClass("hidden");
                        return false;
                    }

                    that.Counter += 1;
                    if (isClearContainer) {
                        $("#innerstore").append(msg);
                    }
                    else {
                        $("#innerstore .row:first").append(msg);
                    }


                    $(".needparse_fb:not(.rendered_fb)").addClass("rendered_fb").each(function (i, n) {
                        if (typeof (FB) != "undefined") {
                            FB.XFBML.parse(n);
                        }
                    })

                    setWinSize();

                    cs.RenderCycle();
                    loadImagesLoader();

                    that.State = 0;
                }, function () { });
            } else if (this.State == 3) {
                $(".cc-load-more-items-container").addClass("hidden");
            }

        },

        DefaultSideHeight: 0,

        CycleInterval: 0,

        RenderCycle: function () {
            var that = this;
            $(".prev.docycle .image-rotator").unbind("hover").hover(
                function () {

                    var pic1 = $(this).data("pic1");
                    var pic2 = $(this).data("pic2");
                    var pic3 = $(this).data("pic3");
                    var pic = $(this).data("original");
                    var arr = [];
                    var counter = 0;
                    var that = this;

                    if (pic1 && pic1 != "") {
                        arr.push(pic1);
                    }

                    if (pic2 && pic2 != "") {
                        arr.push(pic2);;
                    }

                    if (pic3 && pic3 != "") {
                        arr.push(pic3);
                    }


                    if (pic && pic != "") {
                        arr.push(pic);
                    }


                    that.CycleInterval = window.setInterval(function () {

                        var nexter = arr[counter++];

                        // change pic

                        $(that).prop('src', nexter);

                        if (counter == arr.length) {
                            counter = 0;
                        }

                    }, 1300);

                    $(this).data("cycleid", that.CycleInterval);

                },
                function () {

                    var pic = $(this).data("original");
                    $(this).prop("src", pic);
                    window.clearInterval($(this).data("cycleid"));
                }
            );

        },

        ShowVideo: function showvideo(url, vid) {
            this.SetTop();
            jQuery.facebox('<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/' + vid + '" /><param name="wmode" value="transparent" /><embed src="http://www.youtube.com/v/' + vid + '" type="application/x-shockwave-flash"wmode="transparent" width="425" height="350" /></object><br/><input type="button" class="uibutton special" value="' + Resources.CloseVideo + '" onclick="$(\'.close_image\').click()"/><br/><br/>');
        },

        StartMegalike: function (megalikeId, customerMegalikeId) {



            if (!megalikeDiag) {
                megalikeDiag = MessageDialog(Resources.EnjoyTheBenefit, "<div id='megalike_diag_cont'></div>", function () {
                    $(this).dialog('close');
                    //$("#megalike_diag_cont").closest(".ui-dialog").find(".ui-dialog-buttonpane button").show();
                }, 600, 200, false, false);
            }
            else {
                $(megalikeDiag).dialog('open');
            }
            CallAjax('/tab/ProductMegaLikeJoin/', { id: megalikeId, customerMegalikeId: customerMegalikeId }, 'megalike_diag_cont', null, function () {

                $(".tscrollbar").mCustomScrollbar({
                    scrollButtons: {
                        enable: false
                    },
                    theme: 'dark',
                    autoDraggerLength: false
                });

            }, null, "GET");

        },

        ValidateAttributes: function (container) {

            var isValid = true;
            $(container).find(".attr_cont:not(.hidden) [attr_required=1],input[name=dealtype]:checked  + label + div [attr_required=1]").removeClass("input-validation-error");

            $(".err-group").hide();


            $(container).find(".attr_cont:not(.hidden) [attr_required=1],input[name=dealtype]:checked + label + div [attr_required=1]").each(function (i, n) {
                if ($.trim($(n).val()) == ""
                    || $.trim($(n).val()) == "-1") {

                    if ($(n).data("error") != null && $(n).data("error") != "") {
                        $("#" + $(n).data("error")).addClass("alert alert-danger").slideDown();
                    }
                    else {
                        $(n).addClass("input-validation-error");
                    }
                    isValid = false;
                }
            });

            $(container).find(".attr_cont:not(.hidden) [group_required=1],input[name=dealtype]:checked + label + div [group_required=1]").each(function (i, n) {

                if (($(n).find(".cc-color-attr-input-hidden").length == 0 && $(n).find("input:checkbox:checked,input:radio:checked").length == 0) || ($(n).find(".cc-color-attr-input-hidden").length > 0 && $.trim($(n).find(".cc-color-attr-input-hidden").val()) == "-1")) {
                    $(n).find(".err-group").addClass("alert alert-danger").slideDown();
                    isValid = false;
                }
            });


            return isValid;
        },

        UpdateProductStatistic: function (productId, statisticsType, isInsert) {
            var form = merge_options({ productId: productId, statisticsType: statisticsType, isInsert: isInsert }, GetTokenStr());
            $.ajax({
                type: 'POST',
                url: '/tab/UpdateProductStatistic',
                data: form
            });
        },

        /* CART */
        CalculatePrices: function () {
            $("#checkout_container").mask(Resources.PleaseWait + "...");
            var form = this.PreperFormToSendAjax();
            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            $("#calculate_cont").html("<img src='/images/ajax-loader.gif' title=''/>");
            CallAjax('/tab/CalculateCartPricePartial/', form, null, null, function (response) {
                $("#calculate_cont").html(response);
                $("#totalpricenum").text($("#totalprice_calc").text());
                $("#checkout_container").unmask();

                if (cart.IsNotSupportAddress) {
                    cs.DisableNextButton();
                }

            }, null, "POST");
        },

        PreperFormToSendAjax: function () {

            for (var i = 0; i < cart.Products.length; i++) {
                if ($("#checkout_dialog_cont select.sel-qty").length > 0) {
                    if ($("#checkout_dialog_cont select.sel-qty")[i]) {
                        cart.Products[i].Qty = $("#checkout_dialog_cont select.sel-qty")[i].value;
                        //cart.Products[i].Guid = $("#checkout_dialog_cont input.digit").attr('data-guid');

                    }
                    else {
                        cart.Products[i].Qty = 1;
                        //cart.Products[i].Guid = $("#checkout_dialog_cont input.digit").attr('data-guid');
                    }
                }
            }

            if (cart.CustomerFields.CountryId < 1) {
                cart.DestinationId = $("#select_dest_list").length > 0 ? $("#select_dest_list").val() : /*0*/"-1";
            }

            if ($("input[name=CustomShipingId]:checked").length > 0) {
                cart.CustomShipingId = $("input[name=CustomShipingId]:checked").val();
            }

            cart.CustomerFields.Address2 = $("#Address2").val();
            cart.CustomerFields.Zip = $("#Zip").val();

            var form = $("#checkout_container input,#checkout_container select").serializeObject();
            form = merge_options(form, { data: JSON.stringify(cart, null, 2) });
            form = merge_options(form, { DestinationId: $("#select_dest_list").val() });
            form = merge_options(form, { IsSelfDelivery: (cart.IsSelfDelivery) }); //$("#select_dest_list").length == 0
            form = merge_options(form, { Instroductions: $("#instroductions").val() });
            form = merge_options(form, { orderId: this.OrderId });
            form = merge_options(form, { lang: lang });
            form = merge_options(form, { IsHideFirstStep: isHideFirststep });

            return form;
        },

        ChangeToSelfDelivery: function (e) {

            var that = this;
            if (cart.Products.length == 0) {
                $("#checkout_container").unmask();
                return false;

            }

            cart.IsSelfDelivery = true;
            cart.CustomerFields.Address = "";
            cart.CustomerFields.Address2 = "";
            cart.CustomerFields.Zip = "";

            cart.SelfPickupBranchId = $('input[name="SelfPickupBranch"]:checked').val();

            // fire self delivery event

            that.CalculatePrices();

            //CallAjax('/tab/SelfDeliveryPartial/', { store: storeid, lang: lang, IsHideFirstStep: isHideFirststep }, null, null, function (response) {
            //    $("#shipingoptions_cont").html(response);

            //}, null, "POST");
        },

        ChangeToShipingForm: function (e) {
            var that = this;
            if (cart.Products.length == 0) {
                $("#checkout_container").unmask();
                return false;
            }

            cart.IsSelfDelivery = false;
            that.UpdateShiping(function () {
                that.CalculatePrices();
            });
            $("#checkout_container").mask(Resources.PleaseWait + "...");

        },

        UpdateShiping: function (fn) {

            $("#checkout_container").mask(Resources.PleaseWait + "...");
            var that = this;
            var form = this.PreperFormToSendAjax();

            // fire self delivery event

            that.UpdateMaps();
            if (fn) { fn.call(that); };

            //CallAjax('/tab/ShipingFormPartial/', form, null, null, function (response) {

            //    $("#shipingoptions_cont").html(response);

            //    that.UpdateMaps();

            //    if (fn) { fn.call(that); };
            //    // $("#checkout_container").unmask();
            //}, null, "POST");
        },

        RenderProductWidgets: function () {
            cs.SetOnlyDigitsInput();
        },
        SetOnlyDigitsInput: function () {
            $('.input-only-digit').each(function (i, n) {
                //Enable only numbers
                $(n).inputFilter(function (value) {
                    return /^-?\d*[.,]?\d*$/.test(value);
                });
                var step = 0.5;
                var min = 0.5;
                if ($(n).hasClass("steponedigits")) {
                    step = 0.1;
                    min = 0;
                }

                if ($(n).data("multiplaction-step") != "" && $(n).data("multiplaction-step") != null) {
                    step = $(n).data("multiplaction-step");
                    min = 0;
                }
                //$(n).spinner({
                //    step: step, min: min, max: 999, increment: 'fast'
                //});
                var decimals = 0;
                if (step < 1) {
                    decimals = 2;
                }
                $(n).inputSpinner({ step: step, min: min, max: 999, decimals: decimals, groupClass: "spinx"/*, increment: 'fast'*/ })
            });
        },
        UpdateSpinner: function (callback) {
            var that = this;
            
            $('.sel-qty:not(.rendered)').each(function (i, n) {                
                $(n).off('change').change(function () {
                    var val_before_change = $(n).data('pre');//get the pre data
            
                    //alert('The option with value ' + $(n).val() + ' and pre ' + val_before_change);
                    var action = null;
                    if ($(n).val() > val_before_change) {
                        action = 'add';
                    } else if ($(n).val() < val_before_change)
                        action = 'remove';
                    //$(this).val(ui.value);
                    // update the value before the function
                    // $(this).val(ui.value); --> THIS IS OVERFLOW BUG!

                    cs.UpdateCartProducts();
                    if (action != null) {
                        GlobalProductCartEvents.CallProductCartEvent(action, $(n).attr('data-pid'), $(n).attr('data-title'), '', '', 1, cart);
                        console.log(action);
                    }
                        
                    $(n).data('pre', $(n).val());//update the pre data
                    $(n).addClass("rendered");//update the rendered data
                    //debugger;
                });
            });
            //$('.digit:not(.rendered)').each(function (i, n) {

            //    $(n).addClass("rendered").spinner({
            //        step: $(n).hasClass("stephalf") ? 0.5 : $(n).hasClass("steptwodigits") ? 0.1 : 1, min: 1, max: ($(n).data("max") ? $(n).data("max") : 1000), increment: 'fast', /*change*/spin: function (event, ui) {
            //            //if (callback) {
            //            //    callback.call(this);
            //            //}
            //            var action;

            //            if ($(this).val() < ui.value) {
            //                action = 'add';
            //            } else
            //                action = 'remove';
            //            $(this).val(ui.value);
            //            // update the value before the function
            //            // $(this).val(ui.value); --> THIS IS OVERFLOW BUG!

            //            cs.UpdateCartProducts();
            //            GlobalProductCartEvents.CallProductCartEvent(action, $(this).attr('data-pid'), $(this).attr('data-title'), '', '', 1, cart);
            //            console.log(action);
            //        }
            //    });

            //});


        },

        AutoCompleteBox: null,

        InitMaps: function (elId) {

            var that = this;
            var el = $("#" + elId)[0];

            if (el == null)
                return false;

            var options = {
                componentRestrictions: { country: $("#select_dest_list option:selected").data("code") },
                types: ['geocode']
            };

            var cloned = $(el).clone()[0];

            el.parentNode.replaceChild(cloned, el);

            $(el).remove();
            el = cloned;


            this.AutoCompleteBox = new google.maps.places.Autocomplete((el), options);

            $(el).blur(function (e) {
                var address = $("#txtDestCheck").val();
                if (cart.CustomerFields.Address != address) {
                    cs.CheckGeoWithoutAutoComplete(address, el);
                }
            });

            $(el).keyup(function (e) {
                if (e.keyCode == 13) {
                    var address = $("#txtDestCheck").val();
                    if (cart.CustomerFields.Address != address) {
                        cs.CheckGeoWithoutAutoComplete(address, el);
                    }
                }
            });

        },

        CheckGeoWithoutAutoComplete: function (address, el) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ "address": address }, function (results, status) {
                return cs.CheckGeo(el, address, results && results.length > 0 ? results[0] : null);
            })
        },

        CheckGeo: function (el, address, place) {

            var that = this;
            $("#errDescCheck").hide();
            $("#errDestSupport").hide();
            $("#destSuccessMessage").hide();

            $(el).removeClass("input-validation-error");
            $(".descCheckResultContainer").remove();

            if (!place) {
                place = that.AutoCompleteBox.getPlace();
            }


            if (place == null || !place.geometry) {

                // $(el).val("");
                that.UpdateMapsAddress(0, 0, "", "", "");
                $(el).addClass("input-validation-error");
                $("#errDescCheck").show();
                $("#destSuccessMessage").hide();
                $("#errDestSupport").hide();
                return false;
            }


            /* Loop through the address components for the selected place and fill
            the corresponding input fields in CRM */
            var streetString = "";

            for (i = 0; i < place.address_components.length; i++) {
                var type = place.address_components[i].types[0];
                if (type == 'street_number' /*|| type == 'route' || type == 'locality'*/) {
                    streetString = place.address_components[i].long_name + " ";
                }

            }


            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();

            // comment because "Daburiyya" -> no street number in this place
            //if (!streetString || streetString == "") {
            //    //$(el).blur();
            //    setTimeout(function () {
            //        that.UpdateMapsAddress(0, 0, "", "", "");
            //        $(el).addClass("input-validation-error");
            //        $("#errDescCheck").show();
            //        $("#errDestSupport").hide();
            //        $("#destSuccessMessage").hide();
            //    }, 0);

            //    return false;
            //}


            $(el).data("lat", lat);
            $(el).data("lng", lng);

            cart.IsFallbackAddress = false;

            that.UpdateMapsAddress(lat, lng, parseInt($("#select_dest_list").val()), address, $("#Address2").val());

            var isSupported = that.CheckIsAddressSupported();



        },

        CheckIsAddressSupported: function () {
            var form = this.PreperFormToSendAjax();
            var that = this;
            $("#checkout_container").mask(Resources.PleaseWait + "...");

            CallAjax('/tab/IsAddressSupported/', form, null, null, function (response) {

                if (response.IsSupport) {

                    cart.IsNotSupportAddress = false;
                    that.EnableNextButton();
                    $("#destSuccessMessage").show();
                    $("#errDestSupport").hide();
                    $("#errDescCheck").hide();
                    var arr = response.Set.reverse();
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].IsSupport) {
                            cart.DestinationId = arr[i].CountryId;
                            cart.CustomerFields.CountryId = arr[i].CountryId;
                            break;
                        }
                    }

                    that.UpdateShiping(function () {
                        that.CalculatePrices();
                    });

                }
                else {
                    cart.IsNotSupportAddress = true;
                    $("#destSuccessMessage").hide();
                    $("#errDestSupport").show();
                    that.DisableNextButton();

                    that.UpdateShiping(function () {
                        that.CalculatePrices();
                    });
                }
            }, function () {
                cart.IsNotSupportAddress = true;
                $("#checkout_container").unmask();
                $("#destSuccessMessage").hide();
                $("#errDestSupport").show();
                that.DisableNextButton();
            }, "POST");



        },

        UpdateMapsAddress: function (lat, lng, country, address, address2) {
            cart.CustomerFields.Lat = lat;
            cart.CustomerFields.Lng = lng;
            cart.CustomerFields.CountryId = country;
            cart.CustomerFields.Address = address;
            cart.CustomerFields.Address2 = address2;
        },

        UpdateMaps: function () {

            this.InitMaps("txtDestCheck");
        },

        UpdateCartProducts: function () {
            var that = this;


            $("#cart_products_cont .digit").each(function (i, n) {
                if (isNaN($(n).val())) {
                    $(n).val("1");
                    return false;
                }
                else if ($.trim($(n).val()) == "") {
                    $(n).val("1");
                    return false;
                }
                else {
                    if (parseInt($(n).val()) < 0) {
                        $(n).val("1");
                        return false;
                    }
                }
            });

            $("#checkout_container").mask(Resources.PleaseWait + "...");
            var form = this.PreperFormToSendAjax();
            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            CallAjax('/tab/CartProductsPartial/', form, null, null, function (response) {
                $("#cart_products_cont").html(response);

                that.UpdateSpinner(/*function () { cs.UpdateCartProducts(); }*/);

                if ($("#CuponCode").val() != "") {
                    that.GetCupon($("#btnGetCupon")[0], cart.StoreId, false, true/*dontRefreshProducts*/, true/*dontCalculatePrices*/);
                }

                if (cart.IsSelfDelivery) {
                    that.ChangeToSelfDelivery();
                }
                else {
                    that.UpdateShiping(function () {
                        that.CalculatePrices();
                        CartStorage.set(storeid, cart);
                        //localStorage.setItem("cart" + storeid, JSON.stringify(cart, null, 0));
                        //setCookie("cart" + storeid, JSON.stringify(cart, null, 0), 1);
                    });
                }

            }, null, "POST");
            var frmShip = { data: JSON.stringify(cart, null, 2) };
            frmShip = merge_options(frmShip, { lang: window.cc_page_info.store_current_lang_id });
            CallAjax('/tab/ShipingOptionsPartial/', frmShip, null, null, function (response) {
                $("#shiping_cont").html(response);
            }, null, "POST");
        },

        RefreshCartProducts: function () {
            var that = this;


            $("#cart_products_cont .digit").each(function (i, n) {
                if (isNaN($(n).val())) {
                    $(n).val("1");
                    return false;
                }
                else if ($.trim($(n).val()) == "") {
                    $(n).val("1");
                    return false;
                }
                else {
                    if (parseInt($(n).val()) < 0) {
                        $(n).val("1");
                        return false;
                    }
                }
            });

            $("#checkout_container").mask(Resources.PleaseWait + "...");
            var form = this.PreperFormToSendAjax();
            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            CallAjax('/tab/CartProductsPartial/', form, null, null, function (response) {

                $("#cart_products_cont").html(response);

                that.UpdateSpinner(function () { cs.UpdateCartProducts(); });
                //$("#checkout_container").unmask();

            }, null, "POST");

        },

       
        DeleteProductFromCart: function (items) {
            items.forEach(function (item) {
                var guid = item.guid;
                var id = item.id;
                var isDeleted = false; // Reset for each item

                // Try to delete by GUID
                for (var i = 0; i < cart.Products.length; i++) {
                    if (cart.Products[i].Guid == guid) {
                        GlobalProductCartEvents.CallProductCartEvent('remove', cart.Products[i].Pid, '', '', '', cart.Products[i].Qty, cart);
                        cart.Products.splice(i, 1);
                        isDeleted = true;
                        break;
                    }
                }

                // If not deleted by GUID, try deleting by PID (backward compatibility)
                if (!isDeleted) {
                    for (var i = 0; i < cart.Products.length; i++) {
                        if (cart.Products[i].Pid == id) {
                            GlobalProductCartEvents.CallProductCartEvent('remove', cart.Products[i].Pid, '', '', '', cart.Products[i].Qty, cart);
                            cart.Products.splice(i, 1);
                            break;
                        }
                    }
                }

                // Remove the element from the DOM
                $(".checkout-table .checkout-item." + guid).remove();
            });

            // Update cart total count
            $("#totalp,.cc-total-cart-number").text(cart.Products.length);

            // Update cart after all deletions
            this.UpdateCartProducts();
        }
,


        ClearMapsAddress: function () {
            $("#txtDestCheck").val("");
            cart.CustomerFields.Address = "";
            cart.DestinationId = 0;
            cart.CustomerFields.CountryId = 0;
        },

        ChangeDestination: function (dropDownEl) {
            $(dropDownEl).removeClass("input-validation-error");

            if ($(dropDownEl).val() == "-1") {
                $("#destinations_details").hide();
                $(dropDownEl).addClass("input-validation-error");
                return false;
            }

            $("#destinations_details").show();

            cart.IsNotSupportAddress = false;
            cart.IsFallbackAddress = false;

            if (cart.Products.length > 0
                && $(".errorqty:visible").length == 0) {
                this.EnableNextButton();
            }

            this.ClearMapsAddress();
            this.UpdateShiping();
            this.CalculatePrices();
        },

        GotoCustomerFields: function (e, isDonotloadAjaxAgain, isDonotNextStep) {

            if (typeof (storeContext) != "undefined" && (storeContext == "iframe")) {
                if (typeof (cs) != "undefined") {
                    cs.SetTop();
                }
            }

            $("#cbx_choose_shiping_option").removeClass("input-validation-error");

            if (this.IsDisabledNext) {
                return false;
            }

            if ((cart.ShipingOption == 0 || !cart.ShipingOption) && $("#cbx_choose_shiping_option").length > 0) {
                $("#cbx_choose_shiping_option").addClass("input-validation-error");
                return false;
            }
            if ($('#cbx_choose_shiping_option').val() == "3"/* Self delivery */ &&
                $('input[name="SelfPickupBranch"]').length > 0 /*Has branches*/ &&
                $('input[name="SelfPickupBranch"]:checked').length == 0/* Not checked*/) {

                // no collection point was selected
                $('#shiping_self_branch_cart_error').show();
                return false;
            }
            else {
                // OK
                $('#shiping_self_branch_cart_error').hide();
            }
            if (!GlobalShipingValidationEvents.CallSValidationEvent(cart.ShipingOption)) {
                return false;
            }
            if (cart.ShipingOption == 4 && $("#cbx_choose_shiping_option").length > 0) { // UPS
                if (!$('.ups-pickups-result').is(":visible")) {
                    // no collection point was selected
                    $('#shiping_ups_cart_error').show();
                    return false;
                }
                else {
                    // OK
                    $('#shiping_ups_cart_error').hide();
                }
            }
            if ((cart.ShipingOption == 50 || cart.ShipingOption == 60 || cart.ShipingOption == 200) && $("#cbx_choose_shiping_option").length > 0) { // RUN
                if (!$('.run-pickups-result').is(":visible")) {
                    // no collection point was selected
                    $('#shiping_run_cart_error').show();
                    return false;
                }
                else {
                    // OK
                    $('#shiping_run_cart_error').hide();
                }
            }
            if (cart.ShipingOption == 2 && $("#cbx_choose_shiping_option").length > 0) { // shiping to address validate

                if ($("#select_dest_list").length > 0 && $("#txtDestCheck").length > 0/*builder*/) {
                    if (!this.ValidateDestInput($("#select_dest_list")[0])) {
                        focusElement(true, "#select_dest_list");
                        return false;
                    }


                }
                if ($("#select_dest_list").length > 0 && $("#txtDestCheck").length == 0/*old site*/) {
                    if (!this.ValidateOldDestInput($("#select_dest_list")[0])) {
                        return false;
                    }


                }
                if ($("#txtDestCheck").length > 0) {
                    if (!this.ValidateAddressInput($("#txtDestCheck")[0])) {
                        return false;
                    }

                    if ($("#errDescCheck").is(":visible")) {
                        return false;
                    }
                }
            }

            if ($("#storeterms_cbx").length > 0) {
                $("#storeterms_cbx").removeClass("input-validation-error");
                $("#storeterms_cbxlbl").removeClass("red");
                $("#storeterms_error").hide();

                if (!$("#storeterms_cbx").is(":checked")) {
                    $("#storeterms_cbx").addClass("input-validation-error");
                    focusElement(true, "#storeterms_cbx");

                    $("#storeterms_cbxlbl").addClass("red");
                    $("#storeterms_error").slideDown();
                    return false;
                }
            }

            cart.CustomerFields.Instroductions = $("#instroductions").length > 0 ? $("#instroductions").val() : "";

            if ($("#txtDestCheck").length > 0) {
                cart.CustomerFields.Address = $("#txtDestCheck").val();
                cart.CustomerFields.Address2 = $("#Address2").val();
                cart.CustomerFields.Zip = $("#Zip").val();
            }
            if ($('#cbx_choose_shiping_option').val() == "3"/* Self delivery */ &&
                $('input[name="SelfPickupBranch"]').length > 0 /*Has branches*/) {

                cart.SelfPickupBranchId = $('input[name="SelfPickupBranch"]:checked').val();
            }
            var savedCustomerDetails = CartStorage.get("cartFields");
            if (savedCustomerDetails != 'null') {

                var savedCustomerDetailsObj = JSON.parse(savedCustomerDetails);
                var cartObj = JSON.parse(savedCustomerDetailsObj.data);

                cart.CustomerFields.FirstName = cartObj.CustomerFields.FirstName;
                cart.CustomerFields.LastName = cartObj.CustomerFields.LastName;
                cart.CustomerFields.Phone = cartObj.CustomerFields.Phone;
                cart.CustomerFields.Email = cartObj.CustomerFields.Email;
                cart.CustomerFields.Address = cartObj.CustomerFields.Address;
                cart.CustomerFields.Address2 = cartObj.CustomerFields.Address2;
                cart.CustomerFields.Zip = cartObj.CustomerFields.zip;
                cart.CustomerFields.City = cartObj.CustomerFields.City;
                cart.CustomerFields.Street = cartObj.CustomerFields.Street;
                cart.CustomerFields.HouseNum = cartObj.CustomerFields.HouseNum;
                cart.CustomerFields.ShowDifferentCompanyNameForInvoice = cartObj.CustomerFields.ShowDifferentCompanyNameForInvoice;
                cart.CustomerFields.CompanyName = cartObj.CustomerFields.CompanyName;
                cart.CustomerFields.CompanyNumber = cartObj.CustomerFields.CompanyNumber;
                cart.CustomerFields.IdentityNumber = cartObj.CustomerFields.IdentityNumber;

            }

            // shiping event
            //cart.ShipingArgs = [];
            GlobalShipingEvents.CallShipingEvent();


            var form = this.PreperFormToSendAjax();
            var that = this;

            if (cart.Products.length == 0) {
                return false;
            }
            if (!this.ValidateQty()
                || $("#deliver-error").length > 0) {
                cs.DisableNextButton();
                return false;
            }

            if (isDonotloadAjaxAgain
                && $.trim($("#cart_details").html()) != "") {
                that.Stepbar_gotoDetails();
                return;
            }

            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            //console.log(cart);
            CartStorage.set("cartFields", form);

            var redLink = window.cc_page_info.cart_CustomerFieldsPage_url;
            location.href = redLink;

            /*$("#checkout_container").mask(Resources.PleaseWait);
            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            CallAjax('/tab/CustomerFields/', form, null, null, function (response) {
                $("#cart_details").html(response);

                if (!isDonotNextStep) {
                    that.Stepbar_gotoDetails();
                }

                $("#checkout_container").unmask();
                findFaceboxCenter();
                $('#cbx_payment').focus();
                if (cart_events.onCustomerFields) {
                    cart_events.onCustomerFields.call(this);
                }
                try {
                    GlobalCartEvents.CallCartEvent(storeContext, CartStep.DETAILS1, null, null, null, cart);
                } catch (e) {

                }

            }, null, "POST");*/

        },

        FieldsForm: function (e) {
            try {
                GlobalCartEvents.CallCartEvent(storeContext, CartStep.DETAILS2, null, null, null, cart);
            } catch (e) {

            }
            $("#facebooklogincont").slideUp();
            $("#fields_cont").slideDown();
            $("#dynamic_payment_ajax").show();
            // $("#c_fields #FirstName").focus();
        },

        CurrentStep: function () {
            return $("ul.progress_bar > li.selected").data("step");
        },

        SaveCustomerFields: function () {

            cart.CustomerFields.FirstName = $("#FirstName").val();
            cart.CustomerFields.LastName = $("#LastName").val();
            cart.CustomerFields.Phone = $("#Phone").val();
            cart.CustomerFields.Email = $("#Email").val();
            cart.CustomerFields.Address = $("#Address").val();
            cart.CustomerFields.Address2 = $("#Address2").val();
            cart.CustomerFields.Zip = $("#Zip").val();
            cart.CustomerFields.City = $("#City").val();
            cart.CustomerFields.CityId = $("#CityId").val();
            cart.CustomerFields.Street = $("#Street").val();
            cart.CustomerFields.StreetId = $("#StreetId").val();
            cart.CustomerFields.HouseNum = $("#HouseNum").val();
            cart.CustomerFields.ShowDifferentCompanyNameForInvoice = $("#ShowDifferentCompanyNameForInvoice").val();
            cart.CustomerFields.CompanyName = $("#CompanyName").val();
            cart.CustomerFields.CompanyNumber = $("#CompanyNumber").val();
            cart.CustomerFields.IdentityNumber = $("#IdentityNumber").val();
            //console.log("Cart::"+cart);

            var form = this.PreperFormToSendAjax();

            form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
            //CartStorage.remove("cartFields");
            CartStorage.set("cartFields", form);
        },

        Stepbar_gotoCart: function (e, isSaveBefore) {

            this.SaveCustomerFields();

            location.href = window.cc_page_info.cart_url;
            //$(".cartstep").hide();
            //$("#checkout_dialog_cont").show();

        },

        Stepbar_gotoDetails: function (e, isSaveBefore) {
            if (this.CurrentStep() < 2 && isSaveBefore) {
                this.GotoCustomerFields(this, isSaveBefore);
                return;
            }

            $(".cartstep").hide();
            $("#cart_details").show();
        },

        Stepbar_Confirmation: function (e) {
            $(".cartstep").hide();
            $("#cart_confirm").show();
        },

        ValidateQty: function () {
            if ($(".errorqty").length > 0) {
                this.DisableNextButton();
                return false;
            }
            else {
                this.EnableNextButton();
                return true;
            }
        },

        IsDisabledNext: false,

        DisableNextButton: function () {
            $("input.continueCartBtn").addClass("inactive-button").attr("disabled", "disabled");
            this.IsDisabledNext = true;
        },

        EnableNextButton: function () {
            if (cart.Products.length == 0) {
                return false;
            }

            $("input.continueCartBtn").removeClass("inactive-button").removeAttr("disabled");
            this.IsDisabledNext = false;
        },

        OrderId: 0,
        UpdateOrderId: function (id) {
            this.OrderId = id;
        },
        RedirectToCheckoutCompleted: function (orderId) {
            if (cp != null && typeof cp != 'undefined' &&
                cp.current_win != null && typeof cp.current_win != 'undefined' &&
                cp.current_win.closed == false) {
                try {
                    // Close the charge window if it is open, probably iframe like meshulam
                    cp.current_win.close();
                }
                catch (err) {
                    console.error(err.message);
                }

            }
            if (storeContext == "facebook") {
                this.CompletePayment(orderId);
                return;
            }
            if (isMobile) {
                document.write('<img style="margin:auto;display: block;" src="https://cdnw.wobily.com/system/loading.svg"/>');
            }
            else {
                $("#checkout_container").mask(Resources.ConfirmOrder + "...");
            }

            var s = "";

            url_data_display = storeUrl + "/Tab/CheckoutCompleted?OrderId=" + orderId;
            window.location.href = url_data_display;
        },
        CompletePayment: function (orderId) {

            if ($("#cart_confirm").is(":visible")) {
                return false;
            }

            $("#checkout_container").mask(Resources.ConfirmOrder + "...");
            var that = this;
            CallAjax('/tab/OrderCompleted/', { orderId: orderId, lang: lang, IsHideFirstStep: isHideFirststep }, null, null, function (response) {
                $("#cart_confirm").html(response);
                that.Stepbar_Confirmation();
                $("#checkout_container").unmask();
                findFaceboxCenter();
            }, null, "POST");
        },

        OpenFacebookLogin: function () {

            var host = "";
            try {
                host = encodeURIComponent(window.location.href);
            }
            catch (e) { }

            window.open(appUrl + "/Tab/FacebookConnect/?pageid=" + PageId + "&host=" + host, "_blank", "width=400, height=400");
        },

        FacebookLoginCallback: function (facebookid, token, customerId, fname, lname, email, isAutofill) {
            $("#fields_cont input#FirstName").val(fname);
            $("#fields_cont input#LastName").val(lname);
            $("#fields_cont input#Email").val(email);
            this.FieldsForm();
            fbid = facebookid;

            $("#c_fields").css("width", "83%").addClass("left");
            $("#fbImg").css("width", "14.5%").css("margin-" + (store_dir && store_dir == "rtl" ? "left" : "right"), "10px").show().find("img").attr("src", "https://graph.facebook.com/v2.8/" + fbid + "/picture?type=large");
        },

        ChangeSelfCartLanguage: function (lang) {
            $("#checkout_container").mask(Resources.PleaseWait);
            window.location = "/" + storeid + "/SelfCheckout?cscart=" + cscart + "&lang=" + lang;
        },

        MegalikeAfterFacebookCallback: function (token, id, customerId) {
            CallAjax("/Tab/ProductMegaLikeJoin", { token: token, megalikeId: id, customerId: customerId }, "megalike_diag_cont", null, null, null, "POST");
        },

        ShowContinueDialog: function (pid) {
            var buttons = '<div class="cc-continue-dialog">' +
                '<div class="right">' +
                '<input type="button" class="button" tabindex="10" value="' + Resources.CloseAndContinueBuying + '" onclick="$(\'.close_image\').click()"/> <input type="button" class="button continue diag-pay-now" tabindex="11"  onclick="checkout(true)"  value="' + T.Global.SecurePayment + '"/>' +
                '</div>' +
                '<div class="left">' +
                '<img class="secure-img" alt="Secure payment" src="https://cdnw.wobily.com/system/SECURE-PAYMENT-BLACK.png" />' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>';
            cs.SetTop();
            jQuery.facebox('<div class="padd continue-dialog-txt"><i class="fa fa-check" style="color:green;"></i> ' + Resources.ProcuctWasAddToCart + '<br/><br/> </div><div id="upsale_products"></div>' + buttons + "<script> if (cart_events.onAddToCartMessage) { cart_events.onAddToCartMessage.call(this); }</script>");


            CallAjax('/tab/upSaleProducts/', { lang: window.cc_page_info.store_current_lang_id, pid: pid }, 'upsale_products', null, function (response) {
                if ($.trim(response) != '') {
                    var prev_text = $("#upsale_products").html();
                    var new_text = "<hr/>" + $("#upsale_products").html();
                    $("#upsale_products").html(new_text)
                    $(".small-prd-list").mCustomScrollbar({ scrollbarPosition: "inside", setHeight: $('.small-product').height() + 30, mouseWheelPixels: 50, scrollInertia: 10 });
                }
            }, null, "GET");

        },
        ShowUpSellDialog: function () {

            cs.SetTop();
            //jQuery.facebox('<div class="padd up-sell-dialog-txt"> <div id="upsale_products_diag"></div></div>');
            if (!diag_123) {
                diag_123 = MessageDialog(Resources.ChooseShipingDestination, "<div class='padd up-sell-dialog-txt'><div id='upsale_products_diag'></div></div>", function () {


                    $(this).dialog('close');
                }, 500, 200, false, true);
            }
            else {
                $(diag_123).dialog("open");
            }
            CallAjax('/tab/upSaleProducts/', { lang: window.cc_page_info.store_current_lang_id }, 'upsale_products_diag', null, function (response) {
                if ($.trim(response) != '') {

                    $("#upsale_products_diag").html(new_text)
                    $(".small-prd-list").mCustomScrollbar({ scrollbarPosition: "inside", setHeight: $('.small-product').height() + 30, mouseWheelPixels: 50, scrollInertia: 10 });
                }
            }, null, "GET");

        },
        CancelCupon: function (el, id) {
            $("#CuponCode").val('');
            this.GetCupon(el, id, true);
        },
        GetCupon: function (el, id, isCancel, dontRefreshProducts, dontCalculatePrices) {
            $("#checkout_container").mask(Resources.PleaseWait);

            var form = this.PreperFormToSendAjax();
            var that = this;
            var value = $.trim($("#CuponCode").val());

            if (isCancel == false && (value == null || value == "")) {
                $("#checkout_container").unmask();
                return false;
            }

            form = merge_options({ value: value, id: id }, form);

            $(el).attr("disabled", "disabled");
            // fire get cupon event
            GlobalClicksEvents.CallClickEvent(storeContext, 'get_cupon', 'click');
            CallAjax("/Tab/GetCupon", form, null, null, function (response) {

                $("#cupon_message").html(response);
                $(el).removeAttr("disabled");
                cart.CuponCode = value;

                if (typeof dontRefreshProducts == 'undefined' || dontRefreshProducts == false) {
                    cs.RefreshCartProducts();
                }
                if (typeof dontCalculatePrices == 'undefined' || dontCalculatePrices == false) {
                    cs.CalculatePrices();
                }
                if ($('<div>' + response + '</div>').find('.red').length > 0) {
                    // fire invalid cupon event
                    GlobalClicksEvents.CallClickEvent(storeContext, 'invalid_cupon', 'click');
                }
                else {
                    // fire cupon success event
                    GlobalClicksEvents.CallClickEvent(storeContext, 'cupon_success', 'click');
                }

            }, function () {
                alert("Error. please try again");
                $("#cupon_message").html(Resources.OopsAnErrorOccurred);
                $(el).removeAttr("disabled");

            }, "POST");

            cs.UpdateSpinner(function () { cs.UpdateCartProducts(); });
        },

        GetCuponTerms: function () {

        },
        CancelRedeemPointsValue: function (el, id) {
            //$("#customersClubPointsGetValue").val(0);
            $("#customersClubPointsInput").val(0);
            this.GetRedeemPointsValue(el, id, true);
        },
        GetRedeemPointsValue: function (el, id, isCancel) {
            $("#checkout_container").mask(Resources.PleaseWait);

            var form = this.PreperFormToSendAjax();
            var that = this;
            //var value = $.trim($("#customersClubPointsGetValue").val());
            var points = $.trim($("#customersClubPointsInput").val());


            if (isCancel == false && (points == null || points == "" || points == 0 || !$.isNumeric(points))) {
                $("#checkout_container").unmask();
                return false;
            }
            cart.customerClubUsedPoints = points;
            form = merge_options(form, { data: JSON.stringify(cart, null, 2) });
            form = merge_options({ value: 0, id: id, points: points }, form);

            $(el).attr("disabled", "disabled");
            CallAjax("/Tab/GetRedeemPointsValue", form, null, null, function (response) {

                $("#customers_club_message").html(response);
                $(el).removeAttr("disabled");
                //cart.customerClubDiscountValue = value;
                cart.customerClubUsedPoints = points;


                cs.RefreshCartProducts();
                //if (!isDonotCalculatePricesAgain) {
                cs.CalculatePrices();
                //}
                if ($('<div>' + response + '</div>').find('.red').length > 0) {
                    // fire invalid cupon event
                    GlobalClicksEvents.CallClickEvent(storeContext, 'invalid_customer_club', 'click');
                }
                else {
                    // fire cupon success event
                    GlobalClicksEvents.CallClickEvent(storeContext, 'customer_club_success', 'click');
                }

            }, function () {
                alert("Error. please try again");
                $("#customers_club_message").html(Resources.OopsAnErrorOccurred);
                $(el).removeAttr("disabled");

            }, "POST");

            cs.UpdateSpinner(function () { cs.UpdateCartProducts(); });
        },
        // this method to get more items within page scroll down on categories. 
        GetCurrentUrl: function () {

            var currerntbaseurl = cc_page_info.browser_root_url + "/";

            if (domain_type != "Valoreti") {
                currerntbaseurl += "Tab/";
            }

            var val = cc_oid;
            if (val == -2) { // popular
                val = "HotProducts";
            }
            else if (val == -3) { // popular
                val = "NewProducts";
            }
            else if (val == 0) { // popular
                val = "Deals";
            }
            else {
                val = "Category/" + val;
            }
            var url = currerntbaseurl + val;
            return url;
        },

        GetScrollItems: function (windowHeight, callerEl) {

            if (!isPager) {
                if ($("#innerstore .product").length > 8 && cc_type == "category") {
                    var url = this.GetCurrentUrl();

                    if (url) {
                        $(callerEl).parent().hide();
                        cs.GetMoreItems(url);
                        $("#innerstore").append($(callerEl).parent().show());
                        //lazyImagesLoad();

                    }


                }

            }
        },

        GetMoreItemsButton: function () {

            return $("<div/>").addClass("cc-more-items-button").addClass("btn").addClass("btn-default").val("טען עוד פריטים");

        },

        CheckSPagecroll: function () {

            if (typeof storeContext != 'undefined' && storeContext == "facebook") {
                window.setInterval(function () {
                    if (typeof (FB) != "undefined") {
                        FB.Canvas.getPageInfo(
                            function (info) {
                                cs.GetScrollItems(info.clientHeight + info.scrollTop);
                            }
                        );
                    }
                }, 500);
            }
            else if (storeContext == null || storeContext != "iframe") {

                window.setInterval(function () {
                    var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

                    cs.GetScrollItems($(window).height() + top);
                }, 500);
            }

        },

        SendToFriendDialog: function (url) {
            FB.ui({
                method: 'send',
                link: url
            });
        },

        NavigateSelect: function (value, e, isHome) {

            var secType = $(e).find("option:selected");

            switch (secType.data("type")) {
                case "Category":
                case "Sub_Category":
                    if (value == '-3') {
                        cs.GotoNewProducts();
                    }
                    else if (value == '-2') {
                        cs.GotoPopularProducts();
                    }
                    else if (value == '0') {
                        cs.GotoDeals();
                    }
                    else {
                        cs.GotoCategory(value, 1);
                    }

                    if (!isHome) {
                    }
                    else {
                        $(".nav-cat").show().unbind("click").bind("click", function () { cs.NavigateSelect(value, e, false); }).text($(e).find("option[data-default]").text());
                        $(".nav-cat").show().prev().show();
                        $("#catcbx").val($("#catcbx option[data-default]").val());
                    }
                    break;
                case "Product":
                    cs.GotoProduct(value, e, "", "", secType.data("permalink"));
                    $("#catcbx").val(value);
                    break;
                case "CMS":
                    cs.GoToLandingPage(value, null, secType.data("permalink"));
                    $("#catcbx").val(value);
                    break;
            }


            $(".nav-prod").hide();

            if ($(".nav-prod").prev() != null) {
                $(".nav-prod").prev().hide();
            }

        },

        ShowAttrImages: function (id) {
            var buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" class="uibutton special big right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';

            $.facebox('<div class="padd" style="width:100%; padding: 30px 15px;" id="attr_images_cont">' + '' + '</div>' + buttons);

            CallAjax('/Tab/AttributeImagesDialog/', { id: id }, "attr_images_cont", null, function () {

            }, function () { });


        },

        ShowSipingFormFallback: function (e, store_id) {
            var countryId = parseInt($("#select_dest_list").val());
            var that = this;
            var countryCode = $("#select_dest_list option:selected").data("code");

            if (!diag_ShowSipingFormFallback) {
                diag_ShowSipingFormFallback = MessageDialog(Resources.ChooseShipingDestination, "<div id='dest_fallback'></div>", function () {

                    if (!that.ValidateAddressInput($("#fallbackAddressText")[0])) {

                        return false;
                    }

                    var address = $("#fallbackAddressText").val();
                    var address2 = $("#Address2").val();
                    var zip = $("#Zip").val();

                    var selectedDescFallback = $("input[name=dest_fallback_box]:checked").val();

                    $("#txtDestCheck").val(address);
                    cart.DestinationId = selectedDescFallback;
                    cart.CustomerFields.Address = address;
                    cart.CustomerFields.Address2 = address2;
                    cart.CustomerFields.Zip = zip;
                    cart.CustomerFields.CountryId = selectedDescFallback;
                    cart.IsNotSupportAddress = false;
                    cart.IsFallbackAddress = true;
                    that.EnableNextButton();
                    that.UpdateShiping(function () {
                        that.CalculatePrices();
                    });
                    $(this).dialog('close');
                }, 500, 200, false, true);
            }
            else {
                $(diag_ShowSipingFormFallback).dialog("open");
            }

            CallAjax('/Tab/ShowSipingFormFallback/', { id: store_id, countryId: countryId, countryCode: countryCode, address: "", selectedDest: cart.CustomerFields.CountryId }, "dest_fallback", null,
                function () {
                }, function () { }, null, null, null, null, true);

        },

        ValidateAddressInput: function (e) {
            $(e).removeClass("input-validation-error");

            if ($.trim($(e).val()) == "") {
                $(e).addClass("input-validation-error");
                return false;
            }

            return true;
        },

        ValidateDestInput: function (e) {
            $(e).removeClass("input-validation-error");

            if ($.trim($(e).val()) <= 0 || $.trim($(e).val()) == "") {
                $(e).addClass("input-validation-error");
                return false;
            }

            return true;
        },

        ValidateOldDestInput: function (e) {
            $(e).removeClass("input-validation-error");

            if ($.trim($(e).val()) < 0 && $.trim($(e).val()) != "-1") {
                $(e).addClass("input-validation-error");
                return false;
            }

            return true;
        },

        GetParameterByName: function (name, url) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(url.toLowerCase());
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        ShowNotificationsBubbles: function () {
            //$(document).ready(function () {

            //    $("#container-bottom").notify({ stack: 'above' });

            //    CallAjax('/Tab/GetPinnedWebsiteProducts/', { id: storeid }, null, null, function (response) {
            //        for (var i = 0; i < response.Products.length; i++) {
            //            $("#container-bottom").notify("create", {
            //                title: response.Products[i].Title,
            //                text: response.Products[i].Text,
            //                image: response.Products[i].Image,
            //                price: currencySymbol + "" + response.Products[i].Price,
            //                id: response.Products[i].Id,
            //                permalink: cc_page_info.store_root_url + "/p/" + response.Products[i].Permalink,
            //            }, { expires: false });
            //        }


            //    }, function () { });



            //});
        },

        ChangeMobileProductdetailsImage: function (imgEl, e) {

            $$("#gal_mobile > a").removeClass("active");
            $$(imgEl).addClass("active");
            $$("#mobile_pdetails_image").prop("src", $$(imgEl).data("image"));
            e.preventDefault();
            return false;
        },

        movetosubcat: function (e) {
            var href = $("#cc-subnav-select-box").val();

            if (cc_ajax.isLoadPagesWithAjax) {
                cc_ajax.loadPage(href, e);
            } else {
                window.location = href + (ccisEditMode ? "?isdesignmode=true" : "");
            }

        },

        changeproductslayout: function (type) {
            $(".cc-categories-layout-button-group").find(".btn").removeClass("active");


            if (type == "grid") {
                $(".cc-page-main-container").removeClass("cc-product-layout-row");
                $(".cc-categories-layout-button-group").find(".cc-btn-prod-grid").addClass("active");
                $('.cc-prd-desc').show();// hide prd desc
            } else {
                $(".cc-categories-layout-button-group").find(".cc-btn-prod-line").addClass("active")
                $(".cc-page-main-container").addClass("cc-product-layout-row");
                $('.cc-prd-desc').show();// show prd desc
            }

        },
        GetMatrix: function () {

            CallAjax("/Tab/GetProductMatrix", { id: cc_oid }, null, null, function (response) {

                var list = response[0].matrix.list;
                var isallnoQTY = true;

                for (var i = 0; i < list.length; i++) {
                    if (list[i].qty == null || list[i].qty > 0) {
                        isallnoQTY = false;
                    }
                }

                if (isallnoQTY) {
                    $(".err-product-qty-message").show();
                    $(".product-buy-buttons").hide();
                }

                $(".buy-button-cont").on("click.matrix-buy", function (e) {
                    $(".matrix-qty-error").hide();


                    var elementA = $("[attr_id='" + response[0].matrix.attra + "']");
                    var elementB = $("[attr_id='" + response[0].matrix.attrb + "']");

                    var elAText = elementA.hasClass("cc-color-attr-input-hidden") ? elementA.val() : $("[attr_id='" + response[0].matrix.attra + "'] option:selected").text();
                    var elBText = elementB.hasClass("cc-color-attr-input-hidden") ? elementB.val() : $("[attr_id='" + response[0].matrix.attrb + "'] option:selected").text();


                    if (elementA.is(":radio")) {
                        elementA = $("[attr_id='" + response[0].matrix.attra + "']:checked");
                        elAText = $("[attr_id='" + response[0].matrix.attra + "']:checked").data("text");
                    }

                    if (elementB.is(":radio")) {
                        elementB = $("[attr_id='" + response[0].matrix.attrb + "']:checked");
                        elBText = $("[attr_id='" + response[0].matrix.attra + "']:checked").data("text");
                    }

                    var attra = elementA.hasClass("cc-color-attr-input-hidden") ? elementA.attr("option_id") : elementA.val();
                    var attrb = elementB.hasClass("cc-color-attr-input-hidden") ? elementB.attr("option_id") : elementB.val();



                    if (attra != "-1" && attrb != "-1") {

                        for (var i = 0; i < list.length; i++) {
                            var a = list[i].optionid;
                            var b = list[i].optionid2;
                            var qty = list[i].qty;

                            if ((parseInt(a) == parseInt(attra) && parseInt(b) == parseInt(attrb)) || parseInt(b) == parseInt(attra) && parseInt(a) == parseInt(attrb)) {
                                if (qty < 1 && qty != null) {
                                    $(".matrix-qty-error").slideDown();
                                    $("#matrix-qty-error-a").text(elAText);
                                    $("#matrix-qty-error-b").text(elBText);
                                    e.preventDefault();
                                    return false;
                                }
                                break;
                            }
                        }

                    }

                })

            }, function () { });


        },

        HandleColorsAttrs: function () {

            $(".cc-select-colors").on("click.cc-colorattr", ".cc-select-color-item", function (e) {

                $(this).closest(".cc-select-colors").find(".cc-select-color-item input:radio").removeAttr("checked");
                $(this).find("input:radio").prop("checked", true).trigger("change");
                $(this).closest(".cc-select-colors").find(".cc-select-color-item").removeClass("active");
                $(this).addClass("active").closest(".cc-colors-attr-required").find("input.cc-color-attr-input-hidden").attr("option_id", $(this).data("id")).val($(this).attr("title"));

                var image = $(this).data("image");
                var optionId = $(this).data("id");
                var prodId = $(this).data("prodid");
                if (image) {


                    CallAjax("/Tab/GetHtmlOfMultiImageFromAttr", { prodId: prodId, optionId: optionId, isMobile: isMobile }, null, null, function (res) {

                        if (isMobile) {
                            $("#mobileImageContent").html(res);
                            $("#showMainImageMobile").show();
                        } else {
                            $("#images_container").html(res);
                            $("#showMainImage").show();
                        }




                    }, function (msg) {


                    }, "POST");





                    $(".prev_bg .img_prd, #mobile_pdetails_image, #mobile_pdetails_image_new_prod_page .active img").attr("src", image).data("zoom-image", image).data("image", image);
                    $('.zoomContainer').remove();

                    $(".zoom").addClass("cc-attribute-zoom").elevateZoom(getZoomSettings());

                    if ($("#gal").find("a[data-image='" + image + "']").length == 0) {
                        $("#gal").append("<a data-image='" + image + "' data-zoom-image='" + image + "' class='hidden'></a>");
                    }
                }
            })


        }

    }

}();

var diag_ShowSipingFormFallback;
var diag_123;
var lst;
function OrderAttributeModel() {
    AttrId = "";
    OptionId = "";
    OptionText = "";
    AttrType = "";
    AttrText = "";
    AttrDisplayText = "";
}
function ProductOrderAttr() {
    ProductId = "";
    ArrAttrs = [];
}
function GetPrdAttrs(container, prodId) {
    if (!container) {
        container = ".attributes";
    }

    lst = [];
    var prdAttr = new ProductOrderAttr();
    prdAttr.ProductId = typeof (productId) == 'undefined' ? prodId : productId;
    var inputs = $(container + " .attrObjectInput[attr_id]");

    for (var i = 0; i < inputs.length; i++) {
        //clone the object
        var att = null;
        if ($(inputs[i]).data('att-type') == 'size') {
            if ($(inputs[i]).closest('label').hasClass('active')) {
                att = jQuery.extend(true, {}, OrderAttributeModel);
                att.AttrId = $(inputs[i]).attr('attr_id');
                att.OptionId = $(inputs[i]).attr('option_id');
                att.OptionText = $(inputs[i]).closest('label').text();
                att.Price = $(inputs[i]).data("price");
                //att.AttrText = $(inputs[i]).closest('label').text();
                //att.AttrDisplayText = $(inputs[i]).closest('label').text();
            }
        }
        else if ($(inputs[i]).data('att-type') == 'multiplication') {
            //if ($(inputs[i]).val() > 0) {
            var vl = $(inputs[i]).val();
            if (vl == null || $.trim(vl) == '' || typeof vl == 'undefined') {
                vl = 1;
            }
            att = jQuery.extend(true, {}, OrderAttributeModel);
            att.AttrId = $(inputs[i]).attr('attr_id');
            att.OptionId = $(inputs[i]).attr('option_id');
            var elemId = $(inputs[i]).attr('id');
            att.OptionText = vl;
            att.Price = vl;
            att.AttrType = 'multiplication';
            att.AttrText = $(inputs[i]).attr('attr_text');
            att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            //}
        }
        else if ($(inputs[i]).data('att-type') == 'cover') {
            //if ($(inputs[i]).val() > 0) {
            var vl = $(inputs[i]).val();
            if (vl == null || $.trim(vl) == '' || typeof vl == 'undefined') {
                vl = 0;
            }
            att = jQuery.extend(true, {}, OrderAttributeModel);
            att.AttrId = $(inputs[i]).attr('attr_id');
            att.OptionId = $(inputs[i]).attr('option_id');
            var elemId = $(inputs[i]).attr('id');
            att.OptionText = vl;
            att.Price = vl;
            att.AttrType = 'cover';
            att.AttrText = $(inputs[i]).attr('attr_text');
            att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            //}
        }
        else if ($(inputs[i])[0].tagName.toLowerCase() == "select") {
            if ($(inputs[i]).val() != -1) {
                att = jQuery.extend(true, {}, OrderAttributeModel);
                att.AttrId = $(inputs[i]).attr('attr_id');
                att.OptionId = $(inputs[i]).val();
                att.OptionText = $(inputs[i]).find("option:selected").text();
                att.Price = $(inputs[i]).find("option:selected").data("price");
                att.AttrText = $(inputs[i]).attr('attr_text');
                att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            }
        }
        else if ($(inputs[i])[0].tagName.toLowerCase() == "input" && ($(inputs[i]).attr("type").toLowerCase() == "text" || $(inputs[i]).attr("type").toLowerCase() == "hidden")) {
            if ($.trim($(inputs[i]).val()) != "") {
                att = jQuery.extend(true, {}, OrderAttributeModel);
                att.AttrId = $(inputs[i]).attr('attr_id');
                att.OptionId = $(inputs[i]).attr('option_id');
                att.OptionText = $(inputs[i]).val();
                att.Price = $(inputs[i]).data("price");
                att.AttrText = $(inputs[i]).attr('attr_text');
                att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            }
        }
        else if ($(inputs[i])[0].tagName.toLowerCase() == "input" && ($(inputs[i]).attr("type").toLowerCase() == "checkbox" || $(inputs[i]).attr("type").toLowerCase() == "radio")) {
            if ($(inputs[i]).is(':checked')) {

                att = jQuery.extend(true, {}, OrderAttributeModel);
                att.AttrId = $(inputs[i]).attr('attr_id');
                att.OptionId = $(inputs[i]).attr('option_id');

                // radio and more
                att.OptionText = $(inputs[i]).data("text");
                if ($.trim(att.OptionText) == '') {
                    // check box
                    att.OptionText = $(inputs[i]).closest('label').text();
                }
                att.Price = $(inputs[i]).data("price");
                att.AttrText = $(inputs[i]).attr('attr_text');
                att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            }
        }
        else if ($(inputs[i])[0].tagName.toLowerCase() == "textarea") {
            if ($.trim($(inputs[i]).val()) != "") {
                att = jQuery.extend(true, {}, OrderAttributeModel);
                att.AttrId = $(inputs[i]).attr('attr_id');
                att.OptionId = $(inputs[i]).attr('option_id');
                att.OptionText = $(inputs[i]).val();
                att.Price = $(inputs[i]).data("price");
                att.AttrText = $(inputs[i]).attr('attr_text');
                att.AttrDisplayText = $(inputs[i]).attr('attr_display_text');
            }
        }
        if (att != null)
            lst[lst.length] = att;
    }
    prdAttr.ArrAttrs = lst;

    return prdAttr;

}

$.xhrPool = [];
$.xhrPool.abortAll = function () {
    $(this).each(function (idx, jqXHR) {
        //    jqXHR.abort();
    });
    // $.xhrPool.length = 0
};

$.ajaxSetup({
    beforeSend: function (jqXHR) {
        //    $.xhrPool.push(jqXHR);
    },
    complete: function (jqXHR) {
        //     var index = $.inArray(jqXHR, $.xhrPool);
        //     if (index > -1) {
        //         $.xhrPool.splice(index, 1);
        //     }
    }
});



$(document).ready(function () {
    cs.RenderCycle();

    //if (typeof (isSelfCheckout) == "undefined" || !isSelfCheckout) {
    //    if (typeof (storeid) != "undefined") {

    //        var fromLocalStorage = localStorage.getItem("cart" + storeid);

    //        if (fromLocalStorage != null) {
    //           // var cookie = getCookie("cart" + storeid);
    //            if (typeof (JSON) != "undefined") {
    //                cart = JSON.parse(fromLocalStorage);
    //                calculate();
    //            }
    //        }
    //    }
    //}
    if ($('[data-toggle="tooltip"]').tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }
    if (cc_oid) {
        $("li[data-id=" + cc_oid + "],a.list-group-item[data-oid=" + cc_oid + "]").addClass("active");
    }
    // $(".side-menu .sub-nav li.selected").parents("li").addClass("selected");

    $(".side-menu li i.fa-angle-down").on("click.ddr", function (e) {

        $(this).closest("li").toggleClass("selected");

        e.preventDefault();
        return false;
    })

    $("body").on("focus", "*[tabindex]", function (e) {
        $(".product").removeClass("focus");

        if ($(this).closest("li").find(" > ul").length == 0) {

            $(this).closest("li").prev().find(" ul").removeClass("opened-focus");
        }

        $(this).closest("li").find(" > ul").addClass("opened-focus");


        if ($(this).hasClass("buy-button-cont")) {


            $(this).closest(".product").addClass("focus");
        }

    });

    if (isMobile) {
        $('.zoomContainer').remove();
    }


    if (typeof (reseller_key) != "undefined" && typeof (reseller_value) != "undefined") {
        localStorage.setItem("cc_reseller_key", reseller_key);
        localStorage.setItem("cc_reseller_value", reseller_value);
    }
    else {
        if (localStorage
            && localStorage.getItem("cc_reseller_key") != null
            && localStorage.getItem("cc_reseller_value") != null) {

            window.reseller_key = localStorage.getItem("cc_reseller_key");
            window.reseller_value = localStorage.getItem("cc_reseller_value");
        }
    }

    // delete resellers from local storage
    GlobalCartEvents.Subscribe(function (storeContext, step, payment_type) {

        if (step == CartStep.DONE) {

            localStorage.removeItem("cc_reseller_key");
            localStorage.removeItem("cc_reseller_value");

        }

    })


    renderSideMenuToggle();

})

function renderSideMenuToggle() {

    $(".cc-sidebar-nav .list-item-icon").unbind("click.cc-t").on("click.cc-t", function (e) {

        $(this).parent().next().toggle();

        if ($(this).parent().next().is(":visible"))
            $(this).find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        else
            $(this).find(".fa").removeClass("fa-chevron-up").addClass("fa-chevron-down");


        e.preventDefault();
        return false;
    })

}


window.onpopstate = function (event) {
    if (event == null || event.state == null) {
        return;
    }

    CCHistoryListener(event.state);
}

function CCHistoryListener(data) {

    if (!data.updatehistory) {
        data.updatehistory = false;
    }

    cc_ajax.loadPage(data.url);
}


function renderFirstEnterHistory(id, type) {
    if (history.pushState) {
        if (history.state && history.state.oid == id && history.state.type == type) {
            window.history.replaceState({ oid: id, type: type }, "");
        }
        else {
            window.history.pushState({ oid: id, type: type }, "");
        }
    }
}

$(document).ready(function () {
    //if ($(".store-middle-bar").sticky) {
    //    $(".store-middle-bar").sticky({
    //        topSpacing: 0,
    //        center: true,
    //        getWidthFrom: '.inner-width'
    //    });
    //}
});

window.addEventListener("DOMContentLoaded", function () {
    // For mobile payment inside iframe like meshulam
    console.log("default2.DOMContentLoaded");
    window.addEventListener("message", function (event) {

        if (event && event.data && typeof (event.data) == "string" && event.data.indexOf("payment_done_") > -1) {
            console.log("window.addEventListener payment_done_");
            var orderid = event.data.replace("payment_done_", "");
            cs.RedirectToCheckoutCompleted(orderid);
        }
    })

}, false)
$(function () {

    //try {
    //    //listen to holla back
    //    window.addEventListener('message', function (event) {
    //        //alert("url 2: " + location.href);

    //        if (event && event.data && typeof (event.data) == "string" && event.data.indexOf("payment_done_") > -1) {
    //            console.log("window.addEventListener");
    //            var orderid = event.data.replace("payment_done_", "");
    //            cs.RedirectToCheckoutCompleted(orderid);
    //        }
    //    }, false);
    //}
    //catch (e) {
    //    console.log("payment done addEventListener message failed");
    //}

    cart.ShipingOption = defaultShipingOption;


})

function cart_changeshipingoption(e) {
    $("#cbx_choose_shiping_option").removeClass("input-validation-error");
    $(".shiping-option-container").hide();
    var val = $(e).val();
    $("#" + val + "_content").show();
    cart.ShipingOption = parseInt($(e).val());
    var name = $(e.options[e.selectedIndex]).data("shipingname");

    GlobalClicksEvents.CallClickEvent(storeContext, 'select_shiping_' + name, 'click');

    if (val == 200 || val == 50 || val == 60) {

        openRunAPIPickupPointDiag();
    }

    if (val == 3) {
        $('#lstSelfPickupBranch').show();
        cs.ChangeToSelfDelivery();
        return;
    }
    else {
        $('#lstSelfPickupBranch').hide();
        cs.ChangeToShipingForm();
        cart.IsSelfDelivery = false;
        return;
    }



    cs.CalculatePrices();


}

if (storeContext == "iframe") {

    if (window.addEventListener) {
        window.addEventListener('message', sendIframeData, false);
    } else if (window.attachEvent) {
        window.attachEvent('onmessage', sendIframeData);
    }

    if (parent) {
        parent.postMessage("winready", "*");
    }

    function sendIframeData(e) {


        if (!e || !e.data) {
            return;
        }

        if (typeof (e.data) == "object") {
            CCHistoryListener(e.data);
            return;
        }

        if (e.data == "height" || e.data.indexOf("scroll_") > -1 || e.data.indexOf("url_") > -1) {
            if (e.data == "height") {
                var height = $("body").outerHeight();
                if (height < 101) {
                    height = $("#facebox").height() + 300;
                }

                parent.postMessage("ccheight_" + height, (e.origin == "null" ? window.location.host : e.origin));
            }
            else if (e.data.indexOf("url_") > -1) {
                // this is not active and right not not need to be..
                // productsid, type and oid came from the server side. (refferer parameter).
                //   cs.GetUrlFromParent(e.data);
            }
            else {
                var height = e.data.replace("scroll_", "");
                //cs.GetScrollItems(height);
                // deprecated by lad more button
            }
        }
    }
    renderFirstEnterHistory(cc_oid, cc_type);

}

/*
if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
    var jsonScript = document.createElement("script");
    jsonScript.src = "//ajax.cdnjs.com/ajax/libs/json2/20110223/json2.min.js";
    document.body.appendChild(jsonScript);
    var ielink = document.createElement("link");
    ielink.href = "/Content/ie7.css";
    ielink.rel = "stylesheet";
    document.body.appendChild(ielink);
}
*/

// ===== Scroll to Top ==== 
$(window).scroll(function () {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$(function () {
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 200);
    });
})

function pushnotifygrant() {
    if (!Notification) {
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

}

function pushnotify() {

    var notification = new Notification('Notification title', {
        icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
        body: "Hey there! You've been notified!"
    });


    notification.onclick = function () {
        window.open("http://stackoverflow.com/a/13328397/1269037");
    }
}

//$(document).on("DOMSubtreeModified", function () {
//    if ($(".leftside").length > 0 && !isMobile && storeContext != "facebook") {
//        if ($(".leftside").is(":visible")) {
//            $(".product-col").removeClass("col-lg-3");

//        }
//    }

//})


// input = data-ccajax=true and data-permalink
// a = data-ccajax=true and href

$(document).on("click.cc_ajax", "[data-ccajax=true]", function (e) {

    var $this = $(this);
    var API = $("#mobile-menu").data("mmenu");
    if (API) {
        API.close();
    }

    switch ($this.prop("tagName")) {
        case "A":
            {
                url = $this.attr("href");
                return cc_ajax.loadPage(url, e);
                break;
            }
        case "INPUT":
        case "BUTTON":
        case "SELECT":
            {
                url = $this.data("permalink");



                if (!cc_ajax.isLoadPagesWithAjax) {
                    window.location = url;
                } else {
                    cc_ajax.loadPage(url, e);
                }
                break;
            }
    }



})

var cc_ajax = {};

cc_ajax.design = "";
cc_ajax.isLoadPagesWithAjax = storeContext == "website" ? false : true;
//if (isMobile)
//{
//    cc_ajax.isLoadPagesWithAjax = true;
//}
var ispager = null;
cc_ajax.loadPage = function (url, e, callback) {

    cs.Counter = 1;

    if (!cc_ajax.isLoadPagesWithAjax) {
        return true;
    }

    // get page info for ajax request (fix facebook domain cross issues) via browser_root_url and not domain url for ajax
    var pageInfo = cc_page_info.getParsedInfo(url);
    var fullUrl = (cc_page_info.browser_root_url + pageInfo.fullrelativeLink);

    // context param
    if (fullUrl.toString().indexOf("?") > -1) {
        fullUrl += "&context=" + storeContext;
    }
    else {
        fullUrl += "?context=" + storeContext;
    }
    if (ispager == null) {
        ispager = getParameterByName(location.href, 'ispager');
    }
    if (fullUrl.toString().toLowerCase().indexOf("ispager") == -1 && ispager == "true") {
        fullUrl += "&ispager=" + ispager;
    }

    var design = getParameterByName(window.location.href, "design");
    if (design && design != "" && design != null) {
        cc_ajax.design = design;

    }

    if (cc_ajax.design && cc_ajax.design != "") {
        fullUrl += "&design=" + encodeURIComponent(cc_ajax.design);
    }


    $.ajax({
        type: "get",
        url: fullUrl,
        beforeSend: function () {
            $("#loadingmasker").show();
        },
        success: function (msg) {

            // run script settings from ajax
            var settingsFinder = $('<output/>').html(msg).find("#cc-store-settings-script");

            if (settingsFinder.length > 0) {
                $.getScript(settingsFinder.prop("src"), function () {
                    ajaxpageload_callback(msg, fullUrl, pageInfo, callback);
                });
            } else {
                ajaxpageload_callback(msg, fullUrl, pageInfo, callback);
            }
        },

        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading page." + thrownError);
            $("#loadingmasker").hide();
        }
    });

    if (e) {
        e.preventDefault();
    }


    return false;
}

function ajaxpageload_callback(msg, fullUrl, pageInfo, callback) {

    // remove zoom image
    $('.zoomContainer').remove();// remove zoom container from DOM


    // get page html
    var output = $('<output/>').html(msg).find("div#main-dynamic-content");

    if (output.length == 0) {
        return;
    }




    $("div#main-dynamic-content").replaceWith(output);

    loadImagesLoader();


    // get page info
    pageInfo = cc_page_info.getParsedInfo();
    fullUrl = (cc_page_info.browser_root_url + pageInfo.fullrelativeLink);

    var title = cc_page_info.title;


    // scroll top
    $('body').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 100);

    if (FB && FB.Canvas) {
        FB.Canvas.scrollTo(0, 0);
    }

    // render more things
    PageRenderAll();
    renderSideMenuToggle();


    // set nav active by ajax 


    $(".nav a[data-oid], .list-group[data-type] a[data-oid]").parent().removeClass("active");
    $(".nav a[data-oid=" + cc_oid + "], .list-group[data-type] a[data-oid=" + cc_oid + "]").parent().addClass("active");

    $("#loadingmasker").hide();

    // update page history
    var stateObj = { url: fullUrl, title: cc_page_info.title, info: pageInfo, browser_root_url: cc_page_info.browser_root_url, browser_full_url: fullUrl };

    history.pushState(stateObj, "", fullUrl);




    // Wix
    if (typeof (WixObject) != 'undefined') {
        var pinfo = cc_page_info.getParsedInfo();


        Wix.pushState(pinfo.fullrelativeLink.substr(1));
    }
    else { // for embedded store iframe
        parent.postMessage(history.state || stateObj, "*");
    }

    // set page title
    document.title = title;

    // set stats
    switch (pageInfo.objType) {
        case "p":
            GlobalViewEvents.CallViewEvent(storeContext, "product", cc_oid, cc_page_info.title, $(".breadcrumb li:last").text(), $(".offer-price:last .offer-price-only").text());
            break;
        case "c":
            GlobalViewEvents.CallViewEvent(storeContext, "category", cc_oid, cc_page_info.title, null, null);
            break;
        case "sc":
            GlobalViewEvents.CallViewEvent(storeContext, "special-category", cc_oid, cc_page_info.title, null, null);
            break;
        case "page":
            GlobalViewEvents.CallViewEvent(storeContext, "cms-page", cc_oid, cc_page_info.title, null, null);
            break;
        default:

    }

    setWinSize();
    if (callback) {
        callback.call(this);
    }
}


function PageRenderAll() {

    $(".normal").removeClass("special");
    $("object").attr("wmode", "transparent");
    $("param").attr("wmode", "transparent");


    $(".required-star").next().addClass("field-required");

    $(".needparse_fb:not(.rendered_fb)").addClass("rendered_fb").each(function (i, n) {
        if (typeof (FB) != "undefined") {
            FB.XFBML.parse(n);
        }
    })

    setWinSize();

    $('.ttip[title]').each(function (i, n) {
        if ($(n).hasClass("ttiptopright")) {
            $(n).powerTip({ placement: 'ne', fadeInTime: 0, fadeOutTime: 0 });
        }
        else if ($(n).hasClass("ttiptop")) {
            $(n).powerTip({ placement: 'n', fadeInTime: 0, fadeOutTime: 0 });
        }
        else {
            var al = store_dir == "rtl" ? "sw" : "se";
            $(n).powerTip({ placement: al, fadeInTime: 0, fadeOutTime: 0 });
        }
    });


    //addthis.toolbox('.addthis_toolbox');


    cs.HandleColorsAttrs();


}

// navigation bind active state listener
//$(document).on("click", ".nav a", function () {
//    $(".nav").find(".active").removeClass("active").removeClass("open");
//    $(this).parent().addClass("active");
//});



// listen add button to cart 
$(document).on("click", ".add:not([disabled])", function (e) {
    var pid = $(this).data("pid");
    var isInUpsellDialog = $(this).closest("#upsale_products").length > 0;
    if ($(this).data("autodisqty") != null && $(this).data("autodisqty") != 'undefined') {
        qty = $(this).data("autodisqty");
        addToCartHandler(this, pid, null, null, isInUpsellDialog, qty);
    } else {
        addToCartHandler(this, pid, null, null, isInUpsellDialog);
    }


});
function redirectToProductEdit(elem, pid) {
    var pGuid = createGuid();
    //addToCartHandler(elem, pid, pGuid);
    var isValid = cs.ValidateAttributes($(".p" + pid + ".attributes")[0]);
    if (!isValid) {
        showAttrDialogErr(pid);
        return false;
    }
    var cartProduct = prepareProductToCart(elem, pid);

    // save the product cart to use after product design
    localStorage.setItem('Wobily_ProductEdit' + pid, JSON.stringify(cartProduct));
    var url = window.cc_page_info.store_root_url + "/ProductEdit/" + pid;
    location.href = url;
}
function showAttrDialogErr(pid) {
    var buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" class="uibutton special big right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
    // scroll to attributes section
    focusElement(true, ".p" + pid + ".attributes");
    $.facebox("<div class='alert  alert-danger padd'>" + Resources.RequiredErr + "</div>" + buttons);
}
function ValidateDeals() {
    var chk = $(".proddeals input:radio:checked[name=dealtype]");
    if (chk.data("sec-dedicated-to") == "1"/*Store*/ ||
        chk.data("sec-dedicated-to") == "2"/*Category*/) {

        var selPrd = chk.closest(".deal-container").find(".deal-prd-select");
        if (selPrd.val() == "") {
            // err required
            $(selPrd).addClass("input-validation-error");
            return false;
        }
        else {
            // Valid
            return true;
        }
    }
    return true;
}
function prepareProductToCart(elem, pid, prodQtyOfDisQty = null, isUpSellingDialog = false) {

    var isValid = cs.ValidateAttributes($(".p" + pid + ".attributes")[0]);
    if (isValid && $(".proddeals input:radio:checked[name=dealtype]").length > 0) {
        isValid = cs.ValidateAttributes($(".proddeals input:radio:checked[name=dealtype]").closest(".deal-container")[0]);
    }
    var isValidDeals = ValidateDeals();

    if (!isValid || !isValidDeals) {
        showAttrDialogErr(pid);
        return false;
    }
    var price = $(elem).data("price");
    var prdPriceFromAttrs = getPrdPriceFromAttrs();
    if (prdPriceFromAttrs.hasAttrValue = true && prdPriceFromAttrs.total_for_coverarea == 0) {
        price = ((price * prdPriceFromAttrs.total_for_multiplication) + prdPriceFromAttrs.total_for_add).toFixed(2);
        price = parseInt(price);
    } else if (prdPriceFromAttrs.hasAttrValue = true && prdPriceFromAttrs.total_for_coverarea > 0) {
        if (prdPriceFromAttrs.hasPriceRange) {
            price = (Number(prdPriceFromAttrs.total_for_coverarea) + prdPriceFromAttrs.total_for_add).toFixed(2);
            price = parseInt(price);
        } else {
            price = (Number(prdPriceFromAttrs.total_for_coverarea * price) + prdPriceFromAttrs.total_for_add).toFixed(2);
            price = parseInt(price);
        }

    }
    var err = null;
    var buttons = null;
    var max = parseInt($(elem).data("max"));
    var minPrice = null;
    var mp = $(elem).data("minprice");
    if (mp != '' && mp != null) {
        minPrice = parseInt(mp);
    }
    if (max <= cart.Products.length) {
        // Validate max quantity
        err = Resources.NumberOfItemsInTheCartIsAllowedUpTo + ": " + " " + max + " " + Resources.Products;
        buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" class="uibutton special big right" onclick="checkout(true)"  value="' + Resources.ToShoppingCart + '"/> <input type="button" class="uibutton special big right" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/> <div class="clear"></div></div>';
    }
    if (minPrice != null && price < minPrice) {
        // Valudate min price
        err = Resources.ThisProductIsAvailable + " " + minPrice + " " + window.cc_page_info.store_currency_symbol +
            "<br/>" + Resources.IfYouConfirm + " " + minPrice + " " + window.cc_page_info.store_currency_symbol;
        buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" ><input type="button" onclick="$(\'.close_image\').click()" class="add uibutton special big right"  data-max="9999" data-pid="' + pid + '" data-autodisqty="' + prodQtyOfDisQty + '" data-price="' + minPrice + '" value="' + Resources.Ok + '"/> <input type="button" class="uibutton special big right" value="' + Resources.Cancel + '" onclick="$(\'.close_image\').click()"/> <div class="clear"></div></div>';
    }
    if (err != null) {

        $.facebox("<div class='alert alert-danger f-dialog-validate-add'><br/>" + err + " " +
            "<br/><br/></div></div>" + buttons);
        return false;
    }


    var img = $("#prodImage").attr("src");
    var title = $(".product-name").text();
    if (title == '' || title == null) {
        title = $.trim($('h1[itemprop="name"]').text());
    }
    if (title == '' || title == null) {
        title = $(elem).closest('.product.thumbnail').find('.title').attr('title');
    }


    var dealType = $(elem).data("dealtype");
    var customerMegalikeId = $(elem).data("customermegalike");
    var qty = 1;

    if ($(elem).closest('.cc-btn-qty').length > 0) {
        var btnq = $(elem).closest('.cc-btn-qty');
        var ddlq = btnq.find('.cc-ddl-qty');
        qty = ddlq.val();
    }
    var isShare = $("#istp").length == 0 || $("#istp").val() == "0" ? false : true;

    var $deal = $("input[name=dealtype]:radio:checked").filter(function () { return $(elem).val() != "" || ($(elem).attr('class').indexOf('add') > -1 && $(elem).attr('class').indexOf('buy-button-cont') > -1); });

    var isDeal = $deal.length > 0;
    var dealId = $deal.val();

    if (!dealId || dealId == "" || $.trim(dealId) == "") {
        dealId = 0;
    }

    if (isUpSellingDialog) {
        isDeal = false;
        dealId = 0;
    }

    var dealSecondChosenProduct = null;
    if (isDeal && dealId && dealId != "") {
        dealType = "2";
        var dealMainPid = $deal.data('main-pid');
        var dealDedicatedTo = $deal.data('dedicated-to');
        var secDealDedicatedTo = $deal.data('sec-dedicated-to');
        if (secDealDedicatedTo == 2/*Category*/ || secDealDedicatedTo == 1/*Store*/) {
            var chk = $(".proddeals input:radio:checked[name=dealtype]");
            var selPrd = chk.closest(".deal-container").find(".deal-prd-select");
            dealSecondChosenProduct = selPrd.find(":selected").data("sec-chosen-id");

        }
        if (dealDedicatedTo == 3 && dealMainPid != pid) {
            // we are on secondary product and deal was choose
            pid = dealMainPid;
            price = $deal.data('main-prd-price');
        }
    }
    var category = $('.product').attr('data-catname');
    var attributes = GetPrdAttrs(".p" + pid + ".attributes").ArrAttrs;
    var actions = new Action();
    actions.IsLike = isLiked;
    actions.IsShare = isShare;
    if (prodQtyOfDisQty != null && prodQtyOfDisQty != 'undefined') {
        qty = prodQtyOfDisQty;
    }
    var cartProduct = new Product(pid, attributes, actions, qty, title);
    cartProduct.CategoryName = category;
    cartProduct.Price = price;
    cartProduct.DealType = dealType;
    cartProduct.CustomerMegalikeId = customerMegalikeId;
    cartProduct.DealId = dealId;
    cartProduct.SaleDealAttrs = GetPrdAttrs('#deal-container-' + dealId).ArrAttrs;
    cartProduct.DealSecondChosenProduct = dealSecondChosenProduct;

    return cartProduct;

}
function addToCartHandler(elem, pid, pGuid, cartProduct, doNotDisplayCartDialog, prodQtyOfDisQty = null) {
    var isShowCart = $(elem).hasClass("showcheckout");

    if (cartProduct == null || typeof cartProduct == 'undefined') {
        cartProduct = prepareProductToCart(elem, pid, prodQtyOfDisQty, doNotDisplayCartDialog);
        if (cartProduct == false) {
            return false;
        }
    }
    $.add2cart($(elem)[0], 'totalp', function () {
        $(this).remove();
        addToCart(pid, null/*img*/, cartProduct.Title, cartProduct.Price, cartProduct.IsShare, cartProduct.DealType,
            cartProduct.CustomerMegalikeId, cartProduct.DealId, cartProduct.Qty, null, pGuid, null, cartProduct.SpecialSettings, cartProduct.DealSecondChosenProduct);
        if (isShowCart) {
            checkout(true);
        } else if (!window.store_settings.DoNotDisplayCartDialog && doNotDisplayCartDialog != true) {
            cs.ShowContinueDialog(pid);
        }
    });
    return false;
}
function cctoggleListgroup(e, event) {
    return true;

    //$(e).next().toggle();

    //if ($(e).next().is(":visible"))
    //    $(e).find("span.list-item-icon > .fa").removeClass("fa-chevron-down").addClass("fa-chevron-up");
    //else
    //    $(e).find("span.list-item-icon > .fa").removeClass("fa-chevron-up").addClass("fa-chevron-down");

    //event.preventDefault();
    //return false;

}



function isSupportLocalStorage() {
    var testKey = 'test', storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);

        return true;
    } catch (error) {

        return false;

    }
}
function isSupportSessionStorage() {
    var testKey = 'test', storage = window.sessionStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);

        return true;
    } catch (error) {

        return false;

    }
}
function isSupportCookies() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie"
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false
    }
    return cookieEnabled;
}

$(document).ready(function () {
    $('.cc-navigation .dropdown-toggle').on("click.cc", function (e) {
        var href = $(this).attr('href');
        if (cc_ajax.isLoadPagesWithAjax) {
            var API = $("#mobile-menu").data("mmenu");
            if (API) {
                API.close();
            }
            cc_ajax.loadPage(href, e);
        } else {

            var prefix = "?isdesignmode=true";
            if (!ccisEditMode) {
                prefix = "";
            }
            else {
                if ((href.indexOf("?isdesignmode=true") > 0)) {
                    prefix = "";
                }
            }

            window.location = href + prefix;
        }
    });

    $(".navbar-toggle,.side-navigation-button").on("click.menu", function (e) {
        var API = $("#mobile-menu").data("mmenu");
        API.open();
        e.preventDefault();
        return false;
    });

    $(".cc-sitemap-cont .list-group-item.cc-item-childrens > a").unbind("click").on("click.footermap", function (e) {
        window.location = $(this).attr("href") + (ccisEditMode ? "?isdesignmode=true" : "");
        e.preventDefault();
        return false;
    })

})

var isMMenurendered = null;
//$(document).ready(function () {





//});

function initMMenu() {
    try {

        if (isMMenurendered) {
            return isMMenurendered;
        }
        var $menu = $(".cc-TopMenu").length > 0 ? $(".cc-TopMenu").parent() : $(".cc-MainMenu").parent();

        var arr = [];
        var lis = $menu.find("li[data-id]");

        lis.each(function () {
            var id = $(this).data("id");
            if ($.inArray(id, arr) > -1) {

                if ($(this).find("ul").length > 0) {
                    $menu.find("li[data-id=" + id + "]:not(.cc-item-childrens)").remove();
                } else {
                    $(this).remove();
                }
            }
            else {
                arr.push(id);
            }
        });



        var $mobmenu = $menu.clone();
        $mobmenu.attr("id", "mobile-menu");
        $mobmenu.removeClass("collapse").removeClass("navbar-collapse").removeClass("nav").removeClass("navbar-nav");
        $mobmenu.find(".dropdown-menu").removeClass("dropdown-menu");
        $mobmenu.find(".nav").removeClass("nav");
        $mobmenu.find(".navbar-nav").removeClass("navbar-nav");
        $mobmenu.find(".dropdown-toggle").removeClass("dropdown-toggle");
        $mobmenu.find(".dropdown-submenu").removeClass("dropdown-submenu");
        $mobmenu.find("a[data-toggle]").on("click.mob_a", function (e) {
            var href = $(this).prop("href");

            if (cc_ajax.isLoadPagesWithAjax) {
                var API = $("#mobile-menu").data("mmenu");
                if (API) {
                    API.close();
                }
                cc_ajax.loadPage(href, e);
            } else {
                window.location = href;
            }
        })



        $mobmenu.mmenu({
            extensions: ["border-full", "effect-menu-slide", "pagedim-black"],
            selectedClass: "active",
            offCanvas: {
                position: "right",
            },
            navbar:
            {
                title: T.Global.Menu
            },
            backButton: {
                close: true
            },
            counters: false,
            navbars: [{
                position: "top",
                content: [
                    '<a class="cc--ecommerce-checkout cc-checkout-mobile-menu text-primary" href="javascript:void(0);" onclick="cs.domobilecheckoutmenu()"><span class="fa fa-shopping-bag"></span> ' + T.Global.Shoppingcart + '</a>',
                    '<a class="cc--ecommerce-checkout cc-search-mobile-menu text-primary" href="javascript:void(0);" onclick="cs.mmenusearch()"><span class="fa fa-search"></span> ' + T.Global.Search + '</a>',
                    isMobile ? '<span class="mobile-wrap">' + $('<div>').append($('.sticky-sidebar').clone()).html() + '</span>' : ""
                ]
            }]
        }, {

            // configuration
            classNames: {
                fixedElements: {

                }
            }

        });


        isMMenurendered = $mobmenu;
        return $mobmenu;
    }
    catch (e) {
        console.error(e);
        // in some cases mmenu throw an exception and images could not be loaded. 
        // the error is not destroy the menu. 
        // bug mmenu on git: https://github.com/FrDH/jQuery.mmenu/issues/337
    }

}
function emptyItemMenuClicked(e) {
    event.preventDefault();
    event.stopPropagation();
    if (!isMobile && storeContext != "facebook") {
        return false;
    }
    else {
        $(e).prev().click();
        return false;
    }
}

function setOverflowMenu() {

    $(document).ready(function () {
        var res = window.outerHeight + "-" + window.outerWidth;

        $(".nav.navbar-nav:not('.cc-rendered-" + res + ",.sidebar-filter, .side-nav,.filter-nav-mobile')").each(function () {
            if ($(this).addClass("cc-rendered-" + res + "").overflowNavs) {
                $(this).addClass("cc-rendered-" + res + "").overflowNavs({
                    "more": T.Global.More,
                    "parent": ".navbar-collapse",
                    "override_width": true,
                    "offset": "70px",
                    "isapplymobile": $(this).closest(".cc-overflow-apply-mobile").length > 0
                });
            }

        }).css("overflow", "visible").css("max-height", "100%");

        if ($("#cc-store-context-menu .nav").css("overflow", "visible").css("max-height", "").overflowNavs) {
            $("#cc-store-context-menu .nav").css("overflow", "visible").css("max-height", "").overflowNavs({
                "more": T.Global.More,
                "parent": ".navbar-collapse",
                "override_width": false,
                "offset": "100px"
            });
        }

    })



    // $('.navbar-nav').smartmenus('refresh');

}

$(function () {

    setOverflowMenu();

    cs.HandleColorsAttrs();

    $(".prev_bg").on("click.cc-zoom", ".zoom", function (e) {

        if (storeContext == "facebook" && typeof (FB) != "undefined") {
            FB.Canvas.scrollTo(0, 0);
        }

        var ez = $('.zoom').data('elevateZoom');
        if (ez.getGalleryList().length == 0) {
            loadfancyprodimage(ez.imageSrc, $(".product-title-cont div.product-title > h1").text(), $(".offer-price:last .offer-price-only").text());
        }
        else {
            loadfancyprodimage(ez.getGalleryList(), $(".product-title-cont div.product-title > h1").text(), $(".offer-price:last .offer-price-only").text());

        }
        return false;
    });


    $(".cc-deals-container input:radio").unbind("click.cchotprod").on("click.cchotprod", function () { // missing bind live
        if ($(this).val() != "0") {
            $("#dealattr" + $(this).val()).show();
        } else {
            $(".dealattrscont").hide();
        }
    })


});

function loadfancyprodimage(gallery, title, price, href) {
    $.fancybox(gallery, {
        href: href,
        title: '<input type="button" class="right buy-button-cont hand btn btn-primary" onclick="$.fancybox.close()" value="' + T.Global.Close + '"/>' + title + "<br/><b>" + price + "</b>",
        helpers: {
            title: { type: 'inside' },
            buttons: {}
        }
    });
}

$(window).resize(function () {

    setOverflowMenu();

});

window.setInterval(function () {
    //$('.fb-comments-cont iframe').width(computed_width - 40);
    //setWinSize();

}, 350);


function getZoomSettings() {

    return {
        gallery: 'gal',
        galleryActiveClass: 'active',
        zoomWindowPosition: store_dir == "rtl" ? 11 : 1,
        zoomWindowFadeIn: 100,
        zoomWindowFadeOut: 100,
        zoomWindowWidth: 400,
        zoomWindowHeight: 400,
        scrollZoom: true,
        //zoomType: Lens,
        //lensSize: 1000,
        loadingIcon: "https://cdnw.wobily.com/system/loading.svg",
        zoomLevel: 0.5

    }

}
var zoomImage = $('img#img_01');

function reloadZoom(elem) {
    $('.zoomContainer').remove();
    $('.zoom').removeData('elevateZoom');
    // Update source for images
    zoomImage.attr('src', $(elem).data('image'));
    zoomImage.data('zoom-image', $(elem).data('zoom-image'));
    // Reinitialize EZ
    //zoomImage.elevateZoom(getZoomSettings());
    $('.zoom').elevateZoom(getZoomSettings());
    // remove current zoom
    //$('.zoomContainer').remove();
    //$('.zoom').removeData('elevateZoom');

    //// Create new
    //$('.zoom').elevateZoom(getZoomSettings());


}
function chooseimageAttrByImages(e, ismultiselect) {

    if (!ismultiselect) {

        var isChecked = $(e).find("input:radio,input:checkbox").is(":checked");
        $(e).closest(".cc-select-by-image-cont").find(".cc-select-by-image").removeClass("selected").find("input:radio").removeAttr("checked");


        if (isChecked) {
            $(e).removeClass("selected").find("input:radio,input:checkbox").removeAttr("checked").trigger("change");
        } else {
            $(e).addClass("selected").find("input:radio,input:checkbox").prop("checked", true).trigger("change");
        }

    }
    else {
        var isChecked = $(e).find("input:radio,input:checkbox").is(":checked");

        if (isChecked) {
            $(e).removeClass("selected").find("input:radio,input:checkbox").removeAttr("checked").trigger("change");
        } else {
            $(e).addClass("selected").find("input:radio,input:checkbox").prop("checked", true).trigger("change");
        }
    }


}

function chooseSizeAtrr(e) {


    var isChecked = $(e).is(":checked");
    console.log(isChecked);
    $(".product-views-option-tile-picker").removeClass("active");
    $(".product-views-option-tile-input-picker").removeClass("selected");
    $(".product-views-option-tile-input-picker").removeAttr("checked");



    $(e).addClass("selected").trigger("change");
    $(e).attr('checked', true);
    $(e).closest(".product-views-option-tile-picker").addClass("active");

}



function updatePrdPriceFromAttrs() {
    var prdPriceFromAttrs = getPrdPriceFromAttrs();

    if (prdPriceFromAttrs.hasAttrValue = true && prdPriceFromAttrs.total_for_coverarea == 0) {
        $(".offer-price-only").each(function () {
            var sprice = parseFloat($(this).data("realprice"));
            $(this).fadeOut(500).text(formatNumber((sprice * prdPriceFromAttrs.total_for_multiplication) + prdPriceFromAttrs.total_for_add)).fadeIn(500);
        })
    } else if (prdPriceFromAttrs.hasAttrValue = true && prdPriceFromAttrs.total_for_coverarea > 0) {
        if (prdPriceFromAttrs.hasPriceRange) {
            $(".offer-price-only").each(function () {
                var sprice = parseFloat($(this).data("realprice"));
                $(this).fadeOut(500).text(formatNumber((Number(prdPriceFromAttrs.total_for_coverarea)) + prdPriceFromAttrs.total_for_add)).fadeIn(500);
            })
        } else {
            $(".offer-price-only").each(function () {
                var sprice = parseFloat($(this).data("realprice"));
                $(this).fadeOut(500).text(formatNumber((prdPriceFromAttrs.total_for_coverarea * sprice) + prdPriceFromAttrs.total_for_add)).fadeIn(500);
            })
        }

    }
}

function ShowDialogAttribute(attrId) {


    cs.SetTop();
    jQuery.facebox(PopAttrContainers());

    $("#facebox").css({ "position": "absolute", "-webkit-backface-visibility": "hidden" });
    $("body,html").css("overflow", "hidden").css("position", "relative");
    $(".cc-page-main-container").addClass("no-scroll");
    $("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px" });

    var divcont = document.createElement("div");
    $(divcont).addClass("long-scroll").css({ 'min-height': (window.innerHeight) + "px", "position": "relative" });


    $(".long-scroll").show();

    $("body").append(divcont);
    $(divcont).append($("#facebox_overlay")[0]);
    $(divcont).append($("#facebox")[0]);



    CallAjax('/Tab/ShowDialogAttr/', { attrId: attrId }, null, null, function (msg) {

        $("#popup_attr_dialog_cont").html(msg);

        findFaceboxCenter();

        $("#facebox").css({ "z-index": "999999" });
        $("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px", 'z-index': '99999' });
        $("#facebox_overlay").css({ 'overflow': 'auto' });



    }, null, "GET");

}

function getPrdPriceFromAttrs() {
    var attrs = GetPrdAttrs();
    var total_for_add = 0.0;
    var total_for_multiplication = 1.0;
    var hasAttrValue = false;
    var hasPriceRange = false;
    var hasInPriceRange = false;
    var total_for_coverarea = 0;
    var arrAttrSett = [];
    var attrSettCount = 0;
    for (var i = 0; i < attrs.ArrAttrs.length; i++) {
        var price = attrs.ArrAttrs[i].Price;
        if (attrs.ArrAttrs[i].AttrType == 'multiplication') {
            hasAttrValue = true;
            total_for_multiplication = total_for_multiplication * price;
        }
        else if (attrs.ArrAttrs[i].AttrType == 'cover') {
            hasAttrValue = true;
            arrAttrSett[attrSettCount] = price;
            //total_for_multiplication = total_for_multiplication * price;
            attrSettCount++;

        }
        else if (price && price > 0) {
            hasAttrValue = true;
            total_for_add += parseFloat(price);
        }
    }

    if (arrAttrSett.length == 3 && arrAttrSett[0] > 0 && arrAttrSett[1] > 0 && arrAttrSett[2] > 0) {

        var arrFromSurfaceArea = [];
        var arrToSurfaceArea = [];
        var arrPriPerUnit = [];
        var prCount = 0;
        var coverArea = arrAttrSett[0] * arrAttrSett[1] + 2 * arrAttrSett[0] * arrAttrSett[2] + 2 * arrAttrSett[1] * arrAttrSett[2];
        if (!$('#priceRange').is(':hidden')) {
            $('#priceRange tr.priceRangeRow').each(function () {

                var surfaceFromArea = $(this).find(".surfaceArea").attr('data-from-area');
                var surfaceToArea = $(this).find('.surfaceArea').attr('data-to-area');
                var pricePerUnit = $(this).find(".pricePerUnit").attr('attr_prval');

                arrFromSurfaceArea[prCount] = surfaceFromArea;
                arrToSurfaceArea[prCount] = surfaceToArea;
                arrPriPerUnit[prCount] = pricePerUnit;
                prCount++;

            });
            var coverAreaArrIndex = 0;

            for (var i = 0; i < arrFromSurfaceArea.length; i++) {

                if (arrFromSurfaceArea.length == 1) {
                    if (coverArea >= arrFromSurfaceArea[i]
                        && coverArea <= arrToSurfaceArea[i]
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrFromSurfaceArea[i] != "") {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;
                    } else if (coverArea > arrToSurfaceArea[i]
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrFromSurfaceArea[i] != "") {
                        hasInPriceRange = false;
                    } else if (coverArea >= arrFromSurfaceArea[i]
                        && isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrFromSurfaceArea[i] != "") {
                        hasInPriceRange = true;
                        coverAreaArrIndex = i;
                    }
                    else if (coverArea <= arrToSurfaceArea[i] && arrFromSurfaceArea[i] == "") {
                        coverAreaArrIndex = i;
                        hasInPriceRange = true;
                    } else if (coverArea >= arrFromSurfaceArea[i]
                        && arrFromSurfaceArea[i] != ""
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))) {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;
                    } else if (coverArea > arrToSurfaceArea[i] && arrFromSurfaceArea[i] == "") {
                        hasInPriceRange = false;
                    } else if (coverArea > arrToSurfaceArea[i]
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))) {
                        hasInPriceRange = false;
                    }

                } else if (arrFromSurfaceArea.length > 1) {

                    if (coverArea >= arrFromSurfaceArea[i]
                        && coverArea <= arrToSurfaceArea[i]
                        && i != arrFromSurfaceArea.length - 1
                        && arrFromSurfaceArea[i] != ""
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))) {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;

                    } else if (coverArea <= arrToSurfaceArea[i]
                        && i != arrFromSurfaceArea.length - 1
                        && arrFromSurfaceArea[i] == ""
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))) {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;

                    } else if (i == arrFromSurfaceArea.length - 1
                        && isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrFromSurfaceArea[i] <= coverArea
                        && arrFromSurfaceArea[i] != "") {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;

                    } else if (i == arrFromSurfaceArea.length - 1
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrFromSurfaceArea[i] <= coverArea && arrToSurfaceArea[i] >= coverArea
                        && arrFromSurfaceArea[i] != "") {

                        coverAreaArrIndex = i;
                        hasInPriceRange = true;

                    } else if (i == arrFromSurfaceArea.length - 1
                        && !isNaN(parseFloat(arrToSurfaceArea[i]))
                        && arrToSurfaceArea[i] <= coverArea
                        && arrFromSurfaceArea[i] != "") {

                        hasInPriceRange = false;

                    }

                }
            }
            hasPriceRange = true;
            if (hasInPriceRange) {
                total_for_coverarea = arrPriPerUnit[coverAreaArrIndex] * coverArea;
            } else {
                hasPriceRange = false;
                total_for_coverarea = coverArea;
            }


        } else {

            total_for_coverarea = coverArea;
        }
        total_for_coverarea = total_for_coverarea.toFixed(2);
        coverArea = coverArea.toFixed(2);

        var sprice = parseFloat($(".selected").find('.offer-price-only').data("realprice"));
        $('.totalSurfaceArea').html(coverArea);
        if (hasPriceRange) {
            $('.pricePerUnitSelected').html(arrPriPerUnit[coverAreaArrIndex] + " " + window.cc_page_info.store_currency_symbol);
        } else {
            $('.pricePerUnitSelected').html(sprice + " " + window.cc_page_info.store_currency_symbol);
        }


    } else {
        var sprice = parseFloat($(".selected").find('.offer-price-only').data("realprice"));
        $('.totalSurfaceArea').html("");
        $('.pricePerUnitSelected').html(sprice + " " + window.cc_page_info.store_currency_symbol);
    }

    return {
        hasAttrValue: hasAttrValue,
        total_for_multiplication: total_for_multiplication,
        total_for_add: total_for_add,
        total_for_coverarea: total_for_coverarea,
        hasPriceRange: hasPriceRange


    }

}
$(document).ready(function () {


    $(".attributes").on("change", "input,select", function (e) {
        updatePrdPriceFromAttrs();
        //changeSKUBySelectingAttrOption();
        var attr_id = $(e.currentTarget).attr('attr_id');
        //changeSKUBySelectingAttrOption(e.delegateTarget.classList[1].replace("atrr", ""));
        if (typeof attr_id != 'undefined' && attr_id > 0)
        {
            changeSKUBySelectingAttrOption(attr_id);
        }
    })
    if ($('.input-only-digit').spinner) {
        $('.input-only-digit').spinner({
            stop: function (event, ui) { updatePrdPriceFromAttrs(); }
        });
    }



    //$(".attr_cont").on("click", function (e) {



    //    changeSKUBySelectingAttrOption(e.delegateTarget.classList[1].replace("atrr", ""));
    //})

    $(".cc-select-by-image-cont").on({
        mouseenter: function () {
            var divZoom = null;
            var that = this;

            if ($(".attr-zoom-icon").length == 0) {

                divZoom = $("<div/>").addClass("attr-zoom-icon").show().append("<i class='fa fa-search'></i>").appendTo("body");
            }
            else {

            }
            divZoom = $(".attr-zoom-icon").show().appendTo(this);

            divZoom.click(function (e) {

                $.fancybox({
                    content: "<img src='" + $(that).data("origpic") + "' width='100%' style='max-width:100%;'/>",
                    autoScale: true,
                    autoDimensions: true,
                    showCloseButton: true,
                    type: 'image',
                    resize: 'Auto',

                    fitToView: true,
                    autoSize: true

                });



                e.preventDefault();

                return false;

            });


        },
        mouseleave: function () {
            //stuff to do on mouse leave
            $(".attr-zoom-icon").hide();
        }
    }, ".cc-select-by-image", function () {
    })
})

function FacebookConnect(type, sid) {
    var host = "";
    try {
        host = encodeURIComponent(window.location.href);
    }
    catch (e) { }

    window.open(appUrl + "/Tab/FacebookConnect/?type=" + type + "&pageid=" + PageId + "&host=" + host + "&sid=" + sid, "_blank", "width=400, height=400");
}
function focusElement(onlyMobile, selector) {
    if (!onlyMobile || (onlyMobile && isMobile)) {
        $('html, body').animate({
            scrollTop: $(selector).offset().top - 80
        }, 1000);
    }
}
function iframeReload(orderId, paymentType, data) {
    var frm = { lang: window.cc_page_info.store_current_lang_id, orderId: orderId, paymentType: paymentType, data: data, numOfPayments: $('#meshulam-payments').val() };
    //$("#checkout_container").mask("...");
    $.ajax({
        type: 'POST',
        url: '/payment/GetUpdatedPaymentUrl/',
        data: frm,
        success: function (response) {
            $("#frmPayment").attr('src', response);
        }
    });

    //CallAjax(appUrl + '/payment/GetUpdatedPaymentUrl/', frm, null, null, function (response) {
    //    $("#frmPayment").attr('src', response);
    //}, null, "POST");
}
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
}(jQuery));

var GlobalCurrencyConverter = {
    updateCurRate: function (selectedCurrency, isinit) {
        // update currencies
        // get currency rates
        var currencyRateStr = localStorage.getItem('Wobily_CR');
        var currenntCurrency = localStorage.getItem('Wobily_CurCurrency');

        if (currenntCurrency != selectedCurrency || isinit) {
            var currencyRateObj = JSON.parse(currencyRateStr);

            // alert(eval("currencyRateObj[0]."+selectedCurrency).symbol);
            var newCurRate, newCurSymbol;

            // Loop for all rate and get the right rate and symbol
            for (var i = 0; i < currencyRateObj.length; i++) {
                var itemCurrency = eval("currencyRateObj[" + i + "]." + selectedCurrency);

                if (typeof itemCurrency !== "undefined") {
                    newCurRate = itemCurrency.rate;
                    newCurSymbol = itemCurrency.symbol;
                }
            }
            // category page - Update the currency sumbol
            $(".cc-prd-cur-val").each(function (index) {
                $(this).html(newCurSymbol);
            });
            // category page - Update the currency value
            $(".cc-price").each(function (index) {
                var origPrice = $(this).data("realprice");
                var newPrice = newCurRate * origPrice;
                newPrice = Math.round(newPrice * 100) / 100;
                $(this).html(newPrice);
            });

            $('.cc-car-updated-rate').remove();
            if (window.cc_page_info.store_currency_letters != selectedCurrency) {
                if ($('.cc-car-updated-rate').length == 0) {
                    // product page - Update the currency sumbol and value
                    $(".offer-price, .attrObjectInput option, .deal-prd-select option").each(function (index) {
                        var origPrice = $(this).find('span[data-realprice]').attr('data-realprice');//$(this).data("price");
                        if (($(this)[0].tagName.toLowerCase() == 'option' && origPrice && typeof origPrice != 'undefined' && origPrice > 0) || $(this)[0].tagName.toLowerCase() != 'option') {

                            var newPrice = newCurRate * origPrice;
                            newPrice = Math.round(newPrice * 100) / 100;
                            newPrice = formatNumber(newPrice);
                            $(this).append(" <span class='cc-car-updated-rate'>[" + newPrice + newCurSymbol + "]</span>");
                        }
                    });
                }
            }
            localStorage.setItem('Wobily_CurCurrency', selectedCurrency);
        }
    },
    getCurrencyDropDown: function (curs) {
        var arrCurs = curs.split(',')
        var htmlUl = "";
        for (var i = 0; i < arrCurs.length; i++) {
            var arrItemCur = arrCurs[i].split('_');
            if (arrItemCur.length == 2) {
                htmlUl += '<li><a title="' + arrItemCur[0] + '" href="javascript:CurrencyConverter.updateCurRate(' + '\'' + arrItemCur[0] + '\'' + ')">' + arrItemCur[1] + '</a></li>';
            }
        }
        var html_ddl = '<span class="dropdown cc-ddl-currency">' +
            '<button class="btn btn-primary dropdown-toggle btn-xs ddl-cur" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
            htmlUl +
            '</ul>' +
            '</span>';
        return html_ddl;
    },
    init: function (lang, curs) {

        // Append the currency ddl to all prices at category page and product page                           
        var html_ddl = CurrencyConverter.getCurrencyDropDown(curs);
        $(".cc-prd-cur, .offer-price-container").each(function (index) {

            if ($(this).find('.dropdown').length == 0) {
                $(this).prepend(
                    html_ddl
                );
            }
        });


        if (storeid != null && storeid != '' && typeof storeid != "undefined") {
            // Load the rates
            this.loadCurrencyRates(storeid);
        }
        var curCurrency = localStorage.getItem('Wobily_CurCurrency');
        if (curCurrency != null) {
            // update the lasr selected currency
            CurrencyConverter.updateCurRate(curCurrency, true);
        }
    },
    loadCurrencyRates: function (storeid) {


        var jqxhr = $.post(window.cc_page_info.ext_url + "CurrencyConverter/CR", { storeid: storeid },
            function (response) {
                //alert(response);
                //console.error(response)/
                localStorage.setItem('Wobily_CR', response);
            }).fail(function (msg) {
                console.error(msg);
            })



    }

}

function onDealProductSelected(selPrd) {
    selPrd = $(selPrd);
    var dealSecondChosenProduct = selPrd.find(":selected").data("sec-chosen-id");
    var dealId = selPrd.data("deal-id");

    selPrd.closest(".deal-container").find("[name='dealtype']").prop("checked", true);

    CallAjax('/Tab/GetDealProductAttrs/', { SecProductId: dealSecondChosenProduct, DealId: dealId }, null, null, function (msg) {

        selPrd.closest(".deal-container").find('.attr-deal-cont').html(msg);
        $("#dealattr" + dealId).show();

        cs.HandleColorsAttrs();
        cs.SetOnlyDigitsInput();
    }, null, "GET");
}
function showConfirmDialog(txt, callback) {

    var confirmModal = $('#confirmModal');
    confirmModal.find(".modal-body").html(txt);

    confirmModal.find('#confirmModal_okButton').click(function (event) {
        callback();
        $('#confirmModal').modal('hide');
    });
    $('#confirmModal').modal();

};

//@@@ Add quantity of product in the cart
$(document).on("click", ".addQuantityDiscount", function (e) {
    var qty = $(this).closest('tr').find('.quantityAdd').data('spend-qty');
    var pid = $('.add').data("pid");
    var isInUpsellDialog = $('.add').closest("#upsale_products").length > 0;
    addToCartHandler($('.add'), pid, null, null, isInUpsellDialog, qty);
});


function openRunAPIPickupPointDiag() {

    cs.SetTop();
    jQuery.facebox(RunAPIPickupPointsContainers());

    $("#facebox").css({ "position": "absolute", "-webkit-backface-visibility": "hidden" });
    $("body,html").css("overflow", "hidden").css("position", "relative");
    $(".cc-page-main-container").addClass("no-scroll");
    $("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px" });

    var divcont = document.createElement("div");
    $(divcont).addClass("long-scroll").css({ 'min-height': (window.innerHeight) + "px", "position": "relative" });


    $(".long-scroll").show();

    $("body").append(divcont);
    $(divcont).append($("#facebox_overlay")[0]);
    $(divcont).append($("#facebox")[0]);

    var shippingType = $("#cbx_choose_shiping_option option:selected").attr("data-shipingname");

    CallAjax('/Tab/RunApiPickupPoints/', { typesShippingOptionTypes: shippingType, isAllPickupPoint: true }, null, null, function (msg) {

        $("#run_pickup_points_dialog_cont").html(msg);

        findFaceboxCenter();

        $("#facebox").css({ "z-index": "999999" });
        $("#facebox_overlay").css({ 'min-height': ($("#facebox").height() + 100) + "px", 'z-index': '99999' });
        $("#facebox_overlay").css({ 'overflow': 'auto' });



    }, null, "GET");


}



function RunAPIPickupPointsContainers() {
    var pickup_points_cont = "";
    var checkout_cont_suffix = "";

    pickup_points_cont = '<div class="textAlignLang" id="run_pickup_points_container"><div id="run_pickup_points_dialog_cont"><div style="text-align:center; padding:10px;"><img src="https://cdnw.wobily.com/system/loading.svg"/></div></div>';
    pickup_points_cont_suffix = "</div>";
    var html = pickup_points_cont + checkout_cont_suffix;

    return html;
}

function PopAttrContainers() {
    var pickup_points_cont = "";
    var checkout_cont_suffix = "";

    pickup_points_cont = '<div class="textAlignLang" id="popup_attr_container"><div id="popup_attr_dialog_cont"><div style="text-align:center; padding:10px;"><img src="https://cdnw.wobily.com/system/loading.svg"/></div></div>';
    popup_attr_cont_suffix = "</div>";
    var html = pickup_points_cont + checkout_cont_suffix;

    return html;
}

function savePickupPointSettings() {

    if ($("input:radio[name='pickupPoints']").is(":checked")) {
        var attrVal = $('input[name="pickupPoints"]:checked').attr("data-pickpoint");
        var ncode = $('input[name="pickupPoints"]:checked').val();
        var street = $('input[name="pickupPoints"]:checked').attr("data-street");
        var city = $('input[name="pickupPoints"]:checked').attr("data-city");
        var house = $('input[name="pickupPoints"]:checked').attr("data-house");
        var title = $('input[name="pickupPoints"]:checked').attr("data-name");
        var shippingType = $("#cbx_choose_shiping_option option:selected").val();


        cart.ShipingArgs = [];

        cart.ShipingArgs.push({ shiping_type: shippingType, name: "customeValue1", value: street });
        cart.ShipingArgs.push({ shiping_type: shippingType, name: "customeValue2", value: city });
        cart.ShipingArgs.push({ shiping_type: shippingType, name: "customeValue3", value: house });
        cart.ShipingArgs.push({ shiping_type: shippingType, name: "customeValue4", value: ncode });
        cart.ShipingArgs.push({ shiping_type: shippingType, name: "customeValue5", value: title });

        $('#shiping_run_cart_error').hide();
        $('.run-pickups-result').show();
        $('.run-pickups-dynamic-result').html(attrVal);

        jQuery(document).trigger('close.facebox');
    } else {
        jQuery(document).trigger('close.facebox');
        $('.run-pickups-result').hide();
        $('#shiping_run_cart_error').show();


    }

}

function ShowHidePassowrd(element) {

    if ($(element + ' input').attr("type") == "text") {
        $(element + ' input').attr('type', 'password');
        $(element + ' i').addClass("fa-eye-slash");
        $(element + ' i').removeClass("fa-eye");
    } else if ($(element + ' input').attr("type") == "password") {
        $(element + ' input').attr('type', 'text');
        $(element + ' i').removeClass("fa-eye-slash");
        $(element + ' i').addClass("fa-eye");
    }

}

function AttributeSKUModel() {
    ProductId = "";
    AttrId = "";
    OptionId = "";

}

function changeSKUBySelectingAttrOption(attrId) {

    var attrArrobj = [];

    var attrs = GetPrdAttrs();

    console.log(attrs);
    console.log(attrId);

    for (var i = 0; i < attrs.ArrAttrs.length; i++) {

        var attr = jQuery.extend(true, {}, AttributeSKUModel);

        attr.ProductId = parseInt(attrs.ProductId);
        attr.AttrId = parseInt(attrs.ArrAttrs[i].AttrId);
        attr.OptionId = parseInt(attrs.ArrAttrs[i].OptionId);

        if (attr != null)
            attrArrobj[attrArrobj.length] = attr;
    }

    CallAjax("/Tab/GetHhmlToChangeAtrrsSKU", { attrsobj: JSON.stringify(attrArrobj), attrId: parseInt(attrId) }, null, null, function (res) {


        if (res.Success) {

            $(".product-sku").data("externalId", res.SKU).html(res.SKU);

        } else {
            $(".product-sku").data("externalId", res.SKU).html(res.SKU);
        }


    }, function (msg) {


    }, "POST");




}

function LoadMainProductImges(prodId, isMobile, picUrl, img_alt) {

    CallAjax("/Tab/GetHtmlOfProductMultiImages", { prodId: prodId, isMobile: isMobile }, null, null, function (res) {

        if (isMobile) {
            $("#mobileImageContent").html(res);
            $("#showMainImageMobile").hide();

        } else {
            $("#images_container").html(res);
            $('.prod-imgs #img-0 img').attr('src', picUrl).attr('alt', img_alt);
            $('.prod-imgs #img-0 img').attr('data-img-index', picUrl);
            $("#showMainImage").hide();
        }




    }, function (msg) {


    }, "POST");

}

function removeSelectedItemClicked() {
    // Collect all selected checkbox values into an array
    var selectedItems = [];

    $("input[name='prod-item']:checked").each(function () {
        var data = JSON.parse($(this).val()); // Parse JSON value
        selectedItems.push({ guid: data.guid, id: data.pid });
    });

    if (selectedItems.length === 0) {
        // Show Facebox alert instead of regular alert
        var buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" class="textAlignOpp" ><input type="button" class="uibutton special big" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
        cs.SetTop();
        jQuery.facebox('<div class=\'alert  alert-danger\'>' + T.Global.SelectAtLeastOneOption + '</div>' + buttons);

        // Handle "OK" button click to close Facebox
        $(document).on("click", "#closeFacebox", function () {
            $.facebox.close();
        });
        return;
    }

    if (selectedItems.length >= 1) {

        var message = T.Global.AreYouSureYouWantToRemove +'?';
        message = message.replace("{0}", selectedItems.length);

        var buttons = '<div style="background:#eee;padding:10px;border-top:solid 1px #DDD;" class="textAlignOpp" ><button id="confirmRemove">' + Resources.Yes + '</button><input type="button" class="uibutton special big" value="' + Resources.Close + '" onclick="$(\'.close_image\').click()"/><div class="clear"></div></div>';
        // Show Facebox confirmation for a single item
        $.facebox('<div class=\'alert  alert-danger\'>' + message + '</div>' + buttons);

        // Handle Yes button click
        $(document).on("click", "#confirmRemove", function () {
            $.facebox.close();
            removeProducts(selectedItems); // Call function to remove product
        });



    } else {
        // If multiple items, remove directly without confirmation
        removeProducts(selectedItems);
    }
}
function checkAllClicked(item) {
    $("input[name='prod-item']").prop("checked", item.checked);
}
function prodItemClicked() {
    $("#check-all-item").prop("checked", $("input[name='prod-item']:checked").length === $("input[name='prod-item']").length);
}
// Function to remove selected products
function removeProducts(items) {

    cs.DeleteProductFromCart(items);
}
function ShowDiliveryTerms() {
    var diag = MessageDialog(T.Global.DeliveryDetails, "<div class='tscrollbar' style='height:100px;font-size:13px;padding:5px;'>" + $("#delivery_details").html() + "</div>", function () {
        $(this).dialog('close');
    }, "auto", 100);

    fallbackfixedDialogs(diag);
}


function AutocompleteCitiesAndStreets() {

    try {
        // ---- Safety checks: do nothing if Bloodhound or typeahead aren't loaded ----
        if (typeof Bloodhound === 'undefined') {
            console.warn('AutocompleteCitiesAndStreets: Bloodhound is not available.');
            return;
        }

        if (!$.fn.typeahead) {
            console.warn('AutocompleteCitiesAndStreets: typeahead plugin is not available.');
            return;
        }

        // ----------------- Shared city engine (for all cities) -----------------
        var lastCityQuery = '';

        var cityEngine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/Tab/GetCities?term=%QUERY',
                wildcard: '%QUERY',

                // capture current query so we can sort by it
                prepare: function (query, settings) {
                    lastCityQuery = (query || '').toLowerCase();
                    return settings; // url already has %QUERY
                },

                transform: function (data) {
                    var items = $.map(data, function (item) {
                        return {
                            label: item.label,
                            value: item.value
                        };
                    });

                    if (!lastCityQuery) return items; // safety, though minLength=2

                    var q = lastCityQuery;

                    // Keep ONLY items where label contains the query (case-insensitive)
                    items = $.grep(items, function (it) {
                        var la = (it.label || '').toLowerCase();
                        return la.indexOf(q) !== -1;
                    });

                    // If nothing matches, return empty list
                    if (!items.length) {
                        return [];
                    }

                    // Sort so items where query appears earlier (prefix) come first
                    items.sort(function (a, b) {
                        var la = (a.label || '').toLowerCase();
                        var lb = (b.label || '').toLowerCase();

                        var ia = la.indexOf(q);
                        var ib = lb.indexOf(q);

                        // both ia and ib here are != -1 because we filtered above
                        if (ia !== ib) return ia - ib;

                        // same position → alphabetical
                        return la.localeCompare(lb);
                    });

                    return items;
                }

            }
        });

        // this can throw if Bloodhound is missing, so keep inside try
        cityEngine.initialize();

        // STREET ENGINE
        function createStreetEngine($cityId) {
            var lastStreetQuery = '';

            var engine = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/Tab/GetStreets',
                    prepare: function (query, settings) {
                        var cityIdRaw = $cityId.val();

                        // Do NOT call Ajax if cityId is null/empty/0
                        if (!cityIdRaw || cityIdRaw === '0' || cityIdRaw === 0) {
                            return false; // cancel request
                        }

                        lastStreetQuery = (query || '').toLowerCase();

                        settings.url = '/Tab/GetStreets?term=' +
                            encodeURIComponent(query) +
                            '&cityId=' + encodeURIComponent(cityIdRaw);

                        return settings;
                    },
                    transform: function (data) {
                        var items = $.map(data, function (item) {
                            return {
                                label: item.label,
                                value: item.value
                            };
                        });

                        if (!lastStreetQuery) return items;

                        var q = lastStreetQuery;

                        // Keep ONLY items where label contains the query
                        items = $.grep(items, function (it) {
                            var la = (it.label || '').toLowerCase();
                            return la.indexOf(q) !== -1;
                        });

                        if (!items.length) {
                            return [];
                        }

                        items.sort(function (a, b) {
                            var la = (a.label || '').toLowerCase();
                            var lb = (b.label || '').toLowerCase();

                            var ia = la.indexOf(q);
                            var ib = lb.indexOf(q);

                            if (ia !== ib) return ia - ib;

                            return la.localeCompare(lb);
                        });

                        return items;
                    }

                }
            });

            engine.initialize();
            return engine;
        }

        // Inline wiring 
        function wireCityStreetPair(citySel, cityIdSel, streetSel, streetIdSel) {
            var $city = $(citySel);
            var $cityId = $(cityIdSel);
            var $street = $(streetSel);
            var $streetId = $(streetIdSel);

            if (!$city.length || !$street.length) return;

            // then remove readonly so Typeahead can work.
            var cityRestricted = $city.attr('isreadonly');
            var streetRestricted = $street.attr('isreadonly');

            if (cityRestricted==='true') {
                $city.data('restrictToList', true);
                
            }
            if (streetRestricted==='true') {
                $street.data('restrictToList', true);
                
            }

            // City
            $city.typeahead(
                {
                    minLength: 2,
                    highlight: true
                },
                {
                    name: 'cities',
                    display: 'label',
                    limit: 20,
                    source: cityEngine,
                    templates: {
                        suggestion: function (item) {
                            return "<div class='metrouicss'>" +
                                "<a style='font-size:12px; color:#000;'>" +
                                item.label +
                                "</a></div>";
                        },
                        notFound: function () {
                            return "<div class='metrouicss'>" +
                                "<span style='font-size:12px; color:#000;'>" + Resources.NoItemsFound + "</span>" +
                                "</div>";
                        }
                    }
                }
            );

            // When user selects a city from list
            $city.on('typeahead:select', function (e, item) {
                $city.typeahead('val', item.label);

                // remember last selected label
                $city.data('selectedLabel', item.label);

                if ($cityId.length) {
                    $cityId.val(item.value);
                }

                // reset street when city changes
                $street.typeahead('val', '');
                $street.data('selectedLabel', '');
                if ($streetId.length) {
                    $streetId.val('');
                }
            });

            // clear the hidden city Id and street Id.
            $city.on('input', function () {
                var selectedLabel = $city.data('selectedLabel') || '';
                if ($city.val() !== selectedLabel) {
                    if ($cityId.length) {
                        $cityId.val('');
                        $streetId.val('');
                        $street.val('');
                    }
                }
            });

            // On blur: if this field is "restricted to list", then final value MUST be a selected item.
            $city.on('blur', function () {
                if ($city.data('restrictToList')) {
                    var selectedLabel = $city.data('selectedLabel') || '';
                    if ($city.val() !== selectedLabel) {
                        // user didn't pick from list → clear
                        //$city.val('');
                        if ($cityId.length) {
                            $cityId.val('');
                            $streetId.val('');
                            $street.val('');
                        }
                    }
                }
            });

            // STREET
            var streetEngine = createStreetEngine($cityId);

            $street.typeahead(
                {
                    minLength: 2,
                    highlight: true
                },
                {
                    name: 'streets',
                    display: 'label',
                    limit: 20,
                    source: function (query, sync, async) {
                        var cityIdRaw = $cityId.val();

                        // No cityId 
                        if (!cityIdRaw || cityIdRaw === '0' || cityIdRaw === 0) {
                            return sync([]);
                        }

                        return streetEngine.search(query, sync, async);
                    },
                    templates: {
                        suggestion: function (item) {
                            return "<div class='metrouicss'>" +
                                "<a style='font-size:12px; color:#000;'>" +
                                item.label +
                                "</a></div>";
                        },
                        notFound: function () {
                            return "<div class='metrouicss'>" +
                                "<span style='font-size:12px; color:#000;'>" + Resources.NoItemsFound +"</span>" +
                                "</div>";
                        }
                    }
                }
            );

            // When user selects a street from list
            $street.on('typeahead:select', function (e, item) {
                $street.typeahead('val', item.label);
                $street.data('selectedLabel', item.label);

                if ($streetId.length) {
                    $streetId.val(item.value);
                }
            });

            // On manual typing, clear streetId if value changed away from selected label
            $street.on('input', function () {
                var selectedLabel = $street.data('selectedLabel') || '';
                if ($street.val() !== selectedLabel) {
                    if ($streetId.length) {
                        $streetId.val('');
                    }
                }
            });

            // On blur: enforce "must be from list" if restricted
            $street.on('blur', function () {
                if ($street.data('restrictToList')) {
                    var selectedLabel = $street.data('selectedLabel') || '';
                    if ($street.val() !== selectedLabel) {
                        //$street.val('');
                        if ($streetId.length) {
                            $streetId.val('');
                        }
                    }
                }
            });
        }

        // wire for both case
        wireCityStreetPair("#City", "#CityId", "#Street", "#StreetId");
        wireCityStreetPair("#RecipientCity", "#RecipientCityId", "#RecipientStreet", "#RecipientStreetId");

    } catch (err) {
        // Last-chance safety: log and fail silently rather than breaking the page
        console.error('AutocompleteCitiesAndStreets initialization failed:', err);
    }
}









;
var curWindow = window;
function cbx_payment_change(e, cbxStoreId, selectedData) {
   // debugger;
    var selected = null;
    var val = "";

    if (selectedData) {
        val = selectedData.selectedData.value;
    } else {
        selected = $(e).find("option:selected");
        val = $(e).val();
    }

    //var isShowForm = selected.data("isshowform");

    if (false) {
        $("#customer_fields_cont").hide();
        $("#dynamic_payment_ajax").show();
    } else {
        $("#customer_fields_cont").show();

        //if ($("#facebooklogincont").css("display") != "none") {
        //    $("#dynamic_payment_ajax").hide();
        //}
        //else {
            $("#dynamic_payment_ajax").show();
        //}
    }

    if (!cbxStoreId) {
        cbxStoreId = storeid;
    }

    var form = cs.PreperFormToSendAjax();
    form = merge_options(form, { id: cbxStoreId, type: val, context: storeContext });

    if (typeof (reseller_key) != 'undefined' && typeof (reseller_value) != 'undefined') {
        form = merge_options(form, { skey: reseller_key, sval: reseller_value });
    }
    form = merge_options(form, { lang: window.cc_page_info.store_current_lang_id });
    CallAjax("/Payment/GetPaymentAjaxUI/", form, "dynamic_payment_ajax", null, function () { }, null, "POST");

}

function CheckNewsletterRequredValidation() {
    $('#IsConfirmNewsLetterValidation .field-validation-error').remove();
    if (!$("form#customer_fields_form").find("#IsConfirmNewsLetter").is(":checked")
        && $("form#customer_fields_form").find("#IsConfirmNewsLetter").attr('isconfirmnewsletter') == 'True') {
        $("#IsConfirmNewsLetterValidation").append('<span class="field-validation-error">' + Resources.Error_Required + '</span>');

        return false;
    }

    return true;
}

function CheckDisableManualEditCityAndStreetsValidation() {

    var errorMsg = Resources.YouHaveToSelectFromDorpdown;
    var isValid = true;

    //is this textbox (isreadonly="true")
    function isReadonly(selector) {
        var v = $(selector).attr('isreadonly');
        return v && v.toString().toLowerCase() === "true";
    }

    //remove previous error for a textbox
    function clearError(selector) {
        var $input = $(selector);
        var $wrapper = $input.closest('.twitter-typeahead');

        // Where to remove the error class from
        var $targetInput = $wrapper.length
            ? $wrapper.find('.tt-input').first()      
            : $input;                                 

        //after wrapper or after input
        var $container = $wrapper.length ? $wrapper : $input;

        $targetInput.removeClass('input-validation-error');
        $container.next('.field-validation-error').remove();
    }

    // Helper: add error for a textbox
    function addError(selector, msg) {
        var $input = $(selector);
        var $wrapper = $input.closest('.twitter-typeahead');

        // Where to add the error class
        var $targetInput = $wrapper.length
            ? $wrapper.find('.tt-input').first()     
            : $input;                                

        // Where to place the error <span>
        var $container = $wrapper.length ? $wrapper : $input;

        // Add error class on the visible input
        $targetInput.addClass('input-validation-error');

        // Remove old message and add new one
        $container.next('.field-validation-error').remove();
        $container.after('<span class="field-validation-error">' + msg + '</span>');
    }

    // Clear previous errors when any of the fields is readonly
    if (isReadonly('#City') || isReadonly('#Street') || isReadonly('#RecipientCity') || isReadonly('#RecipientStreet')) {

        clearError('#City');
        clearError('#Street');
        clearError('#RecipientCity');
        clearError('#RecipientStreet');
    }

    // Validate only when the field is readonly (autocomplete mode)
    if (isReadonly('#City') && $("#CityId").val() === "") {
        addError('#City', errorMsg);
        isValid = false;
    }

    if (isReadonly('#Street') && $("#StreetId").val() === "") {
        addError('#Street', errorMsg);
        isValid = false;
    }

    if (isReadonly('#RecipientCity') && $("#RecipientCityId").val() === "") {
        addError('#RecipientCity', errorMsg);
        isValid = false;
    }

    if (isReadonly('#RecipientStreet') && $("#RecipientStreetId").val() === "") {
        addError('#RecipientStreet', errorMsg);
        isValid = false;
    }

    return isValid;
}



function validateIsraeliID(id) {
    // 1. בדיקת אורך ומספרים (תקין 9 ספרות)
    if (typeof id !== 'string' || id.length !== 9 || !/^\d+$/.test(id)) {
        return false;
    }

    let sum = 0;
    let double = false;

    // 2. מעבר על הספרות מימין לשמאל (או משמאל לימין עם התאמה)
    for (let i = id.length - 1; i >= 0; i--) {
        let digit = parseInt(id[i], 10);

        // ספרות במקומות אי-זוגיים (מימין: 1, 3, 5, 7, 9) מוכפלות ב-2
        if (double) {
            digit *= 2;
            if (digit > 9) {
                digit = digit - 9; // או חיבור ספרות: 1+2=3, 1+4=5, וכו'
            }
        }
        sum += digit;
        double = !double; // החלפת מצב
    }

    // 3. בדיקה סופית: הסכום צריך להתחלק ב-10
    return sum % 10 === 0;
}

function checkIdentityNumberValidation() {

    var $identity = $("#IdentityNumber");

    // If field does not exist, skip validation
    if (!$identity.length) {
        return true;
    }

    // Remove previous error
    $identity.next('.field-validation-error').remove();

    if (!validateIsraeliID($identity.val())) {

        $identity.after(
            '<span class="field-validation-error">' +
            Resources.ThisFieldHasAnInvalidValue +
            '</span>'
        );

        return false;
    }

    return true;
}




var cp = function () {
    return {

        opener_window_id: 0,
        container: "#cart_details",
        validate: function () {
            
            if (!ccValidations.ValidateAll($("#checkout_container"))) {

                
                CheckDisableManualEditCityAndStreetsValidation();

                CheckNewsletterRequredValidation();

                checkIdentityNumberValidation();

                return false;
            }

            if (!/^[0-9\+\-\(\)]+$/.test($("#Phone").val())) {

                $("#Phone").addClass("input-validation-error");
                $("[parentinput=Phone]").not(".required-star").removeClass("field-validation-error");
                $("[parentinput=Phone]").not(".required-star").addClass("field-validation-error");
                $("[parentinput=Phone]").not(".required-star").html(Resources.PhoneNoValidationErr);
                
                
                return false;
            }

            

            
            return CheckNewsletterRequredValidation() && CheckDisableManualEditCityAndStreetsValidation() && checkIdentityNumberValidation();

            
            return true;
        },

        OpenPaypalAdaptive: function () {
            var dg = new PAYPAL.apps.DGFlowMini({ callbackFunction: cp.xx });
            dg.startFlow('https://www.sandbox.paypal.com/webapps/adaptivepayment/flow/pay?paykey=AP-23935319UJ052124C&expType=mini');
        },

        xx: function () { alert(); },

        fill_customer_details: function (isShowCustomerFieldsForm) {

            if (isShowCustomerFieldsForm
                && $("form#customer_fields_form").length == 0) {
                alert("customer_fields_form not found this form");
                throw "customer_fields_form not found this form";
            }

            var customerFiedlsForm = $("form#customer_fields_form");
            var customerFields = new CustomerFields();
            customerFields.FirstName = customerFiedlsForm.find("#FirstName").val();
            customerFields.LastName = customerFiedlsForm.find("#LastName").val();
            customerFields.Phone = customerFiedlsForm.find("#Phone").val();
            customerFields.Email = customerFiedlsForm.find("#Email").val();
            //customerFields.Address = customerFiedlsForm.find("#Address").length > 0 ? customerFiedlsForm.find("#Address").val() : "";
            customerFields.City = customerFiedlsForm.find("#City").length > 0 ? customerFiedlsForm.find("#City").val() : "";
            customerFields.CityId = customerFiedlsForm.find("#CityId").length > 0 ? customerFiedlsForm.find("#CityId").val() : 0;
            if (customerFields.CityId == "") {
                customerFields.CityId = null;
            }

            customerFields.Street = customerFiedlsForm.find("#Street").length > 0 ? customerFiedlsForm.find("#Street").val() : "";
            customerFields.StreetId = customerFiedlsForm.find("#StreetId").length > 0 ? customerFiedlsForm.find("#StreetId").val() : 0;
            if (customerFields.StreetId == "") {
                customerFields.StreetId = null;
            }
            customerFields.HouseNum = customerFiedlsForm.find("#HouseNum").length > 0 ? customerFiedlsForm.find("#HouseNum").val() : "";
            customerFields.IsConfirmNewsLetter = customerFiedlsForm.find("#IsConfirmNewsLetter").is(":checked");
            customerFields.FbId = fbid;
            
            customerFields.Instroductions = customerFiedlsForm.find("#Instroductions").val();

            customerFields.RecipientFirstName = customerFiedlsForm.find("#RecipientFirstName").val();
            customerFields.RecipientLastName = customerFiedlsForm.find("#RecipientLastName").val();
            customerFields.RecipientPhone = customerFiedlsForm.find("#RecipientPhone").val();
            //customerFields.RecipientAddress = customerFiedlsForm.find("#RecipientAddress").val();
            customerFields.RecipientCity = customerFiedlsForm.find("#RecipientCity").val();
            customerFields.RecipientCityId = customerFiedlsForm.find("#RecipientCityId").val();
            if (customerFields.RecipientCityId == "") {
                customerFields.RecipientCityId = null;
            }
            customerFields.RecipientStreet = customerFiedlsForm.find("#RecipientStreet").val();
            customerFields.RecipientStreetId = customerFiedlsForm.find("#RecipientStreetId").val();
            if (customerFields.RecipientStreetId == "") {
                customerFields.RecipientStreetId = null;
            }
            customerFields.RecipientHouseNum = customerFiedlsForm.find("#RecipientHouseNum").val();
            customerFields.CompanyName = customerFiedlsForm.find("#CompanyName").val();
            customerFields.CompanyNumber = customerFiedlsForm.find("#CompanyNumber").val();
            customerFields.IdentityNumber = customerFiedlsForm.find("#IdentityNumber").val();
            return customerFields;
        },

        current_win : null,

        open_window: function (e, url, isShowCustomerFieldsForm, isCheckTransaction, type, isNotWindowOpen) {
            var origText = $.trim($(e).val());
            
            if (typeof(storeContext) != "undefined" && storeContext == "iframe") {
                if (typeof (cs) != "undefined") {
                    cs.SetTop();
                }
            }



            var isValidAttrs = cs.ValidateAttributes($(".cc-custom-attributes"));
            var isValid = this.validate();
            if (/*isShowCustomerFieldsForm &&*/ !isValidAttrs || !isValid) {
                return false;
            }


            
            setBtnDisable(e, origText, true);
            var customerFields = this.fill_customer_details(isShowCustomerFieldsForm);
            cart.CustomerFields = customerFields;
            try {
                GlobalCartEvents.CallCartEvent(storeContext, CartStep.PAYMENT, null, null, null, cart);
            } catch (e) {

            }
            var form = document.getElementById("formsubmitter");
            var json = document.getElementById("data");
            
            if (!form) {
                form = document.createElement("form");
                form.method = "post";

                if (!isNotWindowOpen) {
                    form.target = "ccwin";
                } else {

                    if (storeContext == "iframe") { // is mobile with iframe then redirect payment full page  and not on iframe.
                        form.target = "_top";
                    }

                }

                form.id = "formsubmitter";

                json = document.createElement("input");

                json.name = "data";
                json.id = "data";
                json.setAttribute("id", "data");
                json.type = "hidden";
                form.appendChild(json);
                document.body.appendChild(form);
            }            
            var arrAttrs = GetPrdAttrs('.cc-custom-attributes').ArrAttrs;
            var jsonAttrs = document.getElementById("dataAttrs");            
            if (jsonAttrs == null) {
                jsonAttrs = document.createElement("input");
                jsonAttrs.name = "dataAttrs";
                jsonAttrs.id = "dataAttrs";
                jsonAttrs.setAttribute("id", "dataAttrs");
                jsonAttrs.type = "hidden";
                form.appendChild(jsonAttrs);
            }
            jsonAttrs.value = JSON.stringify(arrAttrs, null, 2);
            
            

            if (!document.getElementById("data")) {
                json = document.createElement("input");
                json.name = "data";
                json.id = "data";
                json.setAttribute("id", "data");
                json.type = "hidden";
                form.appendChild(json);
            }
            var jj;
           
            if (typeof cart != 'undefined' && $.trim(cart) != '' && cart != null)
            {
                jj = cart;                
            }
            else if (typeof CartStorage.get(store_id) != 'undefined' && $.trim(CartStorage.get(store_id)) != '' && CartStorage.get(store_id) != null)
            {
                jj = CartStorage.get(store_id);
                var obj = JSON.parse(jj);
                obj.CustomerFields = customerFields;
                jj = obj;
            }
            else if (typeof localStorage["cart" + store_id] != 'undefined' && $.trim(localStorage["cart" + store_id]) != '' && localStorage["cart" + store_id] != null) {
                jj = localStorage["cart" + store_id];                
                var obj = JSON.parse(jj);
                obj.CustomerFields = customerFields;
                jj = obj;
            }
            if (jj == null || $.trim(jj) == '' || typeof jj == 'undefined')                       
            {
                CallAjax("/Public/ClientJsError", { msg: 'Payment redirecr error', url: location.href, line: 0, colNo: 0, stack: escape('store_id=' + store_id + "&customerFields=" + JSON.stringify(customerFields)), moreTrace: null, isFatal: true });
                alert(T.Global.RefreshYourShoppingCart);
                return false;
            }
            json.value = JSON.stringify(jj, null, 2);

            form.action = protocol == "http" ? url.replace("https://", "http://") : url.replace("http://", "https://");

            if (isNotWindowOpen) {
                $(form).submit();
                return true;
            }

            var win = window.open('/Public/PleaseWait', 'ccwin', 'width=960,height=700,resizable=yes,toolbar=no,status=yes,scrollbars=yes');
            cp.current_win = win;

            try {
                if (win && win.document) {
                    if (win.document.body) {
                        win.document.body.style.cursor = "wait";
                        win.document.body.innerHTML = "<br/><br/><div style='text-align:center;'><b>Please wait...</b><br/><img src='https://cdnw.wobily.com/system/loading.svg'/></div>";
                    }
                }
            
                var left = (screen.width / 2) - (960 / 2);
                var top = (screen.height / 2) - (700 / 2);
                win.moveTo(left, top);

                if (win.focus) {
                    win.focus();
                }

            }
            catch (e) {
            }

            form.submit();

            var that = this;

            if (this.opener_window_id > 0) {
                window.clearInterval(this.opener_window_id);
            }

            this.opener_window_id = window.setInterval(function () {
                if (win && win.closed) {
                    window.clearInterval(that.opener_window_id);
                    that.opener_window_id = 0;

                    if (isCheckTransaction) {
                        $(that.container).mask(Resources.PleaseWait);

                        // must use abstract ajax call for both mobile and web
                        if (cart.OrderId > 0) {
                            $.post("/payment/TransactionChecker/", { id: cart.OrderId, type: type }, function (data) {
                                if (data.Success) {

                                    cs.CompletePayment(cart.OrderId);
                                    cart.OrderId = 0;
                                }

                                $(that.container).unmask();
                            });
                        } else {
                            $(that.container).unmask();
                        }

                    }
                    else {
                        $(that.container).unmask();
                    }

                }
            }, 500);

            return true;

        },

        complete_phone_or_bank: function (e, type) {            

            var isValidAttrs = cs.ValidateAttributes($(".cc-custom-attributes"));
            var isValid = this.validate();
            if (!isValidAttrs || !isValid) {
                return false;
            }
            try {
                GlobalCartEvents.CallCartEvent(storeContext, CartStep.PAYMENT, null, null, null, cart);
            } catch (e) {

            }
            
            var origText = $.trim($(e).val());

            var btnDesktop = $('#dynamic_payment_ajax input').first();
            setBtnDisable(btnDesktop, origText, false);

            var btnMobile = $('#dynamic_payment_ajax .btn-payment-mobile input');
            if (btnMobile.length > 0) {
                setBtnDisable(btnMobile, origText, false);
            }
            var customerFields = cp.fill_customer_details(true);
            cart.CustomerFields = customerFields;
            $('#checkout_container').mask('...');
            var phone = $("#checkout_container #Phone").val();
            
            if (type == 'phone') {
                type = 3;
            }
            else {
                type = 4; // bank
            }

            var skey = "";
            var sval = "";
            if (typeof (reseller_key) != 'undefined' && typeof (reseller_value) != 'undefined') {
                skey = reseller_key;
                sval = reseller_value;
            }
            var arrAttrs = GetPrdAttrs('.cc-custom-attributes').ArrAttrs;

            var form = { dataAttrs: JSON.stringify(arrAttrs, null, 2), lang: window.cc_page_info.store_current_lang_id, context: storeContext, id: storeid, type: type, phone: phone, data: JSON.stringify(cart, null, 2), isConfirmPayment: true, actionType: 0, skey: skey, sval: sval };
            
            CallAjax("/payment/Redirect", form, null, null, function (msg) {
                
                if (msg.Success == true) {
                    // valid
                    //cs.CompletePayment(msg.OrderId);
                    cs.RedirectToCheckoutCompleted(msg.orderEncId);
                }
                else
                {
                    // error products
                    $('#checkout_container').unmask();
                    var errMsg = T.Global.YouCantContinueWithThePurchase;
                    if (msg.ErrorType == 20/*CuponUseOnceError*/) {
                        errMsg = T.Global.ThisCouponHasBeenUsedInThePast;
                    }
                    alert(errMsg);
                    //CallAjax("/payment/ErrorProductsValidation", { id: storeid, data: JSON.stringify(cart, null, 2) }, null, null, function (msg) {

                    //    var diag = MessageDialog("title", "aaaa", function () {
                    //        $(this).dialog('close');
                    //    }, "auto", 100);

                    //}, function () { }, 'POST');
                   
                }
            }, function () { });
        }

    }

}();
function setBtnDisable(btn, origText, setTime)
{
    $(btn).val(Resources.PleaseWait + '...');
    $(btn).prop("disabled", true);
    $(btn).removeClass('active');
    $(btn).addClass('disabled');
    if (setTime) {
        setTimeout(function () { setBtnEnable(btn, origText); }, 10000);
    }
}
function setBtnEnable(btn, origText) {
    $(btn).val(origText);
    $(btn).prop("disabled", false);
    $(btn).removeClass('disabled');
    $(btn).addClass('active');    
};
/*!
 * Suggest jQuery plugin
 *
 * Copyright (c) 2012 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 *
 * $('#container').suggest(haystack, {
 *   suggestionColor   : '#cccccc',
 *   moreIndicatorClass: 'suggest-more',
 *   moreIndicatorText : '&hellip;'
 * });
 *
 */

(function ($) {

    $.fn.suggest = function (source, options) {

        var settings = $.extend({
            suggestionColor: '#ccc',
            moreIndicatorClass: 'suggest-more',
            moreIndicatorText: '&hellip;'
        }, options);

        return this.each(function () {

            $this = $(this);

            // this helper will show possible suggestions
            // and needs to match the input field in style
            var $suggest = $('<div/>', {
                'css': {
                    'position': 'absolute',
                    'height': $this.height(),
                    'width': $this.width(),
                    'top': $this.css('borderTopWidth'),
                    'left': $this.css('borderLeftWidth'),
                    'padding': $this.cssShortForAllSides('padding'),
                    'margin': $this.cssShortForAllSides('margin'),
                    'fontFamily': $this.css('fontFamily'),
                    'fontSize': $this.css('fontSize'),
                    'fontStyle': $this.css('fontStyle'),
                    'lineHeight': "34px",
                    'fontWeight': $this.css('fontWeight'),
                    'letterSpacing': $this.css('letterSpacing'),
                    'backgroundColor': $this.css('backgroundColor'),
                    'direction': "rtl",
                    'color': settings.suggestionColor
                }
            });

            var $more = $('<span/>', {
                'css': {
                    'position': 'absolute',
                    'top': $suggest.height() + parseInt($this.css('fontSize'), 10) / 2,
                    'left': $suggest.width(),
                    'display': 'none',
                    'fontSize': $this.css('fontSize'),
                    'fontFamily': $this.css('fontFamily'),
                    'color': settings.suggestionColor
                },
                'class': settings.moreIndicatorClass
            })
      .html(settings.moreIndicatorText)
      .hide();

            $this
        .attr({
            'autocomplete': "off",
            'spellcheck': "false",
            'dir': "ltr"
        })
            // by setting the background to transparent, we will
            // be able to "see through" to the suggestion helper
        .css({
            //'background': 'transparent'
        })
        .wrap($('<div/>', {
            'css': {
                'position': 'relative',
                'paddingBottom': '0em'
            }
        }))

        .bind('keydown.suggest', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);

            // the tab key will force the focus to the next input
            // already on keydown, let's prevent that
            // unless the alt key is pressed for convenience
            if (code == 9 && !e.altKey) {
                e.preventDefault();

                // let's prevent default enter behavior while a suggestion
                // is being accepted (e.g. while submitting a form)
            } else if (code == 13) {
                if (!$suggest.is(':empty')) {

                    e.preventDefault();
                }

                // use arrow keys to cycle through suggestions
            } else if (code == 38 || code == 40) {
                e.preventDefault();

                $(".entry_form").next().html("");
                $(".entry_search").next().html("");
                
                return false;

                var suggestions = $(this).data('suggestions');

                if (suggestions.all.length > 1) {
                    // arrow down:
                    if (code == 40 && suggestions.index < suggestions.all.length - 1) {
                        suggestions.suggest.html(suggestions.all[++suggestions.index]);
                        // arrow up:
                    } else if (code == 38 && suggestions.index > 0) {
                        suggestions.suggest.html(suggestions.all[--suggestions.index]);
                    }
                    $(this).data('suggestions').index = suggestions.index;
                }
            }
        })

        .bind('keyup.suggest', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);

            // Have the arrow keys been pressed?
            if (code == 38 || code == 40) {
                return false;
            }

            if (code == 37) {
                var textSuggest = $(".entry_form").next().text();
                if (textSuggest && textSuggest != "") {
                    $(".entry_form").val(textSuggest);
                }
                return false;
            }

            // be default we hide the "more suggestions" indicator
            $more.hide();

            // what has been input?
            var needle = $(this).val();

            // convert spaces to make them visible
            var needleWithWhiteSpace = needle.replace(' ', '&nbsp;');

            // accept suggestion with 'enter' or 'tab'
            // if the suggestion hasn't been accepted yet
            if (code == 9 || code == 13) {
                // only accept if there's anything suggested
                if ($suggest.text().length > 0) {
                    e.preventDefault();
                    var suggestions = $(this).data('suggestions');
                    $(this).val(suggestions.terms[suggestions.index]);


                    onSuggestEnter.call(this, $(".entry_form").val());


                    // clean the suggestion for the looks
                    $suggest.empty();
                    return false;
                }
            }

            // make sure the helper is empty
            $suggest.empty();

            // if nothing has been input, leave it with that
            if (!$.trim(needle).length) {
                return false;
            }

            // see if anything in source matches the input
            // by escaping the input' string for use with regex
            // we allow to search for terms containing specials chars as well
            var regex = new RegExp('^' + needle.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
            var suggestions = [], terms = [];
            for (var i = 0, l = source; i < l.length; i++) {
                if (regex.test(l[i])) {
                    terms.push(l[i]);
                    suggestions.push(needleWithWhiteSpace + l[i].slice(needle.length));
                }
            }
            if (suggestions.length > 0) {
                // if there's any suggestions found, use the first
                // don't show the suggestion if it's identical with the current input
                if (suggestions[0] !== needle) {
                    $suggest.html(suggestions[0]);
                }
                // store found suggestions in data for use with arrow keys
                $(this).data('suggestions', {
                    'all': suggestions,
                    'terms': terms,
                    'index': 0,
                    'suggest': $suggest
                });

                // show the indicator that there's more suggestions available
                // only for more than one suggestion
                if (suggestions.length > 1) {
                    //$more.show();
                }
            }
        })

            // clear suggestion on blur
        .bind('blur.suggest', function () {
            $suggest.empty();
        });

            // insert the suggestion helpers within the wrapper
            $suggest.insertAfter($this);
            $more.insertAfter($suggest);

        });

    };

    /* A little helper to calculate the sum of different
    * CSS properties around all four sides
    *
    * EXAMPLE:
    * $('#my-div').cssSum('padding');
    */
    $.fn.cssShortForAllSides = function (property) {
        var $self = $(this), sum = [];
        var properties = $.map(['Top', 'Right', 'Bottom', 'Left'], function (side) {
            return property + side;
        });
        $.each(properties, function (i, e) {
            sum.push($self.css(e) || "0");
        });
        return sum.join(' ');
    };
})(jQuery);
;
/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 *

/*
 *	jQuery elevateZoom 3.0.3
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	var ElevateZoom = {
			init: function( options, elem ) {
				var self = this;

				self.elem = elem;
				self.$elem = $( elem );

				self.imageSrc = self.$elem.data("zoom-image") ? self.$elem.data("zoom-image") : self.$elem.attr("src");

				self.options = $.extend( {}, $.fn.elevateZoom.options, options );

				//TINT OVERRIDE SETTINGS
				if(self.options.tint) {
					self.options.lensColour = "none", //colour of the lens background
					self.options.lensOpacity =  "1" //opacity of the lens
				}
				//INNER OVERRIDE SETTINGS
				if(self.options.zoomType == "inner") {self.options.showLens = false;}


				//Remove alt on hover

				self.$elem.parent().removeAttr('title').removeAttr('alt');

				self.zoomImage = self.imageSrc;

				self.refresh( 1 );



				//Create the image swap from the gallery 
				$('#'+self.options.gallery + ' a').click( function(e) { 

					//Set a class on the currently active gallery image
					if(self.options.galleryActiveClass){
						$('#'+self.options.gallery + ' a').removeClass(self.options.galleryActiveClass);
						$(this).addClass(self.options.galleryActiveClass);
					}
					//stop any link on the a tag from working
					e.preventDefault();

					//call the swap image function            
					if($(this).data("zoom-image")){self.zoomImagePre = $(this).data("zoom-image")}
					else{self.zoomImagePre = $(this).data("image");}
					self.swaptheimage($(this).data("image"), self.zoomImagePre);
					return false;
				});

			},

			refresh: function( length ) {
				var self = this;

				setTimeout(function() {
					self.fetch(self.imageSrc);

				}, length || self.options.refresh );
			},

			fetch: function(imgsrc) {
				//get the image
				var self = this;
				var newImg = new Image();
				newImg.onload = function() {
					//set the large image dimensions - used to calculte ratio's
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					//once image is loaded start the calls
					self.startZoom();
					self.currentImage = self.imageSrc;
					//let caller know image has been loaded
					self.options.onZoomedImageLoaded(self.$elem);
				}
				newImg.src = imgsrc; // this must be done AFTER setting onload

				return;

			},

			startZoom: function( ) {
				var self = this;
				//get dimensions of the non zoomed image
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				//activated elements
				self.isWindowActive = false;
				self.isLensActive = false;
				self.isTintActive = false;
				self.overWindow = false;    

				//CrossFade Wrappe
				if(self.options.imageCrossfade){
					self.zoomWrap = self.$elem.wrap('<div style="height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;" class="zoomWrapper" />');        
					self.$elem.css('position', 'absolute'); 
				}

				self.zoomLock = 1;
				self.scrollingLock = false;
				self.changeBgSize = false;
				self.currentZoomLevel = self.options.zoomLevel;


				//get offset of the non zoomed image
				self.nzOffset = self.$elem.offset();
				//calculate the width ratio of the large/small image
				self.widthRatio = (self.largeWidth/self.currentZoomLevel) / self.nzWidth;
				self.heightRatio = (self.largeHeight/self.currentZoomLevel) / self.nzHeight; 


				//if window zoom        
				if(self.options.zoomType == "window") {
					self.zoomWindowStyle = "overflow: hidden;"
						+ "background-position: 0px 0px;text-align:center;"  
						+ "background-color: " + String(self.options.zoomWindowBgColour)            
						+ ";width: " + String(self.options.zoomWindowWidth) + "px;"
						+ "height: " + String(self.options.zoomWindowHeight)
						+ "px;float: left;"
						+ "background-size: "+ self.largeWidth/self.currentZoomLevel+ "px " +self.largeHeight/self.currentZoomLevel + "px;"
						+ "display: none;z-index:100;"
						+ "border: " + String(self.options.borderSize) 
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    


				//if inner  zoom    
				if(self.options.zoomType == "inner") {
					//has a border been put on the image? Lets cater for this

					var borderWidth = self.$elem.css("border-left-width");

					self.zoomWindowStyle = "overflow: hidden;"
						+ "margin-left: " + String(borderWidth) + ";" 
						+ "margin-top: " + String(borderWidth) + ";"         
						+ "background-position: 0px 0px;"
						+ "width: " + String(self.nzWidth) + "px;"
						+ "height: " + String(self.nzHeight)
						+ "px;float: left;"
						+ "display: none;"
						+ "cursor:"+(self.options.cursor)+";"
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    



				//lens style for window zoom
				if(self.options.zoomType == "window") {


					// adjust images less than the window height

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;              
					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}
					if(self.largeWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					self.lensStyle = "background-position: 0px 0px;width: " + String((self.options.zoomWindowWidth)/self.widthRatio) + "px;height: " + String((self.options.zoomWindowHeight)/self.heightRatio)
					+ "px;float: right;display: none;"
					+ "overflow: hidden;"
					+ "z-index: 999;"   
					+ "-webkit-transform: translateZ(0);"               
					+ "opacity:"+(self.options.lensOpacity)+";filter: alpha(opacity = "+(self.options.lensOpacity*100)+"); zoom:1;"
					+ "width:"+lensWidth+"px;"
					+ "height:"+lensHeight+"px;"
					+ "background-color:"+(self.options.lensColour)+";"					
					+ "cursor:"+(self.options.cursor)+";"
					+ "border: "+(self.options.lensBorderSize)+"px" +
					" solid "+(self.options.lensBorderColour)+";background-repeat: no-repeat;position: absolute;";
				} 


				//tint style
				self.tintStyle = "display: block;"
					+ "position: absolute;"
					+ "background-color: "+self.options.tintColour+";"	
					+ "filter:alpha(opacity=0);"		
					+ "opacity: 0;"	
					+ "width: " + self.nzWidth + "px;"
					+ "height: " + self.nzHeight + "px;"

					;

				//lens style for lens zoom with optional round for modern browsers
				self.lensRound = '';

				if(self.options.zoomType == "lens") {

					self.lensStyle = "background-position: 0px 0px;"
						+ "float: left;display: none;"
						+ "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour+";"
						+ "width:"+ String(self.options.lensSize) +"px;"
						+ "height:"+ String(self.options.lensSize)+"px;"
						+ "background-repeat: no-repeat;position: absolute;";


				}


				//does not round in all browsers
				if(self.options.lensShape == "round") {
					self.lensRound = "border-top-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-top-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;";

				}

				//create the div's                                                + ""
				//self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});

				self.zoomContainer = $('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:'+self.nzOffset.left+'px;top:'+self.nzOffset.top+'px;height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;"></div>');
				$('body').append(self.zoomContainer);	


				//this will add overflow hidden and contrain the lens on lens mode       
				if(self.options.containLensZoom && self.options.zoomType == "lens"){
					self.zoomContainer.css("overflow", "hidden");
				}
				if(self.options.zoomType != "inner") {
					self.zoomLens = $("<div class='zoomLens' style='" + self.lensStyle + self.lensRound +"'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});


					if(self.options.tint) {
						self.tintContainer = $('<div/>').addClass('tintContainer');	
						self.zoomTint = $("<div class='zoomTint' style='"+self.tintStyle+"'></div>");


						self.zoomLens.wrap(self.tintContainer);


						self.zoomTintcss = self.zoomLens.after(self.zoomTint);	

						//if tint enabled - set an image to show over the tint

						self.zoomTintImage = $('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: '+self.nzWidth+'px; height: '+self.nzHeight+'px;" src="'+self.imageSrc+'">')
						.appendTo(self.zoomLens)
						.click(function () {

							self.$elem.trigger('click');
						});

					}          

				}







				//create zoom window 
				if(isNaN(self.options.zoomWindowPosition)){
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo('body')
					.click(function () {
						self.$elem.trigger('click');
					});
				}else{
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});
				}              
				self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css("width",self.options.zoomWindowWidth);
				self.zoomWindow.wrap(self.zoomWindowContainer);


				//  self.captionStyle = "text-align: left;background-color: black;color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";                                                                                                                                                                                                                                          
				// self.zoomCaption = $('<div class="elevatezoom-caption" style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				/*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
				//touch events
				self.$elem.bind('touchmove', function(e){    
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch);

				});  
				self.zoomContainer.bind('touchmove', function(e){ 
					if(self.options.zoomType == "inner") {
						self.showHideWindow("show");

					}
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch); 

				});  	
				self.zoomContainer.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	

				self.$elem.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	
				if(self.options.showLens) {
					self.zoomLens.bind('touchmove', function(e){ 

						e.preventDefault();
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
						self.setPosition(touch); 
					});    


					self.zoomLens.bind('touchend', function(e){ 
						self.showHideWindow("hide");
						if(self.options.showLens) {self.showHideLens("hide");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
					});  
				}
				//Needed to work in IE
				self.$elem.bind('mousemove', function(e){   
					if(self.overWindow == false){self.setElements("show");}
					//make sure on orientation change the setposition is not fired
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    

				});  	

				self.zoomContainer.bind('mousemove', function(e){ 

					if(self.overWindow == false){self.setElements("show");} 

					//make sure on orientation change the setposition is not fired 
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    
				});  	
				if(self.options.zoomType != "inner") {
					self.zoomLens.bind('mousemove', function(e){      
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});
				}
				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.bind('mousemove', function(e){ 
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.bind('mousemove', function(e) {
						//self.overWindow = true;
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}


				//  lensFadeOut: 500,  zoomTintFadeIn
				self.zoomContainer.add(self.$elem).mouseenter(function(){

					if(self.overWindow == false){self.setElements("show");} 


				}).mouseleave(function(){
					if(!self.scrollLock){
						self.setElements("hide");
					}
				});
				//end ove image





				if(self.options.zoomType != "inner") {
					self.zoomWindow.mouseenter(function(){
						self.overWindow = true;   
						self.setElements("hide");                  
					}).mouseleave(function(){

						self.overWindow = false;
					});
				}
				//end ove image



//				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);

				//      $(this).empty();    
				//    return false;

				//fix for initial zoom setting
				if (self.options.zoomLevel != 1){
					//	self.changeZoomLevel(self.currentZoomLevel);
				}
				//set the min zoomlevel
				if(self.options.minZoomLevel){
					self.minZoomLevel = self.options.minZoomLevel;
				}
				else{
					self.minZoomLevel = self.options.scrollZoomIncrement * 2;
				}


				if(self.options.scrollZoom){


					self.zoomContainer.add(self.$elem).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){


//						in IE there is issue with firing of mouseleave - So check whether still scrolling
//						and on mouseleave check if scrolllock          
						self.scrollLock = true;
						clearTimeout($.data(this, 'timer'));
						$.data(this, 'timer', setTimeout(function() {
							self.scrollLock = false;
							//do something
						}, 250));

						var theEvent = e.originalEvent.wheelDelta || e.originalEvent.detail*-1


						//this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
						//   e.preventDefault();


						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();


						if(theEvent /120 > 0) {
							//scrolling up
							if(self.currentZoomLevel >= self.minZoomLevel){ 
								self.changeZoomLevel(self.currentZoomLevel-self.options.scrollZoomIncrement);        
							}

						}
						else{
							//scrolling down


							if(self.options.maxZoomLevel){
								if(self.currentZoomLevel <= self.options.maxZoomLevel){           
									self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
								}
							}
							else{
								//andy 

								self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
							}

						}
						return false;
					});
				}


			},
			setElements: function(type) {
				var self = this;
        if(!self.options.zoomEnabled){return false;}
				if(type=="show"){
					if(self.isWindowSet){
						if(self.options.zoomType == "inner") {self.showHideWindow("show");}
						if(self.options.zoomType == "window") {self.showHideWindow("show");}
						if(self.options.showLens) {self.showHideLens("show");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("show");
						}
					}
				}

				if(type=="hide"){
					if(self.options.zoomType == "window") {self.showHideWindow("hide");}
					if(!self.options.tint) {self.showHideWindow("hide");}
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint) {	self.showHideTint("hide");}
				}   
			},
			setPosition: function(e) {
      
				var self = this;
        
        if(!self.options.zoomEnabled){return false;}

				//recaclc offset each time in case the image moves
				//this can be caused by other on page elements
				self.nzHeight = self.$elem.height();
				self.nzWidth = self.$elem.width();
				self.nzOffset = self.$elem.offset();

				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.css({ top: 0});
					self.zoomTint.css({ left: 0});
				}
				//set responsive       
				//will checking if the image needs changing before running this code work faster?
				if(self.options.responsive && !self.options.scrollZoom){
					if(self.options.showLens){ 
						if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
							lensHeight = self.nzHeight;              
						}
						else{
							lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
						}
						if(self.largeWidth < self.options.zoomWindowWidth){
							lensWidth = self.nzWidth;
						}       
						else{
							lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
						}
						self.widthRatio = self.largeWidth / self.nzWidth;
						self.heightRatio = self.largeHeight / self.nzHeight;        
						if(self.options.zoomType != "lens") {


							//possibly dont need to keep recalcalculating
							//if the lens is heigher than the image, then set lens size to image size
							if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
								lensHeight = self.nzHeight;  

							}
							else{
								lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
							}

							if(self.options.zoomWindowWidth < self.options.zoomWindowWidth){
								lensWidth = self.nzWidth;
							}       
							else{
								lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
							}            

							self.zoomLens.css('width', lensWidth);    
							self.zoomLens.css('height', lensHeight); 

							if(self.options.tint){    
								self.zoomTintImage.css('width', self.nzWidth);    
								self.zoomTintImage.css('height', self.nzHeight); 
							}

						}                     
						if(self.options.zoomType == "lens") {  

							self.zoomLens.css({ width: String(self.options.lensSize) + 'px', height: String(self.options.lensSize) + 'px' })      


						}        
						//end responsive image change
					}
				}

				//container fix
				self.zoomContainer.css({ top: self.nzOffset.top});
				self.zoomContainer.css({ left: self.nzOffset.left});
				self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
				self.mouseTop = parseInt(e.pageY - self.nzOffset.top);
				//calculate the Location of the Lens

				//calculate the bound regions - but only if zoom window
				if(self.options.zoomType == "window") {
					self.Etoppos = (self.mouseTop < (self.zoomLens.height()/2));
					self.Eboppos = (self.mouseTop > self.nzHeight - (self.zoomLens.height()/2)-(self.options.lensBorderSize*2));
					self.Eloppos = (self.mouseLeft < 0+((self.zoomLens.width()/2))); 
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.zoomLens.width()/2)-(self.options.lensBorderSize*2)));  
				}
				//calculate the bound regions - but only for inner zoom
				if(self.options.zoomType == "inner"){ 
					self.Etoppos = (self.mouseTop < ((self.nzHeight/2)/self.heightRatio) );
					self.Eboppos = (self.mouseTop > (self.nzHeight - ((self.nzHeight/2)/self.heightRatio)));
					self.Eloppos = (self.mouseLeft < 0+(((self.nzWidth/2)/self.widthRatio)));
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.nzWidth/2)/self.widthRatio-(self.options.lensBorderSize*2)));  
				}

				// if the mouse position of the slider is one of the outerbounds, then hide  window and lens
				if (self.mouseLeft <= 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight ) {				          
					self.setElements("hide");
					return;
				}
				//else continue with operations
				else {


					//lens options
					if(self.options.showLens) {
						//		self.showHideLens("show");
						//set background position of lens
						self.lensLeftPos = String(self.mouseLeft - self.zoomLens.width() / 2);
						self.lensTopPos = String(self.mouseTop - self.zoomLens.height() / 2);


					}
					//adjust the background position if the mouse is in one of the outer regions 

					//Top region
					if(self.Etoppos){
						self.lensTopPos = 0;
					}
					//Left Region
					if(self.Eloppos){
						self.windowLeftPos = 0;
						self.lensLeftPos = 0;
						self.tintpos=0;
					}     
					//Set bottom and right region for window mode
					if(self.options.zoomType == "window") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( (self.nzHeight)-self.zoomLens.height()-(self.options.lensBorderSize*2), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.zoomLens.width())-(self.options.lensBorderSize*2));
						}  
					}  
					//Set bottom and right region for inner mode
					if(self.options.zoomType == "inner") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( ((self.nzHeight)-(self.options.lensBorderSize*2)), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.nzWidth)-(self.options.lensBorderSize*2));
						}  

					}
					//if lens zoom
					if(self.options.zoomType == "lens") {  
						self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * (-1));   
						self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * (-1));

						self.zoomLens.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });

						if(self.changeBgSize){  

							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								}   

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								}   
								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
							}
							self.changeBgSize = false;
						}    

						self.setWindowPostition(e);  
					}
					//if tint zoom   
					if(self.options.tint && self.options.zoomType != "inner") {
						self.setTintPosition(e);

					}
					//set the css background position 
					if(self.options.zoomType == "window") {
						self.setWindowPostition(e);   
					}
					if(self.options.zoomType == "inner") {
						self.setWindowPostition(e);   
					}
					if(self.options.showLens) {

						if(self.fullwidth && self.options.zoomType != "lens"){
							self.lensLeftPos = 0;

						}
						self.zoomLens.css({ left: self.lensLeftPos + 'px', top: self.lensTopPos + 'px' })  
					}

				} //end else



			},
			showHideWindow: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isWindowActive){
						if(self.options.zoomWindowFadeIn){
							self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
						}
						else{self.zoomWindow.show();}
						self.isWindowActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isWindowActive){
						if(self.options.zoomWindowFadeOut){
							self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut);
						}
						else{self.zoomWindow.hide();}
						self.isWindowActive = false;        
					}      
				}
			},
			showHideLens: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isLensActive){
						if(self.options.lensFadeIn){
							self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
						}
						else{self.zoomLens.show();}
						self.isLensActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isLensActive){
						if(self.options.lensFadeOut){
							self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
						}
						else{self.zoomLens.hide();}
						self.isLensActive = false;        
					}      
				}
			},
			showHideTint: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isTintActive){

						if(self.options.zoomTintFadeIn){
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate().stop(true, true).fadeIn("slow");
						}
						else{
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate();
							self.zoomTint.show();


						}
						self.isTintActive = true;
					}            
				}
				if(change == "hide"){      
					if(self.isTintActive){ 

						if(self.options.zoomTintFadeOut){
							self.zoomTint.stop(true, true).fadeOut(self.options.zoomTintFadeOut);
						}
						else{self.zoomTint.hide();}
						self.isTintActive = false;        
					}      
				}
			},
			setLensPostition: function( e ) {


			},
			setWindowPostition: function( e ) {
				//return obj.slice( 0, count );
				var self = this;

				if(!isNaN(self.options.zoomWindowPosition)){

					switch (self.options.zoomWindowPosition) { 
					case 1: //done         
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
						self.windowOffsetLeft =(+self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 2:
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						}
						else{ //negative margin

						}
						break;
					case 3: //done        
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;      
					case 4: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 5: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 6: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}


						break;
					case 7: //done  
						self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8
						self.windowOffsetLeft = 0; //DONE 7, 13
						break;
					case 8: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 9:  //done  
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 10: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						}
						else{ //negative margin

						}
						break;
					case 11: 
						self.windowOffsetTop = (self.options.zoomWindowOffety);
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 12: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 13: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(0); //DONE 7, 13
						break;
					case 14: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}

						break;
					case 15://done   
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 16:  //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;            
					default: //done  
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
					self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
					} 
				} //end isNAN
				else{
					//WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
					self.externalContainer = $('#'+self.options.zoomWindowPosition);
					self.externalContainerWidth = self.externalContainer.width();
					self.externalContainerHeight = self.externalContainer.height();
					self.externalContainerOffset = self.externalContainer.offset();

					self.windowOffsetTop = self.externalContainerOffset.top;//DONE - 1
					self.windowOffsetLeft =self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16

				}
				self.isWindowSet = true;
				self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffety;
				self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffetx;

				self.zoomWindow.css({ top: self.windowOffsetTop});
				self.zoomWindow.css({ left: self.windowOffsetLeft});

				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ top: 0});
					self.zoomWindow.css({ left: 0});

				}   


				self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1));   
				self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));
				if(self.Etoppos){self.windowTopPos = 0;}
				if(self.Eloppos){self.windowLeftPos = 0;}     
				if(self.Eboppos){self.windowTopPos = (self.largeHeight/self.currentZoomLevel-self.zoomWindow.height())*(-1);  } 
				if(self.Eroppos){self.windowLeftPos = ((self.largeWidth/self.currentZoomLevel-self.zoomWindow.width())*(-1));}    

				//stops micro movements
				if(self.fullheight){
					self.windowTopPos = 0;

				}
				if(self.fullwidth){
					self.windowLeftPos = 0;

				}
				//set the css background position 


				if(self.options.zoomType == "window" || self.options.zoomType == "inner") {

					if(self.zoomLock == 1){
						//overrides for images not zoomable
						if(self.widthRatio <= 1){

							self.windowLeftPos = 0;
						}
						if(self.heightRatio <= 1){ 
							self.windowTopPos = 0;
						}
					}
					// adjust images less than the window height

					if(self.largeHeight < self.options.zoomWindowHeight){

						self.windowTopPos = 0;
					}
					if(self.largeWidth < self.options.zoomWindowWidth){
						self.windowLeftPos = 0;
					}       

					//set the zoomwindow background position
					if (self.options.easing){

						//     if(self.changeZoom){
						//           clearInterval(self.loop);
						//           self.changeZoom = false;
						//           self.loop = false;

						//            }
						//set the pos to 0 if not set
						if(!self.xp){self.xp = 0;}
						if(!self.yp){self.yp = 0;}  
						//if loop not already started, then run it 
						if (!self.loop){           
							self.loop = setInterval(function(){                
								//using zeno's paradox    

								self.xp += (self.windowLeftPos  - self.xp) / self.options.easingAmount; 
								self.yp += (self.windowTopPos  - self.yp) / self.options.easingAmount;
								if(self.scrollingLock){


									clearInterval(self.loop);
									self.xp = self.windowLeftPos;
									self.yp = self.windowTopPos            

									self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1);
									self.yp = (((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));                         

									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){  
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}   
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{   
											if(self.options.zoomType != "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}            
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            

										}

										/*
             if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
						if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}  
                 if (!self.bgloop){   
                 	self.bgloop = setInterval(function(){   

                 self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount; 
								self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;

           self.zoomWindow.css({ "background-size": self.bgxp + 'px ' + self.bgyp + 'px' });


                  }, 16);

                 }
										 */
										self.changeBgSize = false;
									}

									self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
									self.scrollingLock = false;
									self.loop = false;

								}
								else{
									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){ 
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}         
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{                 
											if(self.options.zoomType != "lens"){     
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
											}      
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
										}
										self.changeBgSize = false;
									}                   

									self.zoomWindow.css({ backgroundPosition: self.xp + 'px ' + self.yp + 'px' });
								}       
							}, 16);
						}
					}   
					else{    
						if(self.changeBgSize){  
							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								} 

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								} 
								if((self.largeHeight/self.newvaluewidth) < self.options.zoomWindowHeight){ 

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
								}
								else{

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });   
								}

							}
							self.changeBgSize = false;
						}     

						self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });       
					}
				} 
			},
			setTintPosition: function(e){
				var self = this;
				self.nzOffset = self.$elem.offset();
				self.tintpos = String(((e.pageX - self.nzOffset.left)-(self.zoomLens.width() / 2)) * (-1)); 
				self.tintposy = String(((e.pageY - self.nzOffset.top) - self.zoomLens.height() / 2) * (-1));	
				if(self.Etoppos){
					self.tintposy = 0;
				}
				if(self.Eloppos){
					self.tintpos=0;
				}     
				if(self.Eboppos){
					self.tintposy = (self.nzHeight-self.zoomLens.height()-(self.options.lensBorderSize*2))*(-1);
				} 
				if(self.Eroppos){
					self.tintpos = ((self.nzWidth-self.zoomLens.width()-(self.options.lensBorderSize*2))*(-1));
				}    
				if(self.options.tint) {
					//stops micro movements
					if(self.fullheight){
						self.tintposy = 0;

					}
					if(self.fullwidth){ 
						self.tintpos = 0;

					}   
					self.zoomTintImage.css({'left': self.tintpos+'px'});
					self.zoomTintImage.css({'top': self.tintposy+'px'});
				}
			},

			swaptheimage: function(smallimage, largeimage){
				var self = this;
				var newImg = new Image(); 

				if(self.options.loadingIcon){
				    self.spinner = $('<div class="cc-elevate-loading" style="background: url(\'' + self.options.loadingIcon + '\') no-repeat center; margin-top:-' + self.nzHeight + 'px; height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;opacity: 0.9;  background-color: #FFF;"></div>');
					self.$elem.after(self.spinner);
				}

				self.options.onImageSwap(self.$elem);

				newImg.onload = function() {
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					self.zoomImage = largeimage;
					self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });
					self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });


					self.swapAction(smallimage, largeimage);
					return;              
				}          
				newImg.src = largeimage; // this must be done AFTER setting onload

			},
			swapAction: function(smallimage, largeimage){


				var self = this;    

				var newImg2 = new Image(); 
				newImg2.onload = function() {
					//re-calculate values
					self.nzHeight = newImg2.height;
					self.nzWidth = newImg2.width;
					self.options.onImageSwapComplete(self.$elem);

					self.doneCallback();  
					return;      
				}          
				newImg2.src = smallimage; 

				//reset the zoomlevel to that initially set in options
				self.currentZoomLevel = self.options.zoomLevel;
				self.options.maxZoomLevel = false;

				//swaps the main image
				//self.$elem.attr("src",smallimage);
				//swaps the zoom image     
				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				} 



				self.currentImage = largeimage;

				if(self.options.imageCrossfade){
					var oldImg = self.$elem;
					var newImg = oldImg.clone();         
					self.$elem.attr("src",smallimage)
					self.$elem.after(newImg);
					newImg.stop(true).fadeOut(self.options.imageCrossfade, function() {
						$(this).remove();         
					});

					//       				if(self.options.zoomType == "inner"){
					//remove any attributes on the cloned image so we can resize later
					self.$elem.width("auto").removeAttr("width");
					self.$elem.height("auto").removeAttr("height");
					//   }

					oldImg.fadeIn(self.options.imageCrossfade);

					if(self.options.tint && self.options.zoomType != "inner") {

						var oldImgTint = self.zoomTintImage;
						var newImgTint = oldImgTint.clone();         
						self.zoomTintImage.attr("src",largeimage)
						self.zoomTintImage.after(newImgTint);
						newImgTint.stop(true).fadeOut(self.options.imageCrossfade, function() {
							$(this).remove();         
						});



						oldImgTint.fadeIn(self.options.imageCrossfade);


						//self.zoomTintImage.attr("width",elem.data("image"));

						//resize the tint window
						self.zoomTint.css({ height: self.$elem.height()});
						self.zoomTint.css({ width: self.$elem.width()});
					}    

					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.zoomType == "inner"){ 
						if(!self.options.constrainType){
							self.zoomWrap.parent().css("height", self.$elem.height());
							self.zoomWrap.parent().css("width", self.$elem.width());

							self.zoomWindow.css("height", self.$elem.height());
							self.zoomWindow.css("width", self.$elem.width());
						}
					} 

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}
				else{
					self.$elem.attr("src",smallimage); 
					if(self.options.tint) {
						self.zoomTintImage.attr("src",largeimage);
						//self.zoomTintImage.attr("width",elem.data("image"));
						self.zoomTintImage.attr("height",self.$elem.height());
						//self.zoomTintImage.attr('src') = elem.data("image");
						self.zoomTintImage.css({ height: self.$elem.height()}); 
						self.zoomTint.css({ height: self.$elem.height()});

					}
					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}              
				if(self.options.constrainType){     

					//This will contrain the image proportions
					if(self.options.constrainType == "height"){ 

						self.zoomContainer.css("height", self.options.constrainSize);
						self.zoomContainer.css("width", "auto");

						if(self.options.imageCrossfade){  
							self.zoomWrap.css("height", self.options.constrainSize);
							self.zoomWrap.css("width", "auto"); 
							self.constwidth = self.zoomWrap.width();


						}
						else{                  
							self.$elem.css("height", self.options.constrainSize);
							self.$elem.css("width", "auto");
							self.constwidth = self.$elem.width();
						} 

						if(self.options.zoomType == "inner"){

							self.zoomWrap.parent().css("height", self.options.constrainSize);
							self.zoomWrap.parent().css("width", self.constwidth);   
							self.zoomWindow.css("height", self.options.constrainSize);
							self.zoomWindow.css("width", self.constwidth);    
						}        
						if(self.options.tint){
							self.tintContainer.css("height", self.options.constrainSize);
							self.tintContainer.css("width", self.constwidth);
							self.zoomTint.css("height", self.options.constrainSize);
							self.zoomTint.css("width", self.constwidth);
							self.zoomTintImage.css("height", self.options.constrainSize);
							self.zoomTintImage.css("width", self.constwidth); 
						} 

					}
					if(self.options.constrainType == "width"){       
						self.zoomContainer.css("height", "auto");
						self.zoomContainer.css("width", self.options.constrainSize);

						if(self.options.imageCrossfade){
							self.zoomWrap.css("height", "auto");
							self.zoomWrap.css("width", self.options.constrainSize);
							self.constheight = self.zoomWrap.height();
						}
						else{            
							self.$elem.css("height", "auto");
							self.$elem.css("width", self.options.constrainSize); 
							self.constheight = self.$elem.height();              
						} 
						if(self.options.zoomType == "inner"){
							self.zoomWrap.parent().css("height", self.constheight);
							self.zoomWrap.parent().css("width", self.options.constrainSize);   
							self.zoomWindow.css("height", self.constheight);
							self.zoomWindow.css("width", self.options.constrainSize);    
						} 
						if(self.options.tint){
							self.tintContainer.css("height", self.constheight);
							self.tintContainer.css("width", self.options.constrainSize);
							self.zoomTint.css("height", self.constheight);
							self.zoomTint.css("width", self.options.constrainSize);
							self.zoomTintImage.css("height", self.constheight);
							self.zoomTintImage.css("width", self.options.constrainSize); 
						}   

					}        


				}

			},
			doneCallback: function(){

				var self = this;
				if(self.options.loadingIcon){
					self.spinner.hide();     
				}   

				self.nzOffset = self.$elem.offset();
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				// reset the zoomlevel back to default
				self.currentZoomLevel = self.options.zoomLevel;

				//ratio of the large to small image
				self.widthRatio = self.largeWidth / self.nzWidth;
				self.heightRatio = self.largeHeight / self.nzHeight; 

				//NEED TO ADD THE LENS SIZE FOR ROUND
				// adjust images less than the window height
				if(self.options.zoomType == "window") {

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;  

					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}

					if(self.options.zoomWindowWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					if(self.zoomLens){

						self.zoomLens.css('width', lensWidth);    
						self.zoomLens.css('height', lensHeight); 


					}
				}
			},
			getCurrentImage: function(){
				var self = this;  
				return self.zoomImage; 
			}, 
			getGalleryList: function(){
				var self = this;   
				//loop through the gallery options and set them in list for fancybox
				self.gallerylist = [];
				if (self.options.gallery){ 


					$('#'+self.options.gallery + ' a').each(function() {

						var img_src = '';
						if($(this).data("zoom-image")){
							img_src = $(this).data("zoom-image");
						}
						else if($(this).data("image")){
							img_src = $(this).data("image");
						}			
						//put the current image at the start
						if(img_src == self.zoomImage){
							self.gallerylist.unshift({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});	
						}
						else{
							self.gallerylist.push({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});
						}


					});
				}                                                       
				//if no gallery - return current image
				else{
					self.gallerylist.push({
						href: ''+self.zoomImage+'',
						title: $(this).find('img').attr("title")
					}); 
				}
				return self.gallerylist;

			},
			changeZoomLevel: function(value){
				var self = this;   

				//flag a zoom, so can adjust the easing during setPosition     
				self.scrollingLock = true;   

				//round to two decimal places
				self.newvalue = parseFloat(value).toFixed(2);
				newvalue = parseFloat(value).toFixed(2);




				//maxwidth & Maxheight of the image
				maxheightnewvalue = self.largeHeight/((self.options.zoomWindowHeight / self.nzHeight) * self.nzHeight);     
				maxwidthtnewvalue = self.largeWidth/((self.options.zoomWindowWidth / self.nzWidth) * self.nzWidth);   	




				//calculate new heightratio
				if(self.options.zoomType != "inner")
				{
					if(maxheightnewvalue <= newvalue){
						self.heightRatio = (self.largeHeight/maxheightnewvalue) / self.nzHeight;
						self.newvalueheight = maxheightnewvalue;
						self.fullheight = true;

					}
					else{
						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						self.newvalueheight = newvalue;
						self.fullheight = false;

					}


//					calculate new width ratio

					if(maxwidthtnewvalue <= newvalue){
						self.widthRatio = (self.largeWidth/maxwidthtnewvalue) / self.nzWidth;
						self.newvaluewidth = maxwidthtnewvalue;
						self.fullwidth = true;

					}
					else{
						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;

					}
					if(self.options.zoomType == "lens"){
						if(maxheightnewvalue <= newvalue){
							self.fullwidth = true;
							self.newvaluewidth = maxheightnewvalue;

						} else{
							self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
							self.newvaluewidth = newvalue;

							self.fullwidth = false;
						}}
				}



				if(self.options.zoomType == "inner")
				{
					maxheightnewvalue = parseFloat(self.largeHeight/self.nzHeight).toFixed(2);     
					maxwidthtnewvalue = parseFloat(self.largeWidth/self.nzWidth).toFixed(2);      
					if(newvalue > maxheightnewvalue){
						newvalue = maxheightnewvalue;
					}
					if(newvalue > maxwidthtnewvalue){
						newvalue = maxwidthtnewvalue;
					}      


					if(maxheightnewvalue <= newvalue){


						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						if(newvalue > maxheightnewvalue){
							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = true;


					}
					else{



						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 

						if(newvalue > maxheightnewvalue){

							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = false;
					}




					if(maxwidthtnewvalue <= newvalue){   

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						if(newvalue > maxwidthtnewvalue){

							self.newvaluewidth = maxwidthtnewvalue;
						}else{
							self.newvaluewidth = newvalue;
						}

						self.fullwidth = true;


					}
					else{  

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;
					}        


				} //end inner
				scrcontinue = false;

				if(self.options.zoomType == "inner"){

					if(self.nzWidth > self.nzHeight){
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{

							scrcontinue = false;
							self.fullheight = true;
							self.fullwidth = true;
						}
					}
					if(self.nzHeight > self.nzWidth){     
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{
							scrcontinue = false;  

							self.fullheight = true;
							self.fullwidth = true;
						}
					}
				}

				if(self.options.zoomType != "inner"){
					scrcontinue = true;
				}

				if(scrcontinue){



					self.zoomLock = 0;
					self.changeZoom = true;

					//if lens height is less than image height


					if(((self.options.zoomWindowHeight)/self.heightRatio) <= self.nzHeight){


						self.currentZoomLevel = self.newvalueheight; 
						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({height: String((self.options.zoomWindowHeight)/self.heightRatio) + 'px' }) 
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;  
						}	


					} 




					if((self.options.zoomWindowWidth/self.widthRatio) <= self.nzWidth){



						if(self.options.zoomType != "inner"){
							if(self.newvaluewidth > self.newvalueheight)   {
								self.currentZoomLevel = self.newvaluewidth;                 

							}
						}

						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({width: String((self.options.zoomWindowWidth)/self.widthRatio) + 'px' })
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;
						}	

					}
					if(self.options.zoomType == "inner"){
						self.changeBgSize = true;  

						if(self.nzWidth > self.nzHeight){
							self.currentZoomLevel = self.newvaluewidth;
						}
						if(self.nzHeight > self.nzWidth){
							self.currentZoomLevel = self.newvaluewidth;
						}
					}

				}      //under

				//sets the boundry change, called in setWindowPos
				self.setPosition(self.currentLoc);
				//
			},
			closeAll: function(){
				if(self.zoomWindow){self.zoomWindow.hide();}
				if(self.zoomLens){self.zoomLens.hide();}
				if(self.zoomTint){self.zoomTint.hide();}
			},
			changeState: function(value){
      	var self = this;
				if(value == 'enable'){self.options.zoomEnabled = true;}
				if(value == 'disable'){self.options.zoomEnabled = false;}

			}

	};




	$.fn.elevateZoom = function( options ) {
		return this.each(function() {
			var elevate = Object.create( ElevateZoom );

			elevate.init( options, this );

			$.data( this, 'elevateZoom', elevate );

		});
	};

	$.fn.elevateZoom.options = {
			zoomActivation: "hover", // Can also be click (PLACEHOLDER FOR NEXT VERSION)
      zoomEnabled: true, //false disables zoomwindow from showing
			preloading: 1, //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
			zoomLevel: 1, //default zoom level of image
			scrollZoom: false, //allow zoom on mousewheel, true to activate
			scrollZoomIncrement: 0.1,  //steps of the scrollzoom
			minZoomLevel: false,
			maxZoomLevel: false,
			easing: false,
			easingAmount: 12,
			lensSize: 200,
			zoomWindowWidth: 400,
			zoomWindowHeight: 400,
			zoomWindowOffetx: 0,
			zoomWindowOffety: 0,
			zoomWindowPosition: 1,
			zoomWindowBgColour: "#fff",
			lensFadeIn: false,
			lensFadeOut: false,
			debug: false,
			zoomWindowFadeIn: false,
			zoomWindowFadeOut: false,
			zoomWindowAlwaysShow: false,
			zoomTintFadeIn: false,
			zoomTintFadeOut: false,
			borderSize: 4,
			showLens: true,
			borderColour: "#888",
			lensBorderSize: 1,
			lensBorderColour: "#000",
			lensShape: "square", //can be "round"
			zoomType: "window", //window is default,  also "lens" available -
			containLensZoom: false,
			lensColour: "white", //colour of the lens background
			lensOpacity: 0.4, //opacity of the lens
			lenszoom: false,
			tint: false, //enable the tinting
			tintColour: "#333", //default tint color, can be anything, red, #ccc, rgb(0,0,0)
			tintOpacity: 0.4, //opacity of the tint
			gallery: false,
			galleryActiveClass: "zoomGalleryActive",
			imageCrossfade: false,
			constrainType: false,  //width or height
			constrainSize: false,  //in pixels the dimensions you want to constrain on
			loadingIcon: false, //http://www.example.com/spinner.gif
			cursor:"default", // user should set to what they want the cursor as, if they have set a click function
			responsive:true,
			onComplete: $.noop,
			onZoomedImageLoaded: function() {},
			onImageSwap: $.noop,
			onImageSwapComplete: $.noop
	};

})( jQuery, window, document );;
(function (jQuery, undefined) {

    var push = Array.prototype.push,
        rcheck = /^(?:radio|checkbox)$/i,
        rplus = /\+/g,
        rselect = /^(?:option|select-one|select-multiple)$/i,
        rvalue = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;

    function getElements(elements) {
        return elements.map(function () {
            return this.elements ? jQuery.makeArray(this.elements) : this;
        }).filter(":input:not(:disabled)").get();
    }

    function getElementsByName(elements) {
        var current,
            elementsByName = {};

        jQuery.each(elements, function (i, element) {
            current = elementsByName[element.name];
            elementsByName[element.name] = current === undefined ? element :
                (jQuery.isArray(current) ? current.concat(element) : [current, element]);
        });

        return elementsByName;
    }

    jQuery.fn.deserialize = function (data, options) {
        var i, length,
            elements = getElements(this),
            normalized = [];

        if (!data || !elements.length) {
            return this;
        }

        if (jQuery.isArray(data)) {
            normalized = data;

        } else if (jQuery.isPlainObject(data)) {
            var key, value;

            for (key in data) {
                jQuery.isArray(value = data[key]) ?
                    push.apply(normalized, jQuery.map(value, function (v) {
                        return { name: key, value: v };
                    })) : push.call(normalized, { name: key, value: value });
            }

        } else if (typeof data === "string") {
            var parts;

            data = data.split("&");

            for (i = 0, length = data.length; i < length; i++) {
                parts = data[i].split("=");
                push.call(normalized, {
                    name: decodeURIComponent(parts[0].replace(rplus, "%20")),
                    value: decodeURIComponent(parts[1].replace(rplus, "%20"))
                });
            }
        }

        if (!(length = normalized.length)) {
            return this;
        }

        var current, element, j, len, name, property, type, value,
            change = jQuery.noop,
            complete = jQuery.noop,
            names = {};

        options = options || {};
        elements = getElementsByName(elements);

        // Backwards compatible with old arguments: data, callback
        if (jQuery.isFunction(options)) {
            complete = options;

        } else {
            change = jQuery.isFunction(options.change) ? options.change : change;
            complete = jQuery.isFunction(options.complete) ? options.complete : complete;
        }

        for (i = 0; i < length; i++) {
            current = normalized[i];

            name = current.name;
            value = current.value;

            if (!(element = elements[name])) {
                continue;
            }

            type = (len = element.length) ? element[0] : element;
            type = (type.type || type.nodeName).toLowerCase();
            property = null;

            if (rvalue.test(type)) {
                if (len) {
                    j = names[name];
                    element = element[names[name] = (j == undefined) ? 0 : ++j];
                }

                change.call(element, (element.value = value));

            } else if (rcheck.test(type)) {
                property = "checked";

            } else if (rselect.test(type)) {
                property = "selected";
            }

            if (property) {
                if (!len) {
                    element = [element];
                    len = 1;
                }

                for (j = 0; j < len; j++) {
                    current = element[j];
                    if (value != null && property == "checked") {
                        if (value == true) {
                            change.call(current, (current.checked = true) && value);
                        } else {
                            change.call(current, (current.checked = false) && value);
                        }
                    }
                    else if (current.value == value.toString()) {
                        change.call(current, (current[property] = true) && value);
                        
                    }
                }
            }
        }

        complete.call(this);

        return this;
    };

})(jQuery);


(function (jQuery) {
    jQuery.fn.serializeObject = function () {
     
        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9._]*(?:\[(?:\d*|[a-zA-Z0-9._]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };


        this.build = function (base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function (key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        jQuery.each(jQuery(this).serializeArray(), function () {

            // skip invalid keys
            if (!patterns.validate.test(this.name)) {
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                    // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }

                    // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }

            json = jQuery.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);;
