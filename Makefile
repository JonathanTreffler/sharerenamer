# Makefile for building the project

app_name=sharerenamer
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(CURDIR)/build/artifacts
sign_dir=$(build_dir)/sign
appstore_dir=$(build_dir)/appstore
source_dir=$(build_dir)/source
package_name=$(app_name)
cert_dir=$(CURDIR)/../sharerenamerPrepareRelease

appstore:
	mkdir -p $(sign_dir)
	rsync -a \
	--exclude=build \
	--exclude=.git \
	--exclude=.tx \
	--exclude=build \
	--exclude=.gitignore \
	--exclude=l10n/.gitkeep \
	--exclude=Makefile \
	--exclude=screenshots \
	$(project_dir) $(sign_dir)

	@echo "Signing..."
	tar -czf $(build_dir)/$(app_name).tar.gz \
		-C $(sign_dir) $(app_name)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(build_dir)/$(app_name).tar.gz | openssl base64
