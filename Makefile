develop:
	brew install hugo

serve:
	hugo server --bind ::1 
	#--disableFastRender --cleanDestinationDir --ignoreCache --noHTTPCache

# Move the theme submodule to the latest upstream release tag.
# Commit the resulting themes/ananke pointer change afterwards.
update-deps:
	cd themes/ananke && git fetch --tags origin && \
		git checkout "$$(git tag --sort=-v:refname | head -1)" && \
		git describe --tags

.PHONY: develop serve update-deps
