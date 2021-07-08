import Vue from 'vue'
import { translate as t } from '@nextcloud/l10n'
import SharerenamerTab from './SharerenamerTab'

const View = Vue.extend(SharerenamerTab)
let tabInstance = null

window.addEventListener('DOMContentLoaded', function() {
	if (OCA.Files && OCA.Files.Sidebar) {
		let sharerenamerTab = new OCA.Files.Sidebar.Tab({
			id: 'sharerenamer',
			name: t('sharerenamer', 'Share Rename'),
			icon: 'icon-sharerenamer',

			mount(el, fileInfo, context) {
				if (tabInstance) {
					tabInstance.$destroy()
				}
				tabInstance = new View({
					// Better integration with vue parent component
					parent: context,
				})
				// Only mount after we have all the info we need
				tabInstance.update(fileInfo)
				tabInstance.$mount(el)
			},
			update(fileInfo) {
				tabInstance.update(fileInfo)
			},
			destroy() {
				tabInstance.$destroy()
				tabInstance = null
			},
			enabled(fileInfo) {
				//return (fileInfo && !fileInfo.isDirectory());
				return true;
			},
		})
		OCA.Files.Sidebar.registerTab(sharerenamerTab)
	}
})