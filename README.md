# What is it

A template to start a website with Gulp

## Use this package

### Prerequisites

Go to [Node website](https://nodejs.org/en/download/).

### Install

```sh
npm install
gulp watch
```

It will install the dev dependencies and launch the web server with browser sync.

## Folders

In `src`, you will :

- `copy`: contains all the files like `.html`, the manifest and your content images. By default, it also contains the [Favicon generator template](https://favicon.io/favicon-generator/).
- `js`: all your javascript.
- `sass`: all your SCSS/SASS/CSS. By default, there is no SCSS or SASS code even if the files are named `.scss`. I have not yet learned those and I'm still writing vanilla CSS.

## Gulp file

The gulp file is inspired from [Chris Ferdinandi's post](https://gomakethings.com/a-new-gulp-boilerplate/).
I have altered the script to include Font Awesome Pro 5.

## Want to create your package from this one

### Initialize your project

`npm init` and fill the inputs.

### Install gulp globally

Go to [Gulp getting started](https://gulpjs.com/docs/en/getting-started/quick-start).

### Install the dev dependencies

```sh
npm install --save-dev gulp
npm install --save-dev browser-sync
npm install --save-dev del
npm install --save-dev gulp-header
npm install --save-dev gulp-rename
npm install --save-dev gulp-flatmap
npm install --save-dev lazypipe
npm install --save-dev gulp-jshint
npm install --save-dev jshint
npm install --save-dev jshint-stylish
npm install --save-dev gulp-concat
npm install --save-dev gulp-terser
npm install --save-dev gulp-optimize-js
npm install --save-dev gulp-sass
npm install --save-dev gulp-postcss
npm install --save-dev autoprefixer
npm install --save-dev cssnano
npm install --save-dev gulp-svgmin
```

### Install Font Awesome Pro (OPTIONAL)

Create a `.npmrc` file with the following content:

```txt
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${FONTAWESOME_NPM_AUTH_TOKEN}
```

Then run `FONTAWESOME_NPM_AUTH_TOKEN=YOUR_FA_TOKEN npm install --save @fortawesome/fontawesome-pro`.

You can find the token on your [Font Awesome account](https://fontawesome.com/account) under `Pro npm Package Token` section.

If any issue arise, [checkout Font Awesome website](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers).
