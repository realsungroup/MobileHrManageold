
workbase = (function () {
    function workbase() {
        this.itemActiveClass = 'item-active';
        this.itemClass = 'list__item itemfocus';
        this.nextrowindex = 0;
        this.subresid = 0;
        this.pagestep = 1;
        this.emptyrow = {};
        this.filterdatafunction;
        this.selectedRecid = appConfig.app.ko.observable("");
        this.mobiselectControlid = "";
        this.selectedAppItem = appConfig.app.ko.observable("全部"); 
        this.setSubresid = function (resid) {
            this.subresid = resid;

        }
        this.getSubresid = function () {
            return this.subresid;
        }
        // mobiscroll 状态选择
        this.stateChanged = function () {
            this.currentResidChanged(mobiscroll.$(this.mobiselectControlid).val());
        }
        //在列表窗口弹出申请状态选择窗口 
        this.selectStates = function () {

            $(this.mobiselectControlid).mobiscroll('show');
            return false;
        }


        //注册资源筛选的mobi控件ID
        this.registerStateSelectControl = function (id) {
            this.mobiselectControlid = id;
        }
        //注册自己的路由地址
        this.Basepath = "";
        this.registerBasepath = function (path) {
            this.Basepath = path;
        }
        //注册向下滚动逐行取记录
        this.registerInfinitefunction = function (that, callback) {
            appConfig.appfunction.system.maskLoading(" ");
            if (that.total() > that.rows().length) {
                that.fetchnextrow(that, function () {
                    that.nextrowindex = that.nextrowindex + 1;
                    callback();
                    appConfig.appfunction.system.maskHide(" ");
                });
            }
            else {



                appConfig.appfunction.system.maskSuccess("加载完成", callback);
            }

        }
        //-----------------------------rows,key,cmswhere,lasterror,total,currentPagescrolltop       
        this.rows = appConfig.app.ko.observableArray([]);
        this.key = appConfig.app.ko.observable("");
        this.cmswhere = appConfig.app.ko.observable("");
        this.lastError = appConfig.app.ko.observable("");
        this.total = appConfig.app.ko.observable(0);

        var that = this;
        this.monitorKeyvalue = appConfig.app.ko.computed(function () {

            var keyvalue = that.key();
            if (that.getPagesize)
            { fetchPage(that, that.filterdatafunction); }






        });
        this.monitorcmswhere = appConfig.app.ko.computed(function () {

            //console.log(that.cmswhere());
            if (that.cmswhere() != "") {
                fetchPage(that, that.filterdatafunction);
            }

            return that.cmswhere();

        });
        this.currentPagescrolltop = 0;
        //-----------------------------获取当前页面资源ID
        this.getFilterresids = function () {
            return this.myrouter.filterresids;
        };
        //-----------------------------修改当前筛选的页面资源ID
        this.currentFilterResid = appConfig.app.ko.observable("");
        this.currentResidChanged = function (resid) {
            var self = this;
            if (resid != self.getCurrentFilterResid()) {
                self.currentFilterResid(resid);
                fetchPage(self, self.filterdatafunction)
            }
        }
        this.getCurrentFilterResid = function () {
            if (this.currentFilterResid() == "") {
                return this.myrouter.resid;
            }
            else
            { return this.currentFilterResid() }


        }
        //-------------------------------------------------------------------------------------- 

        this.getcurrentPagescrolltop = function () {
            return $('.page__content').scrollTop();
        }
        this.setPagesize = function (size) {
            this.myrouter.pagesize = size;
        };
        this.getPagesize = function () {
            if (this.myrouter.pagesize == undefined) {
                return this.pageSize;
            }
            else {
                return this.myrouter.pagesize;
            }


        };
        this.maxPageIndex = function () {
            var self = this;
            return appConfig.app.ko.pureComputed(function () {

                return Math.ceil(appConfig.app.ko.utils.unwrapObservable(self.total) / self.getPagesize()) - 1;
            }, self);
        };
        this.myrouter = null;
        this.getViewresid = function () {
            var that = this;
            if (that.currentFilterResid() == 0)
            { return that.myrouter.resid; }
            else {
                return that.currentFilterResid()
            }


        }
        this.getTitle = function () {
            return this.myrouter.title;
        }
        this.getDbEmptyrow = function (dfd) {
            var that = this;
            appConfig.app.dbs.dbGetCmsColumns(that.getViewresid(), fnSuccess, fnError, fnSyserror, dfd);
            function fnSuccess(data, total, dfd) {
                var row = {}
                for (x in data)
                { eval('row.' + data[x].id + '=null'); }
                row.REC_RESID = that.getViewresid();
                dfd.resolve(row);

            }
            function fnError(errordata, dfd) {
                dfd.reject(errordata);

            }
            function fnSyserror(jqXHR, textStatus, errorThrown, dfd) {
                var errordata = { "error": -2, "message": textStatus };
                dfd.reject(errordata);
            }
        }
        //activate
        /**参数说明
         * @action "list/add/edit/browse"
         * @resid showMessage
         * @recid {string} message The message to display in the dialog.
         * @e {string} [title] The title message.
         */
        this._activate = function (action, resid, recid, editform, work, e) {


            if (e !== undefined) {
                if (e.scrolltop) { this.currentPagescrolltop = e.scrolltop; }
                if (e.selectedrecid) { this.selectedRecid(e.selectedrecid) }
            }
            if (action == undefined) {
                this.action = 'list';


            }
            else {
                this.action = action;


            }

            if (this.action == 'list') {


            }
            else {
                this.editform = editform;
                var that = this;
                var rows = that.rows();

                if (that.action == 'add') {



                    that.editform.activate(resid, recid, JSON.stringify(that.emptyrow), that.action);

                }
                else {
                    var o = $.grep(rows, function (row, i) { return row["REC_ID"] == recid })[0];
                    var json = JSON.stringify(o);
                    that.editform.activate(resid, recid, json, that.action, o, that.getSubresid());
                }


            }

            //    --------------------------------                  
            var self = this;
            var openid = "";

            // var myworkshell=appConfig.app.myworkshell;
            var myworkshell = appConfig.app.workbaseshell;
            self.myrouter = myworkshell.getCurroute(work);
            appConfig.app.curRouterHash = self.myrouter.hash;
            myworkshell.setSubtitle(self.myrouter.title);
            if (self.myrouter.pagesize < Math.floor(document.body.clientHeight * 0.015)) {
                self.myrouter.pagesize = Math.floor(document.body.clientHeight * 0.015)
            }


            if (appConfig.app.dbs == null) {

                window.location = appConfig.app.approoturl;

            }


            appConfig.app.subtitle(this.getTitle());
            appConfig.app.infinitefunction = work.infinitefunction;
            //  window.appConfig.app.infinitefunction=work.infinitefunction;

        };
        // -------_activate
        this._attached = function () {

            $('.appSelect').mobiscroll().select({
                    theme: 'ios',      // Specify theme like: theme: 'ios' or omit setting to use default
                    lang: 'zh',   // Specify language like: lang: 'pl' or omit setting to use default
                    display: 'center',  // Specify display mode like: display: 'bottom' or omit setting to use default
                    mode: 'scroller',        // More info about mode: https://docs.mobiscroll.com/3-0-0_beta2/select#!opt-mode
                    minWidth: 100                  // More info about minWidth: https://docs.mobiscroll.com/3-0-0_beta2/select#!opt-minWidth
                });

            var self = this;

            if (self.action == 'list') {

                mobiscroll.$(self.mobiselectControlid).change(function () { self.stateChanged() });
                mobiscroll.$(self.mobiselectControlid).val(self.getCurrentFilterResid()).trigger('change');

            }


        };
        //  ---------_compositionComplete
        this._compositionComplete = function (view, work) {
            //-----------------mobiscroll 初始化
            // var
            $(function () {
                //设置开始时间
                var currYear = (new Date()).getFullYear();
                var optStart = {}, optEnd = {};
                // opt.date = { preset: 'date' };
                //opt.datetime = { preset: 'datetime' };
                // opt.time = { preset: 'time' };
                optStart.default = {
                    theme: 'bootstrap', //皮肤样式
                    display: 'center', //显示方式
                    mode: 'scroller', //日期选择模式
                    dateFormat: 'yy-mm-dd',
                    timeFormat: 'HH:ii',
                    preset: 'datetime',
                    lang: 'zh',
                    // showNow: true,
                    steps: {
                        minute: 30,
                        second: 5,
                        zeroBased: true
                    },
                    nowText: "今天",
                    onSet: function (event, inst) {//开始时间确定回调
                        var a = event.valueText.toString().replace(/-/g, "/");
                        now = new Date(a);
                        optEnd.default.min = now;
                        $($(".appDate")[1]).mobiscroll($.extend(optEnd['date'], optEnd['default']));

                        var tempFormData = work.editform.formdata();
                        tempFormData['C3_533143217561'] = '';
                        tempFormData['C3_541449935726'] = '';
                        work.editform.formdata(tempFormData);
                    }
                };

                //设置结束时间



                optEnd.default = {
                    theme: 'bootstrap', //皮肤样式
                    display: 'center', //显示方式
                    mode: 'scroller', //日期选择模式
                    dateFormat: 'yy-mm-dd',
                    timeFormat: 'HH:ii',
                    preset: 'datetime',
                    lang: 'zh',
                    // showNow: true,
                    steps: {
                        minute: 1,
                        second: 5,
                        hour: 1,
                        zeroBased: false
                    },
                    nowText: "今天",
                    // min: defaultNow,
                    onSet: function (event, inst) {//结束时间确定回调
                         var tempFormData = work.editform.formdata();
                        tempFormData['C3_541449935726'] = '';
                        work.editform.formdata(tempFormData);
                    }
                };

                var defaultNow = '';
                if ('editform' in work) {
                    if (work.editform.formdata().C3_533143179815 != '') {
                        var a = work.editform.formdata().C3_533143179815.replace(/-/g, "/");
                        defaultNow = new Date(a);//开始时间
                    } else {
                        var defaultNowStr = (new Date()).format('yyyy-MM-dd hh:mm').replace(/-/g, "/");//开始时间
                        defaultNow = new Date(defaultNowStr);
                    }

                }



                optEnd.default.min = defaultNow;

                var itemTitle = work.selectedAppItem();//获取当前类型
                var hor = 1, mte = 30;
                if (itemTitle == '事假' ||
                    itemTitle == '病假' ||
                    itemTitle == '调休' ||
                    itemTitle == '公出' ||
                    itemTitle == '加班') {
                    mte = 30;
                } else if (itemTitle == '年假') {
                    hor = 4;
                } else if (itemTitle == '哺乳假') {
                } else if (itemTitle == '丧假' ||
                    itemTitle == '路程假' ||
                    itemTitle == '产前检查假') {
                    hor = 8;
                }
                // optStart.default.steps['minute'] = mte;
                optEnd.default.steps['minute'] = mte;
                optEnd.default.steps['hour'] = hor;

                $($(".appDate")[1]).mobiscroll($.extend(optEnd['date'], optEnd['default']));
                $($(".appDate")[0]).mobiscroll($.extend(optStart['date'], optStart['default']));


                $('.start-time-select').mobiscroll().select({
                    theme: 'ios',      // Specify theme like: theme: 'ios' or omit setting to use default
                    lang: 'zh',   // Specify language like: lang: 'pl' or omit setting to use default
                    display: 'center',  // Specify display mode like: display: 'bottom' or omit setting to use default
                    mode: 'scroller',        // More info about mode: https://docs.mobiscroll.com/3-0-0_beta2/select#!opt-mode
                    minWidth: 100,                  // More info about minWidth: https://docs.mobiscroll.com/3-0-0_beta2/select#!opt-minWidth
                    onSet: function (event, inst) { 
                        var tempFormData = work.editform.formdata();
                        tempFormData['C3_533143179815'] = '';
                        tempFormData['C3_533143217561'] = '';
                        tempFormData['C3_541449935726'] = '';
                        tempFormData['C3_541450276993'] = '';
                        tempFormData['C3_545771156108'] = '';
                        tempFormData['C3_545771157350'] = '';
                        tempFormData['C3_545771158420'] = '';
                        work.editform.formdata(tempFormData);
                    }
                });



            });

            if (this.action == 'list') {


                // ------------开始定位当前的记录
                if (this.currentPagescrolltop > 0) {
                    var that = this;

                    $('.page__content').animate({ 'scrollTop': this.currentPagescrolltop }, 1000, null, function () {

                    });

                }

            }

            var self = this;
            if (appConfig.app.dbs !== null) {
                if (self.rows().length == 0) { self.pageIndexChanged(self.pageIndex); }
                try {


                    //-------------------------------下拉刷新
                    var pullHook = document.getElementById('pull-hook');
                    pullHook.addEventListener('changestate', function (event) {
                        var message = '';
                        switch (event.state) {
                            case 'initial':
                                // message = '下拉刷新';
                                break;
                            case 'preaction':
                                //  message = '';
                                break;
                            case 'action':
                                //  message = '正在加载...';
                                break;
                        }
                        //pullHook.innerHTML = message;
                    });
                    pullHook.onAction = function (done) {
                        self.currentPagescrolltop = 0;
                        self.selectedRecid(0);
                        fetchPage(self, self.filterdatafunction);
                        setTimeout(done, 100);
                    };

                } catch (error) {

                }

                // --------------------------------------------------------------------懒加载

            }
            appConfig.app.subtitle(this.getTitle());

        };
        this.setModuleid = function (moduleid) {
            var self = this;
            self.__moduleId__ = 'mywork/viewmodels/' + moduleid;
        };

        this.fetchnextrow = function (self, callback) {

            fetchrows(self, self.pagestep, self.nextrowindex, function (result, data, total) {

                if (result) {
                    if (data.length > 0) {

                        data.forEach(function (datarow) {
                            var index = self.rows().findIndex(function (row, index) {
                                return row.REC_ID == datarow.REC_ID;
                            });
                            if (index == -1) {
                                self.rows.push(datarow);

                            }

                        }, this);

                        if (self.filterdatafunction) {
                            self.rows = self.filterdatafunction(self.rows);
                        }



                    }

                }
                callback();
            }
            );
        }
        this.pageSize = appConfig.app.defaultpagesize;
        this.pageIndex = 0;

        this.pageIndexChanged = function (index) {
            var self = this;
            self.pageIndex = index;
            fetchPage(self, self.filterdatafunction);
        };
        // -----------------------// -----------------------------form section 编辑或查阅窗口模式下的功能
        // _saveform
        this._saveform = function (work, system, router, callback,failCallBack) {
            var that = work;


            var promise = system.defer(function (dfd) {
                try {

                    that.editform.saveform(dfd,function(){
                        failCallBack();
                    });


                } catch (error) {
                    dfd.reject(error);

                }
            }).promise();
            promise.then(function (e) {
                if (that.action == 'add') {
                    that.rows.unshift(e.data[0]);
                    that.selectedRecid(e.data[0].REC_ID);
                    that.total(that.total() + 1);
                    if (callback) {
                        var index = 0;
                        callback(that, index, function () {
                            router.navigate(that.Basepath + "/list/resid/0/recid/0?scrolltop=" + that.currentPagescrolltop + "&selectedrecid=" + that.selectedRecid());
                        })
                    }
                    else {
                        router.navigate(that.Basepath + "/list/resid/0/recid/0?scrolltop=" + that.currentPagescrolltop + "&selectedrecid=" + that.selectedRecid());
                    }

                }
                else {
                    that.selectedRecid(that.editform.formdata().REC_ID);
                    //在这里需要用formdata()更新that.rows里面对应行的对象

                    $.each(that.rows(), function (index, row) {
                        if (row.REC_ID == that.editform.formdata().REC_ID) {
                            that.rows()[index] = that.editform.formdata();
                            if (callback) {
                                callback(that, index, function () {
                                    router.navigate(that.Basepath + "/list/resid/0/recid/0?scrolltop=" + that.currentPagescrolltop + "&selectedrecid=" + that.selectedRecid());
                                })


                            }
                            else {
                                router.navigate(that.Basepath + "/list/resid/0/recid/0?scrolltop=" + that.currentPagescrolltop + "&selectedrecid=" + that.selectedRecid());
                            }

                            return false;
                        }
                    })

                    // that.rows.sort(function (left, right) { return left.REC_EDTTIME == right.REC_EDTTIME ? 0 : (left.REC_EDTTIME < right.REC_EDTTIME ? 1 : -1) }) 
                }



            });
        };
        //返回列表
        this._back = function (router) {

            router.navigate(this.Basepath + "/list/resid/0/recid/0?scrolltop=" + this.currentPagescrolltop + "&selectedrecid=" + this.selectedRecid());

        };
        // ------------------------------list section-列表模式下的功能------------------------------------//
        //click focus
        this._focus = function (row, work, path, router) {
            work.currentPagescrolltop = work.getcurrentPagescrolltop();
            work.selectedRecid(row.REC_ID);

        }
        //编辑记录  
        this._edit = function (row, work, path, router) {
            work.currentPagescrolltop = work.getcurrentPagescrolltop();
            work.selectedRecid(row.REC_ID);
            router.navigate(path + "/edit/resid/" + work.getViewresid() + "/recid/" + row.REC_ID + "?scrolltop=" + work.currentPagescrolltop + "&selectedrecid=" + row.REC_ID);
        }
        //删除记录 
        this._del = function (row, work, path, router, editbase, dialog) {
            work.currentPagescrolltop = 0;
            work.selectedRecid(0)

            var selfwork = work;
            var myeditbase = new editbase(work.getViewresid(), row.REC_ID);
            dialog.showMessage('是否确认删除记录', '', ['确认', '取消'], false).then(function (e) {
                if (e == '确认') {
                    myeditbase.deletebyrecid().then(function (e) {

                        if (e.error == 0) {
                            dialog.showMessage('删除成功', '').then(function () {
                                selfwork.rows.remove(function (onerow) { return onerow["REC_ID"] == row.REC_ID; });
                                selfwork.total(selfwork.total() - 1);
                            });

                        }
                        else {
                            dialog.showMessage(e.message, '删除失败');
                        }
                    }, function (error) {
                        dialog.showMessage(error, '删除失败');

                    });
                }


            });



        }
        //查阅记录 
        this._browse = function (row, work, path, router) {
            work.currentPagescrolltop = work.getcurrentPagescrolltop();
            work.selectedRecid(row.REC_ID);
            router.navigate(path + "/browse/resid/" + work.getViewresid() + "/recid/" + row.REC_ID + "?scrolltop=" + work.currentPagescrolltop + "&selectedrecid=" + row.REC_ID);
        }
        //添加记录 
        this._add = function (work, path, router) {
            work.currentPagescrolltop = 0;
            work.selectedRecid(0)
            router.navigate(path + "/add/resid/" + work.getViewresid() + "/recid/0" + "?scrolltop=" + work.currentPagescrolltop + "&selectedrecid=0");
        }


    }
    return workbase;
}());
// --------------------fetchPage

fetchPage = function (self, filterdata) {
    // appConfig.appfunction.system.maskLoading(" ");
    // appConfig.appfunction.system.maskHide(" ");
    try {
        // appConfig.appfunction.system.maskLoading(" ");
        self.nextrowindex = (self.getPagesize() / self.pagestep) - 1;
        Pace.restart();
        fetchrows(self, self.getPagesize(), self.pageIndex, function (result, data, total) {
            // appConfig.appfunction.system.maskHide(" ");
            Pace.stop();
            if (result) {

                if (filterdata) {
                    data = filterdata(data);
                }

                self.rows(data);
                self.total(total);
                self.lastError("");
                if (self.data !== undefined) {
                    self.data(self);
                }


            }
            else {
                self.rows([]);
                self.total(0);
                self.lastError(data.message);
                if (self.data !== undefined) {
                    self.data(self);
                }

            }

        }

        );

    } catch (error) {
        // appConfig.appfunction.system.maskHide(" ");
    }

}
fetchrows = function (self, pageSize, pageIndex, callback) {

    var resid = self.getViewresid();


    appConfig.app.dbs.dbGetdata(resid, "", self.key(), self.cmswhere(), dataGot, fnerror, fnhttperror, pageSize, pageIndex);
    function dataGot(data, subdata, total) {


        callback(true, data, total);
    }
    function fnerror(data) {


        callback(false, data, 0);

    }
    function fnhttperror(jqXHR, textStatus, errorThrown) {


        callback(false, null, 0);

    }

};
// -----------myworkbase
var myworkbase = (function (_super) {
    __extends(myworkbase, _super);
    function myworkbase() {
        _super.apply(this, arguments);
    }
    return myworkbase;
}(workbase));
