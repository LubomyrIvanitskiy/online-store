const puppeteer = require('puppeteer');
const fs = require('fs');
const server = require('node-http-server');
const url = 'http://localhost:8080/';
const localIndexFile = './build/index.html';

server.deploy(
	{
		verbose: true,
		port: 8080,
		root: __dirname + '/build/'
	},
	serverReady
);

function serverReady() {
	puppeteer
		.launch()
		.then(browser => browser.newPage())
		.then(page =>
			page.goto(url, { waitUntil: 'networkidle2' }).then(() =>
				page.$('#app').then(bodyHandle => {
					page.evaluate(body => body.innerHTML, bodyHandle).then(html => {
						bodyHandle.dispose();
						replateContent(html);
						process.exit();
					});
				})
			)
		)
		.catch(er => console.log('ERROR', er));
}

function replateContent(html) {
	const indexFile = fs.readFileSync(localIndexFile, 'utf8');
	const newContent = indexFile.replace(
		'<div class="prerender"></div>',
		`<div class="ssr">${html}</div>`
	);
	fs.writeFileSync(localIndexFile, newContent, 'utf8');
}
