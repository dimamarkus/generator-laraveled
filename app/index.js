'use strict';
var util     = require('util'),
    path     = require('path'),
    yeoman   = require('yeoman-generator'),
    exec     = require('child_process').exec,
    execSync = require('exec-sync');


var LaraveledGenerator = module.exports = function LaraveledGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LaraveledGenerator, yeoman.generators.Base);


LaraveledGenerator.prototype.askFor = function askFor() {
  var done = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);


  var prompts = [
  {
    // type: 'confirm',
    name: 'projectName',
    message: 'Would you like to call the project?',
    default: 'projectName'
  },
  {
    type: 'confirm',
    name: 'foundation',
    message: 'Would you like to include Foundation?',
    default: true
  },
  {
    type: 'confirm',
    name: 'fontAwesome',
    message: 'Would you like to include Font Awesome?',
    default: true
  }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.foundation = props.foundation;
    this.fontAwesome = props.fontAwesome;

    done();
  }.bind(this));
};


LaraveledGenerator.prototype.app = function app() {
  this.template('gulpfile.js',    'gulpfile.js');

  this.template('_bower.json',    'bower.json');
  this.template('_package.json',  'package.json');
};


LaraveledGenerator.prototype.install = function () {
  if (this.options['skip-install']){
    return;
  }

  var done = this.async();
  this.installDependencies({ skipInstall: this.options['skip-install']});
  console.log('Please give me a few minutes to get Bower components and install Laravel \n');
  execSync('composer create-project laravel/laravel tempInstall --prefer-dist');
  console.log('Laravel has been installed. \n');
  done();
};


LaraveledGenerator.prototype.prepFiles = function prepFiles() {
  this.copy('bowerrc', '.bowerrc');


  execSync('cp -rf tempInstall/* .');
  execSync('rm -rf tempInstall');

  console.log('Im going to try and create asset folders in your laravel folder');
  this.mkdir("public/js");
  this.mkdir("public/scss");
  this.mkdir("public/css");
  this.mkdir("public/images");

  this.template("scss/app.scss", "public/scss/app.scss");
  this.template("scss/_settings.scss", "public/scss/_settings.scss");
  console.log('Ok.. that went well. \n');

  this.template('gitignore', '.gitignore');

  console.log("Adding the Jeffrey Way Generators");
  console.log("First we adjust the composer.json file");
  execSync('rm composer.json');
  this.template('_composer.json', 'composer.json');
  console.log("Now we add the provider");

  execSync('rm app/config/app.php');
  this.template('app/_app.php', 'app/config/app.php');
};


LaraveledGenerator.prototype.updateComposer = function () {
  var done = this.async();
  console.log('\n Lets give composer a minute or two to update \n');
  execSync('composer update');
  done();
};


LaraveledGenerator.prototype.runGenerators = function runGenerators() {
  console.log("Let's generate a key");
  execSync('php artisan key:generate');
};

LaraveledGenerator.prototype.createDefaultViews = function createDefaultViews() {
  console.log("Creating default layout and view \n");
  this.mkdir("app/views/layouts");
  this.template('app/default.blade.php', 'app/views/layouts/default.blade.php')
  this.template('app/index.blade.php', 'app/views/index.blade.php')

  console.log("Adjusting the routes file \n");
  execSync('rm app/routes.php');
  this.template('app/routes.php', 'app/routes.php')
};


