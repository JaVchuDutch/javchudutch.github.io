develop:
	brew install hugo

serve:
	hugo server --bind ::1 
	#--disableFastRender --cleanDestinationDir --ignoreCache --noHTTPCache

update-deps:
	cd themes/ananke && git pull origin main

.PHONY: develop serve