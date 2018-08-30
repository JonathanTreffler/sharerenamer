/* global OC, $, t */

ShareRenamerFiles.showRenameOnGallery = function () {	
    var $linkRenamerButtonElement = $('#linkRenamerButton');
    var $linkText = $('#linkText');
    var $checkBox = $('#linkCheckbox');

    if (!$linkRenamerButtonElement.length) {
        var linktxt = $linkText.val();
        if (linktxt == "" || linktxt == null || linktxt == false || typeof(linktxt) == 'undefined') {
            var token = '???';
        } 
        else {
            var n = linktxt.lastIndexOf("/");
            var token = linktxt.substr(n + 1);
        }
        $linkRenamerButtonElement = 
            '<br>' +
            '<div id="ShareRenamerDiv">' +
                '<input id="linkRenamerButton" type="button" value="' + t('sharerenamer', 'Rename link') + '" />' +
                '<input id="ShareRenamerNew" type="text" class="hidden" placeholder="" autocomplete="off" spellcheck="false" autocorrect="off" />' +
                '<br>' +
                '<input id="ShareRenamerSave" type="button" class="hidden" value="' + t('sharerenamer', 'Rename') + '" />' +
                '<input id="ShareRenamerCancel" type="button" class="hidden" value="' + t('sharerenamer', 'Cancel') + '" />' +
            '</div><br>';
        $linkText.after($linkRenamerButtonElement);
    }

    $('#ShareRenamerNew').hide();

    if ($checkBox.is(':checked')) {
        $('#ShareRenamerDiv').show();
    } 
    else {
        $('#ShareRenamerDiv').hide();
    }

    $('#linkRenamerButton').click(function () {			
        $('#linkRenamerButton').hide();

        var url = $linkText.val();
        var idx = url.lastIndexOf("/");
        var baseUrl = url.substr(0, idx + 1);

        var idx2 = url.lastIndexOf("/");
        var token = url.substr(idx2 + 1);		

        $('#ShareRenamerNew').val('');
        $('#ShareRenamerNew').attr('placeholder', token);
        $('#ShareRenamerNew').show();
        $('#ShareRenamerSave').show();
        $('#ShareRenamerCancel').show();
        $('#ShareRenamerNew').focus();
    });

    $('#ShareRenamerCancel').click(function () {
        $('#ShareRenamerNew').val('');
        $('#ShareRenamerSave').click();
    });

    $('#ShareRenamerNew').keyup(function (event) {
        if (event.keyCode === 27) {
            $(this).tooltip('hide');
            $(this).tooltip('destroy');
            $('#ShareRenamerCancel').click();
            return;
        }

        var rx = /^[a-zA-Z0-9\-_]+$/g;
        if ($(this).val() != '' && !rx.test($(this).val())) {
            $(this).tooltip({
                placement: 'top',
                trigger: 'manual',
                title: t('sharerenamer', 'Only the following characters are allowed for links: %s').replace('%s', ' a-z, A-Z, 0-9, -, _ ')
            });
            $(this).tooltip('show');
        } else {
            $(this).tooltip('hide');
            $(this).tooltip('destroy');

            if (event.keyCode === 13) {
                $('#ShareRenamerSave').click();
                return;
            }
        }
    });

    $('#ShareRenamerSave').click(function () {
        $('#shareTabView input').attr('disabled', false);
        var linktxt = $('#linkText').val();
        var n = linktxt.lastIndexOf("/");
        var old_token = linktxt.substr(n + 1);
        var new_token = $('#ShareRenamerNew').val();
        var rx = /^[a-zA-Z0-9\-_]+$/g;

        if (new_token == old_token) {
            $('#ShareRenamerNew').val('');
        }
        else if (new_token != '' && !rx.test(new_token)) {
            // tooltip is shown, so just don't do anything
            $('#ShareRenamerNew').select();
            return false;
        }
        else if (new_token != '') {
            var init = new ShareRenamer(OC.generateUrl('/apps/sharerenamer/rename'));
            var exec = init.Rename(old_token, new_token);

            if (exec == 'pass') {
                $linkText.val($linkText.val().replace(old_token, new_token));
                $('#ShareRenamerNew').attr('placeholder', new_token);
                $('#ShareRenamerNew').val('');
            } 
            else if (exec == 'exists') {
                $('#ShareRenamerNew').tooltip({
                    placement: 'top',
                    trigger: 'manual',
                    title: t('files', 'Link {newname} already exists. Please choose another link name.').replace('{newname}', "'" + new_token + "'")
                });
                _.delay(function() {
                    $('#ShareRenamerNew').tooltip('hide');
                    $('#ShareRenamerNew').tooltip('destroy');
                }, 3000);

                $('#ShareRenamerNew').tooltip('show');
                $('#ShareRenamerNew').select();
                return false;
            } 
            else if (exec == 'error') {
                // alert is in AJAX call already
                return false;
            }
        }

        $('#linkRenamerButton').show();
        $('#ShareRenamerNew').hide();
        $('#ShareRenamerSave').hide();
        $('#ShareRenamerCancel').hide();
    });
};

$(document).ready(function () {
        if ($('#body-login').length > 0) {
            return true; //deactivate on login page
        }

        // As the shareWith input is focused when share button is clicked in Gallery app, 
        // we use this event.
        $(document).on('focus', '#shareWith', ShareRenamerFiles.showRenameOnGallery);
        $(document).on('change', '#dropdown #linkCheckbox', ShareRenamerFiles.showRenameOnGallery);
    }
);
