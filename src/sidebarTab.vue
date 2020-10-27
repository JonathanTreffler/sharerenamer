<template>
	<Tab
		:id="id"
		:icon="icon"
		:name="name"
		:class="{ 'icon-loading': loading }">
	</Tab>
</template>

<script>
import Tab from '@nextcloud/vue/dist/Components/AppSidebarTab'
export default {
	name: 'FilesSidebarTab',
	components: {
		Tab,
	},
	props: {
		fileInfo: {
			type: Object,
			default: () => {},
			required: true,
		},
	},
	data() {
		return {
			icon: 'icon-sharerenamer',
			loading: false,
			name: 'Sharerenamer',
			tab: null,
			token: null,
		}
	},
	computed: {
		/**
		 * Needed to differenciate the tabs
		 * pulled from the AppSidebarTab component
		 *
		 * @returns {string}
		 */
		id() {
			return 'sharerenamer'
		},
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
	beforeMount() {
	},
	mounted() {
	},
	beforeDestroy() {
		try {
			this.tab.$destroy()
		} catch (error) {
			console.error('Unable to unmount Chat tab', error)
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
    },
}
</script>

<style scoped>
#tab-sharerenamer {
	height: 100%;
	padding: 0;
}
</style>