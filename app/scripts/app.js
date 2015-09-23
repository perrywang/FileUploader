Application = new Marionette.Application();

Application.addRegions({
  mainRegion: '#main',
});

Application.navigate = function(route,options) {
  options || (options = {});
  Backbone.history.navigate(route, options);
};


Application.on('start', function() {
  Backbone.history.start({ pushState: true});
  Backbone.Intercept.start();
});