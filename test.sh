#!/bin/bash

page="$1"

npm run build:prod
amr_file=$(ls *.amr)
base_name="${amr_file%%.*}"

adb push $amr_file /userdisk/Favorite/
adb shell "miniapp_cli install /userdisk/Favorite/$amr_file"
adb shell "miniapp_cli start $base_name $page"
