develop:
	brew install hugo

serve:
	hugo server --bind ::1 --disableFastRender --cleanDestinationDir --ignoreCache --noHTTPCache

.PHONY: develop serve