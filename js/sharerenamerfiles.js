/* global OC, $, t */

ShareRenamerFiles.hijackShare = function () {
	var ShareDialogLinkShareViewRender = OC.Share.ShareDialogLinkShareView.prototype.render;

	OC.Share.ShareDialogLinkShareView.prototype.render = function () {
		var r = ShareDialogLinkShareViewRender.apply(this, arguments);
		var $shareMenus = this.$el.find('.share-menu');

		var id = 0;

		$shareMenus.each(function() {
			id++;

			var $linkTextMenu = $(this).find('.linkTextMenu');
			var $linkText = $(this).find('.linkText');

			$shareRenamerButtonMenuItem =
			'<li>' +
				'<a href="#" id="startShareRenamer-' + id + '" class="menuitem">' +
					'<span class="icon icon-edit"></span>' +
					'<span>' + t('sharerenamer', 'Rename link') + '</span>' + 
				'</a>' +
			'</li>' +
			'<li id="shareRenamerBaseUrlMenuItem-' + id + '" class="hidden">' +
				'<span class="menuitem">' +
					'<input id="ShareRenamerBaseUrl-' + id + '" class="hidden" type="text" value="" readonly autocomplete="off" spellcheck="false" autocorrect="off" />' +
				'</span>' +
			'</li>' +
			'<li id="shareRenamerNewMenuItem-' + id + '" class="hidden">' +
				'<span class="menuitem">' +
					'<input id="ShareRenamerNew-' + id +'" type="text" class="hidden" placeholder="" autocomplete="off" spellcheck="false" autocorrect="off" />' +
				'</span>' +
			'</li>' +
			'<li id="shareRenamerSaveMenuItem-' + id + '">' +
				'<span class="menuitem">' +
					'<input id="ShareRenamerSave-' + id + '" type="button" class="hidden button" value="' + t('sharerenamer', 'Rename') + '" />' +
				'</span>' +
			'</li>' +
			'<li id="shareRenamerCancelMenuItem-' + id + '">' +
				'<span class="menuitem">' +
					'<input id="ShareRenamerCancel-' + id + '" type="button" class="hidden button" value="' + t('sharerenamer', 'Cancel') + '" />' +
				'</span>' +
			'</li>';

			$linkTextMenu.before($shareRenamerButtonMenuItem);

			function defineEvents(controlid, linkText) {
				$('#startShareRenamer-' + controlid).click(function () {
					var url = linkText.val();
					var idx = url.lastIndexOf("/");
					var baseUrl = url.substr(0, idx + 1);
	
					var idx2 = url.lastIndexOf("/");
					var token = url.substr(idx2 + 1);

					$('#ShareRenamerNew-' + controlid).val('');
					$('#ShareRenamerBaseUrl-' + controlid).val(baseUrl);
					$('#ShareRenamerNew-' + controlid).attr('placeholder', token);
					$('#shareRenamerBaseUrlMenuItem-' + controlid).removeClass('hidden');
					$('#ShareRenamerBaseUrl-' + controlid).removeClass('hidden');
					$('#shareRenamerNewMenuItem-' + controlid).removeClass('hidden');
					$('#shareRenamerSaveMenuItem-' + controlid).removeClass('hidden');
					$('#shareRenamerCancelMenuItem-' + controlid).removeClass('hidden');
					$('#ShareRenamerNew-' + controlid).removeClass('hidden');
					$('#ShareRenamerSave-' + controlid).removeClass('hidden');
					$('#ShareRenamerCancel-' + controlid).removeClass('hidden');
					$('#ShareRenamerNew-' + controlid).focus();
				});

				$('#ShareRenamerCancel-' + controlid).click(function () {
					$('#ShareRenamerNew-' + controlid).tooltip('hide');
					$('#ShareRenamerNew-' + controlid).tooltip('destroy');
					$('#ShareRenamerNew-' + controlid).val('');
					$('#ShareRenamerSave-' + controlid).click();
					$('#shareRenamerNewMenuItem-' + controlid).addClass('hidden');
					$('#shareRenamerSaveMenuItem-' + controlid).addClass('hidden');
					$('#shareRenamerCancelMenuItem-' + controlid).addClass('hidden');
					$('#ShareRenamerBaseUrl-' + controlid).add('hidden');
					$('#shareRenamerBaseUrlMenuItem-' + controlid).addClass('hidden');
				});

				$('#ShareRenamerNew-' + id).keyup(function (event) {
					if (event.keyCode === 27) {
						$(this).tooltip('hide');
						$(this).tooltip('destroy');
						$('#ShareRenamerCancel-' + controlid).click();
						return;
					}

					var rx = /^[a-zA-Z0-9\-_]+$/g;

					if ($(this).val() != '' && !rx.test($(this).val())) {
						$('#ShareRenamerNew-' + controlid).tooltip({
							placement: 'top',
							trigger: 'manual',
							title: t('sharerenamer', 'Only the following characters are allowed for links: %s').replace('%s', 'a-z, A-Z, 0-9, -, _')
						});

						$('#ShareRenamerNew-' + controlid).tooltip('show');
					} 
					else {
						$('#ShareRenamerNew-' + controlid).tooltip('hide');
						$('#ShareRenamerNew-' + controlid).tooltip('destroy');

						if (event.keyCode === 13) {
							$('#ShareRenamerSave-' + controlid).click();
							return;
						}
					}
				});

				$('#ShareRenamerSave-' + controlid).click(function () {
					$('#shareTabView input').attr('disabled', false);
					var linktxt = linkText.val();
					var oldLinkTxt = linktxt;
					var n = linktxt.lastIndexOf("/");
					var old_token = linktxt.substr(n + 1);
					var new_token = $('#ShareRenamerNew-' + controlid).val();
					var rx = /^[a-zA-Z0-9\-_]+$/g;

					if (new_token == old_token) {
						$('#ShareRenamerNew-' + controlid).val('');

					} 
					else if (new_token != '' && !rx.test(new_token)) {
						// tooltip is shown, so just don't do anything
						$('#ShareRenamerNew-' + controlid).select();
						return false;	
					} 
					else if (new_token != '') {
						var init = new ShareRenamer(OC.generateUrl('/apps/sharerenamer/rename'));
						var exec = init.Rename(old_token, new_token);

						if (exec == 'pass') {
							linkText.val(linkText.val().replace(old_token, new_token));
							$('#ShareRenamerNew-' + controlid).attr('placeholder', new_token);
							$('#ShareRenamerNew-' + controlid).val('');
						} 
						else if (exec == 'exists') {
							$('#ShareRenamerNew-' + controlid).tooltip({
								placement: 'top',
								trigger: 'manual',
								title: t('sharerenamer', 'Link {newname} already exists. Please choose another link name.').replace('{newname}', "'" + new_token + "'")
							});

							$('#ShareRenamerNew-' + controlid).tooltip('show');
							$('#ShareRenamerNew-' + controlid).select();
							return false;
						} 
						else if (exec == 'error') {
							// alert is in AJAX call already
							return false;
						}
					}

					$linkTextMenu.addClass('hidden');
					$('#ShareRenamerNew-' + controlid).addClass('hidden');
					$('#ShareRenamerSave-' + controlid).addClass('hidden');
					$('#ShareRenamerCancel-' + controlid).addClass('hidden');
					$('#ShareRenamerBaseUrl-' + controlid).addClass('hidden');

					// Refresh clipboard buttons text
					new Clipboard('.clipboard-button', {
						text: function(trigger) {
							var x = linkText.val();
							return linkText.val();
						}
					});

					// Nextcloud 14
					new Clipboard('.clipboardButton', {
						text: function(trigger) {
							var x = linkText.val();
							return linkText.val();
						}
					});

					// Refresh social share links
					OC.Share.Social.Collection.each(function(model) {
						var url = model.get('url');
						newUrl = url.replace('{{reference}}', linkText.val());
						var oldUrl = url.replace('{{reference}}', oldLinkTxt);

						$('.shareOption').each(function() {
							if($(this).attr('data-url') == oldUrl)
								$(this).attr('data-url', newUrl);
						})
					});
				});
			}

			defineEvents(id, $linkText);
		})

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
