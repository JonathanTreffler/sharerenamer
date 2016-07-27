/* global OC, $, t */

var ShareRenamer = function(baseUrl) {
	this._baseUrl = baseUrl;
};

ShareRenamer.prototype = {
	Rename: function(old_token, new_token) {
		// this._baseUrl already ends with /rename, found in routes.php
		var result = 'error';
		var request = $.ajax({
			url: this._baseUrl,
			data: {'old_token' : old_token, 'new_token' : new_token},
			method: 'POST',
			async: false
		});
		
		request.done(function(msg) {
			// will be 'exists' or 'pass'
			result = msg;
		});

		request.fail(function( jqXHR, textStatus ) {
			alert(t('core', 'Error') + ': ' + textStatus);
		});
		
		return result;
	}
};

var ShareRenamerFiles = {};

ShareRenamerFiles.hijackShare = function () {
	var ShareDialogLinkShareViewRender = OC.Share.ShareDialogLinkShareView.prototype.render;
	OC.Share.ShareDialogLinkShareView.prototype.render = function () {
		var r = ShareDialogLinkShareViewRender.apply(this, arguments);
		var $linkRenamerButtonElement = this.$el.find('#linkRenamerButton');
		var $ShareRenamerDiv = this.$el.find('#ShareRenamerDiv');
		var $linkText = this.$el.find('.linkText');
		var $checkBox = this.$el.find('.linkCheckbox');
		var fileInfoModel = this.model.fileInfoModel;

		if (!$linkRenamerButtonElement.length) {
			var linktxt = $linkText.val();
			if (linktxt == "" || linktxt == null || linktxt == false || typeof(linktxt) == 'undefined') {
				var token = '???';
			} else {
				var n = linktxt.lastIndexOf("/");
				var token = linktxt.substr(n + 1);
			}
			$linkRenamerButtonElement = 
				'<div id="ShareRenamerDiv">' +
					'<input id="linkRenamerButton" type="button" class="button" value="' + t('core', 'Share link') + ': ' + t('core', 'Rename').toLowerCase() + '" />' +
					'<input id="ShareRenamerNew" type="text" class="hidden" placeholder="' + token + '" autocomplete="off" spellcheck="false" autocorrect="off" />' +
					'<input id="ShareRenamerSave" type="button" class="button hidden" value="' + t('core', 'Rename') + '" />' +
				'</div><br>';
			$linkText.after($linkRenamerButtonElement);
		}

		if ($checkBox.is(':checked')) {
			$('#ShareRenamerDiv').show();
		} else {
			$('#ShareRenamerDiv').hide();
		}

		$('#linkRenamerButton').click(function () {
			$('#linkRenamerButton').hide();
			$('#ShareRenamerNew').show();
			$('#ShareRenamerSave').show();
			$('#ShareRenamerNew').focus();
		});
		$('#ShareRenamerSave').click(function () {
			$('#shareTabView input').attr('disabled', false);
			var linktxt = $('.linkText').val();
			var n = linktxt.lastIndexOf("/");
			var old_token = linktxt.substr(n + 1);
			var new_token = $('#ShareRenamerNew').val();
			var rx = /^[a-zA-Z0-9]+$/g;
			if (new_token != '' && !rx.test(new_token)) {
				alert(t('core', 'Only %s is available.').replace('%s', 'a-z, A-Z, 0-9'));
				$('#ShareRenamerNew').select();
				return false;
			}
			if (new_token != '') {
				var init = new ShareRenamer(OC.generateUrl('/apps/sharerenamer/rename'));
				var exec = init.Rename(old_token, new_token);

				if (exec == 'pass') {
					$linkText.val($linkText.val().replace(old_token, new_token));
					$('#ShareRenamerNew').attr('placeholder', new_token);
					$('#ShareRenamerNew').val('');
				} else if (exec == 'exists') {
					alert(t('files', '{newname} already exists').replace('{newname}', "'" + new_token + "'") + '.');
					$('#ShareRenamerNew').select();
					return false;
				} else if (exec == 'error') {
					// alert is in AJAX call already
					return false;
				}
			}
			$('#linkRenamerButton').show();
			$('#ShareRenamerNew').hide();
			$('#ShareRenamerSave').hide();
		});

		return r;
	};
};


$(document).ready(function () {

		if ($('#body-login').length > 0) {
			return true; //deactivate on login page
		}

		if ($('#filesApp').val()) {
			$('#fileList').one('updated', ShareRenamerFiles.hijackShare);
		}

	}
);
