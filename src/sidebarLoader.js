import SidebarTab from './SidebarTab.vue'

const isEnabled = function(fileInfo) {
	return (fileInfo && !fileInfo.isDirectory());
}

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Files && OCA.Files.Sidebar) {
		OCA.Files.Sidebar.registerTab(new OCA.Files.Sidebar.Tab('tab-sharerenamer', SidebarTab, isEnabled))
	}
})