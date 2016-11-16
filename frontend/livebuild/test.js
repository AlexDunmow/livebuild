import configureStore from 'app/reducers/reducers'
import Immutable from 'immutable'
var assert = require('chai').assert;

var app = new App()

var initialstate = Immutable.fromJS({
	files:[{
	    type: "folder",
	    name: "css",
	    path: "/css",
	    children: [{
	      type: "file",
	      name: "style.css",
	      path: "/css/style.css"
	    }, {
	      type: "file",
	      name: "colors.css",
	      path: "/css/colors.css"
	    }]
	  },{
	    type: "folder",
	    name: "js",
	    path: "/js",
	    children: [{
	      type: "file",
	      name: "app.js",
	      path: "/js/app.js"
	    }, {
	      type: "file",
	      name: "vendor.js",
	      path: "/vendor.js"
	    }]
	  },{
	  	type: "file",
	  	name: "index.html",
	  	path: "/index.html"
	  },{
	  	type: "file",
	  	name: "robots.txt",
	  	path: "/robots.txt"
	  }
	]
});

var store = configureStore()

describe('Files state loads', function() {
  describe('#indexOf()', function() {
    it('should return "app.js"', function() {
    	var file = 
      assert.equal(-1, [1,2,3].indexOf(5));
    });
  });
});