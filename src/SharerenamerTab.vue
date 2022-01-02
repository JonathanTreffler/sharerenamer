<template>
	<div>
		<EmptyContent v-if="shares.length == 0" icon="icon-share">
			{{ t("sharerenamer", "No link shares to rename") }}
			<template #desc>
				{{ t("sharerenamer", "You can create link shares in the shares tab") }}
			</template>
		</EmptyContent>
		<AppNavigationItem v-for="share in shares"
			:key="share.token"
			:title="share.token"
			:editable="true"
			edit-placeholder="token"
			icon="icon-share"
			@update:title="function(value){rename(share.token, value);}" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'

import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent'
import { generateUrl, generateOcsUrl } from '@nextcloud/router'

export default {
	name: 'SharerenamerTab',
	components: {
		AppNavigationItem,
		EmptyContent,
	},
	data() {
		return {
			loading: false,
			token: null,
			fileInfo: {},
			shares: [],
			baseUrl: generateUrl('/apps/sharerenamer'),
		}
	},
	computed: {
		/**
		 * Returns the current active tab
		 * needed because AppSidebarTab also uses $parent.activeTab
		 *
		 * @returns {string}
		 */
		activeTab() {
			return this.$parent.activeTab
		},
	},
	beforeDestroy() {
		try {
			this.tab.$destroy()
		} catch (error) {
			console.error('Unable to unmount Sharerenamer tab', error)
		}
	},
	methods: {
		rename(oldToken, newToken) {
			const self = this

			// console.log(oldToken, newToken)

			// this._baseUrl already ends with /rename, found in routes.php
			let result = 'error'

			// eslint-disable-next-line
			const request = $.ajax({
				url: this.baseUrl + '/rename',
				data: { old_token: oldToken, new_token: newToken },
				method: 'POST',
				async: false,
			})

			request.done(function(msg) {
				// will be 'exists', 'userexists' or 'pass'
				result = msg

				if (result === 'pass') {
					// console.log(self.getShareByToken(oldToken));
					self.getShareByToken(oldToken).token = newToken
				}
			})

			request.fail(function(jqXHR, textStatus) {
				OC.Notification.show(t('sharerenamer', 'Error') + ': ' + textStatus, { type: 'error' })
			})

			return result
		},
		update(fileInfo) {
			const self = this

			// console.log(fileInfo)
			this.fileInfo = fileInfo

			axios.get(generateOcsUrl('apps/files_sharing/api/v1', 2) + '/shares', {
				params: {
					format: 'json',
					path: (this.fileInfo.path + '/' + this.fileInfo.name).replace('//', '/'),
					shared_with_me: false,
					subfiles: false,
					reshares: true,
				},
			}).then(function(response) {
				// console.log(response)

				self.shares = []

				for (const share of response.data.ocs.data) {
					// console.log(share)

					if (share.share_type === 3 && share.can_edit) {
						self.shares.push({
							token: share.token,
							label: share.label,
						})
					}
				}
			})
		},
		getShareByToken(token) {
			return this.shares.find(share => {
				return share.token === token
			})
		},
	},
}
</script>

<style scoped>
#tab-sharerenamer {
	height: 100%;
	padding: 0;
}
</style>
