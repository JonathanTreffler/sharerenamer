<template>
	<div>
		<NcEmptyContent v-if="shares.length == 0"
			icon="icon-share"
			:name="t('sharerenamer', 'No link shares to rename')"
			:description="t('sharerenamer', 'You can create link shares in the shares tab')">
			<template #icon>
				<ShareVariant />
			</template>
		</NcEmptyContent>
		<NcAppNavigationItem v-for="share in shares"
			:key="share.token"
			:name="share.token"
			:editable="true"
			:edit-placeholder="t('sharerenamer', 'Link token')"
			:edit-label="t('sharerenamer', 'Change link token')"
			icon="icon-share"
			@update:name="function(value){rename(share.token, value);}" />
	</div>
</template>

<script>
import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'

import axios from '@nextcloud/axios'
import { generateUrl, generateOcsUrl } from '@nextcloud/router'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

export default {
	name: 'SharerenamerTab',
	components: {
		NcAppNavigationItem,
		NcEmptyContent,
		ShareVariant,
	},
	data() {
		return {
			loading: false,
			token: null,
			fileInfo: {},
			shares: [],
		}
	},
	computed: {
		/**
		 * Returns the current active tab
		 * needed because AppSidebarTab also uses $parent.activeTab
		 *
		 * @return {string}
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

			axios.post(generateUrl('/apps/sharerenamer/rename'), {
				old_token: oldToken,
				new_token: newToken,
			})
				.then(function(response) {
					// console.log(self.getShareByToken(oldToken));
					self.getShareByToken(oldToken).token = newToken
				}).catch(function(error) {
					let errorMessage = t('sharerenamer', 'Could not change link token')

					if (error.response) {
						if (error.response.data === 'exists') {
							errorMessage = t('sharerenamer', 'A link share with that token already exists')
						} else if (error.response.data === 'userexists') {
							errorMessage = t('sharerenamer', 'A link share cannot be the same as a registered username')
						}
					}

					OC.Notification.show(t('sharerenamer', 'Error') + ': ' + errorMessage, { type: 'error' })
				})
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
