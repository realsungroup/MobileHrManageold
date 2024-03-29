define(['plugins/router', 'durandal/app','knockout',,'realsun/workbase'], function (router, app,ko) {

    var router= router.map(appConfig.app.mainRouter).buildNavigationModel();
     
    return {
      
        router: router,
        search: function() {
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
          
            return router.activate();
        }
        ,
        rootRouter: ko.computed(function() {
            return ko.utils.arrayFilter(router.navigationModel(), function(route) {
                return route.type == 'root';
            });
        }),
        attached:function(){
            tabClick = function(){
                // this.
            }

            document.body.addEventListener('touchstart', function () { //...空函数即可
            });    
        },
       
    };
});
