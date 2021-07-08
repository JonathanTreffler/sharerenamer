<template>
	<div>
		<p>Test</p>
		<p>{{ fileInfo }}</p>
	</div>
</template>

<script>
export default {
	name: 'SharerenamerTab',
	data() {
		return {
			loading: false,
			token: null,
			fileInfo: {},
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
        rename: function(old_token, new_token) {
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
			console.log(fileInfo);
			this.fileInfo = fileInfo;
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