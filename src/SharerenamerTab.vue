<template>
	<div>
		<EmptyContent v-if="shares.length == 0" icon="icon-share">
			No shares to rename
			<template #desc>You can create shares in the shares tab</template>
		</EmptyContent>
		<AppNavigationItem v-for="share in shares" :key="share.token" :title="share.token" :editable="true" editPlaceholder="token" icon="icon-share" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios';

import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem';
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent'

export default {
	name: 'SharerenamerTab',
	data() {
		return {
			loading: false,
			token: null,
			fileInfo: {},
			shares: [],
		}
	},
	components: {
		AppNavigationItem,
		EmptyContent,
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
        rename: function(old_token, new_token) {

			console.log(old_token, new_token);

            // this._baseUrl already ends with /rename, found in routes.php
            var result = 'error';
            var request = $.ajax({
                url: this._baseUrl,
                data: {'old_token' : old_token, 'new_token' : new_token},
                method: 'POST',
                async: false
            });
            
            request.done(function(msg) {
                // will be 'exists', 'userexists' or 'pass'
                result = msg;
            });

            request.fail(function( jqXHR, textStatus ) {
                OC.Notification.show(t('sharerenamer', 'Error') + ': ' + textStatus, { type: 'error' });
            });
            
            return result;
        },
		update(fileInfo) {
			let self = this;

			console.log(fileInfo);
			this.fileInfo = fileInfo;

			axios.get("/ocs/v2.php/apps/files_sharing/api/v1/shares", {
				params: {
					format: "json",
					path: this.fileInfo.path + this.fileInfo.name,
					shared_with_me: false,
					subfiles: false,
					reshares: true,
				}
			}).then(function(response) {
				console.log(response);
				
				self.shares = [];

				for(let share of response.data.ocs.data) {
					console.log(share);

					if(share.share_type === 3 && share.can_edit) {
						self.shares.push({
							token: share.token,
							label: share.label,
						});
					}
				}
			})
		}
    },
}
</script>

<style scoped>
#tab-sharerenamer {
	height: 100%;
	padding: 0;
}
</style>