## Setting up a local repository

1. [Download the GitHub dekstop application](https://central.github.com/deployments/desktop/desktop/latest/win32)

2. When the application is all setup, [click me to open this repo in the application](x-github-client://openRepo/https://github.com/mistopportunity/uvtc) (it took like 20 seconds for me to pop up after entering it, so give it a little bit)

3. A popup should appear on the program that says `clone a repository`.

4. Choose a different local path if you would like and hit `clone`. Make a note of this local path.

5. Click the `fetch origin` button to verify the files downloaded correctly.

6. You will also need to clone a repo for the engine. This follows the same previous steps. [Click me to open the engine repo in the GitHub application](x-github-client://openRepo/https://github.com/mistopportunity/elven-engine). You must place this repo so that it is in the same directory as your uvtc folder, but not inside it. For instance, `documents/elven-engine` and `documents/uvtc`, but not `documents/uvtc/elven-engine`.

I recommend that you sign into GitHub so if you need to send commits or pull requests. I will add you as a trusted contributor.

You will need to periodically use the fetch origin button to keep your repos up to date. If you make a commit with new songs, this will help us both. This generally is immediate once the files are uploaded and doesn't have the same delays that GitHub's hosted version does.


## Adding new songs to the game files

All file paths here are assumed to be relative to your `uvtc` folder. For instance, `uvtc\index.html` would be referred to as just `index.html`.

Any files you put here should be in OGG format. Other web audio file formats are supported, but the flags found in `release-flags.js` and `debug-flags.js` currently expect OGG. Change them if you need to use a different file format.

1. Navigate to the root folder from earlier and from there go to `elven-uvtc\audio\music\`

2. Put your music files here. You can organize them into subfolders, but there cannot be duplicate file names regardless of their hierarchy. When you link to music files, you will only use their short name. For example, `elven\uvtc\audio\music\menu-song.ogg` becomes just `menu-song`.



## Linking songs

Linking songs is a bit more involved. You're going to have to get your hands dirty but not too much.

1. Open the file `elven-uvtc\audio\music\linking-manifest.js` There are comments in this file that you may find useful. Ask if you need any additional help.

2. The main menu song must be named `main-menu.ogg`, unless you are using a different file format. This doesn't require any additional steps.

## Running the application

Sorry cowboy. We're not done here yet.

1. You'll need to have [node.js](https://nodejs.org/en/) installed in order to run the application. Simply navigating to the HTML file over the `file://` protocol won't be enough because it doesn't supply MIME types. Get the [current version of node.js here](https://nodejs.org/dist/v12.3.1/node-v12.3.1-x64.msi).

2. Once node.js is all setup, open a terminal and navigate to your `uvtc` root folder. In CMD, you can drag the folder into the terminal window.

3. Run `npm help` to ensure the install went mostly okay. You should see something like `npm@6.7.0 C:\Program Files\nodejs\node_modules\npm`.

4. Run `npm install` to install the required dependencies to host the game over `localhost`. This may take a few minutes.

5. When the installation process is done, you will be able to run the command `npm run-script web` to start the server

6. Navigate to [http://localhost/uvtc/index.html](http://localhost/uvtc/index.html) in a supported web browser.

    To skip the pesty cutscenes and freely move around the world as you please, go to [http://localhost/uvtc/index-debug.html](http://localhost/uvtc/index-debug.html) instead.


## Troubleshooting

- Chrome and its web policies hate game developers and will not auto play music unless you have interacted with the page. If you have changed the main-menu song and it didn't play, clicking the `controls` button on main menu should do the trick.

- If you've added a song and it just won't play, check the console to see if there are any errors. You might have made a typo somewhere in the process. E.g., the file named `song` but the link is named `snog`, and vice versa. It's overwhelmingly easy to do on accident.

- I'll let you know when there's a commit you should probably fetch.

- Anything else, just ask.
