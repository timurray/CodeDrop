This server is set up so that it recognizes "Server.js" as an application, this way it is always running in the background and starts on start up.

Put any new html or css or javascript or whatever you need in the /server/publicdirectory of the git repo (thank you express node), then git push that.

If you want these changes to actually show up on the webpage, go into ssh tim@codedrop.microhex.net (since its running out of my account in the git repo i've cloned there), then go cd /teamproj/CodeDrop and git pull.

Once you have pulled, type the command: pm2 restart 5

This will restart the application and any changes will be seen when you go to the webpage (hopefully). All html pages put in the /public/ folder show up at codedrop.microhex.net/nameOfFile.html, the index.html is default if no extension is used in the url, i.e. just "codedrop.microhex.net", but you can also use index.html to go to that same page.

