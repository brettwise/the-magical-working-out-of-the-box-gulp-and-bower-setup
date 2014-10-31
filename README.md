A Good Baseline Gulp & Bower Config (or The Magical Working Out of the Box Gulp and Bower Setup)
=======================================================

### TLDR (in Only 3 commands!)

Inside the root where package.json and the rest of these files are in the repo type: 

	$ npm install
	$ bower install
	$ gulp watch

You are now ready to edit or add any files into assets and gulp will automagically do everything. 

If you want more detail keep reading.


#### Too Long and Did Read! (Good on you!)

	$ npm install

This will install all node dependencies listed in package.json including: bower, gulp, and all gulp plugins. If it fails install node.

	$ bower install

This will install all frontend dependencies listed in bower.json into bower_conponents. You know, in case you need to look at them or something. They have already been concatenated in vendor.min.js and vendor.min.css, so you don't need to grab these unless you are adding to them or, like I said, want to look at them.

	$ gulp watch

This will start the process of watching your source files. If anything changes it will recompile. 

#### Adding Dependencies 

If you add frontend libraries do it with: 

	$ bower install libraryname --save 

gulp will take those files, do it's magic and your page will be updated on refresh. 
