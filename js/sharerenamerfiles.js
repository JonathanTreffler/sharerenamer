/* global OC, $, t */

ShareRenamerFiles.hijackShare = function () {
	var ShareDialogLinkShareViewRender = OC.Share.ShareDialogLinkShareView.prototype.render;
	OC.Share.ShareDialogLinkShareView.prototype.render = function () {
		var r = ShareDialogLinkShareViewRender.apply(this, arguments);
		var $linkRenamerButtonElement = this.$el.find('#linkRenamerButton');
		var $linkText = this.$el.find('.linkText');
		var $checkBox = this.$el.find('.linkCheckbox');

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
					'<input id="linkRenamerButton" type="button" class="button" value="' + t('sharerenamer', 'Rename link') + '" />' +
					'<input id="ShareRenamerNew" type="text" class="hidden" placeholder="" autocomplete="off" spellcheck="false" autocorrect="off" />' +
					'<br>' +
					'<input id="ShareRenamerSave" type="button" class="button hidden" value="' + t('sharerenamer', 'Rename') + '" />' +
					'<input id="ShareRenamerCancel" type="button" class="button hidden" value="' + t('sharerenamer', 'Cancel') + '" />' +
				'</div><br>';
			$linkText.after($linkRenamerButtonElement);
		}

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
					placement: 'right',
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
			var linktxt = $('.linkText').val();
			var oldLinkTxt = linktxt;
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
						placement: 'right',
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

			// Refresh clipboard button text
			new Clipboard('.clipboardButton', {
				text: function(trigger) {
					return $linkText.val();
				}
			});

			// Refresh social share links
			OC.Share.Social.Collection.each(function(model) {
				var url = model.get('url');
				newUrl = url.replace('{{reference}}', $linkText.val());
				var oldUrl = url.replace('{{reference}}', oldLinkTxt);

				$('.shareOption').each(function() {
					if($(this).attr('data-url') == oldUrl)
						$(this).attr('data-url', newUrl);
				})
			});
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