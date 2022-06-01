const fs = require('fs');
const fse = require('fs-extra');

const manifest = require('../public/manifest.json');

/**
 * readFile uses a Regex to filter, match, and return the static file based on
 * the `prefix` and `extension` in the directory based on the `path`.
 *
 * @param {string} path File path relative to the build directory - `'static/js'`
 * @param {string} prefix File prefix for the file name - `'main'`
 * @param {string} extension File extension - 'js'
 * @returns {string} File name - `'main.66848e72.js'`
 */
function readFile(path, extension) {
	const file = new RegExp(`^.*[a-z0-9]+\.${extension}$`)
	return fs.readdirSync(`./build/${path}`)
		.filter(filename => file.test(filename))
		.map(filename => `${path}/${filename}`);
}

const js = readFile('static/js', 'js');
const css = readFile('static/css', 'css');
const media = readFile('static/media', 'svg');


const newManifest = {
	...manifest,
	content_scripts: [
		{
			...manifest.content_scripts[0],
			js: js,
			css: css,
		}
	],
	web_accessible_resources: [
		{
			...manifest.web_accessible_resources[0],
			resources: [...manifest.web_accessible_resources[0].resources, ...css, ...media]

		}
	]
};

fs.writeFileSync('./build/manifest.json', JSON.stringify(newManifest, null, 2));

for (const image of fs.readdirSync(`src/images`)) {
	fs.copyFile(`src/images/${image}`, `build/static/media/${image}`, err => {
	})
}
fse.copySync('src/_locales', 'build/_locales', {overwrite: true}, function (err) {
	if (err) {
		console.error(err);    // add if you want to replace existing folder or file with same name
	} else {
		console.log("success!");
	}
});
const onlyNeededFiles = ['_locales', 'static', 'manifest.json']
for (const item of fs.readdirSync("./build")) {
	if (!onlyNeededFiles.includes(item)) {
		if (fs.lstatSync(`./build/${item}`).isDirectory()) {
			fs.rmdirSync(`./build/${item}`, {recursive: true});
		} else {
			fs.rmSync(`./build/${item}`);
		}
	}
}