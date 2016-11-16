var assert = require('chai').assert;

var fakesfilesjson = JSON.stringify([{
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
]);

describe('Files state loads', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(5));
    });
  });
});