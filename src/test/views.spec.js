var System = require('systemjs');

describe('HomeView spec', function () {
    var view, model;

    beforeEach(function () {
      view = new HomeView();
    });

    describe('when view is constructing', function () {

        it ('should exist', function () {
              expect(view).toBeDefined();
        });

    });
});
