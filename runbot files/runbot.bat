@echo off
color 0a
title Start Bot
echo please enter your token
set /k token=
echo Connecting....
CMD /k node bot.js
::if you want a batch file like this then check out https://github.com/RScodes/DiscordBot-Startup-Batch-files for batch files for multiple api's
PAUSE
