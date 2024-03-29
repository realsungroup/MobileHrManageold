define(['durandal/system',
    'durandal/app',
    'knockout',
    'plugins/router',
    'plugins/dialog',
    'myworkshell/viewmodels/mywork1',
    'durandal/viewEngine',
    'mobiscroll'],
    function (system, app, ko, router, dialog, mywork1, viewEngine,mobiscroll) {
        var record = ko.observable({});
        var schoolModelArr = ko.observable([]), emptySchoolModelArr = [];
        var c = 0;

        var
            companyArr = ['C3_464174974466', 'C3_464174984491', 'C3_464174996449', 'C3_464175006600', 'C3_464175018059', 'C3_464184617666', 'C3_464184632072', 'C3_464184646428']// ,'C3_464184667700' ,'C3_464184684084' ],
        startTimeArr = ['C3_464174535762', 'C3_464174545465', 'C3_464174554658', 'C3_464174563152', 'C3_464174573064', 'C3_464184450091', 'C3_464184471833', 'C3_464184501566']//,'C3_464184513520' , 'C3_464184524990' ],
        endTimeArr = ['C3_464174605218', 'C3_464174895167', 'C3_464174904208', 'C3_464174917676', 'C3_464174917676', 'C3_464184549928', 'C3_464184561329', 'C3_464184573250']// , 'C3_464184588079' , 'C3_464184598956' ],
        workArr = ['C3_464175049944', 'C3_464175060992', 'C3_464175072014', 'C3_464175085490', 'C3_464175096695', 'C3_464184700316', 'C3_464184712050', 'C3_464184725595']//, 'C3_464184738647','C3_464184751863' ],
        protocolArr = ['C3_552500164369','C3_552500787858','C3_552500790010','C3_552500791980','C3_552500794041','C3_552500863431','C3_552500865557','C3_552500867680'];
        reasonArr = ['C3_464458881276', 'C3_464458911775', 'C3_464458921788', 'C3_464458930539', 'C3_464458948125', 'C3_464458958829', 'C3_464458970171', 'C3_464458979179'];


        return {
            activate: function () {
                var a = mywork1.record();
                var self = this;
                self.record(a);

            },
            record: record,
            schoolModelArr: schoolModelArr,
            attached: function () {
                //学校预加载
                var schoolModel = function (companyName, startTime, endTime, major,protocol,reason, index) {
                    this.companyName = ko.observable(companyName);
                    this.startTime = ko.observable(startTime);
                    this.endTime = ko.observable(endTime);
                    this.major = ko.observable(major);
                    this.reason = ko.observable(reason);
                    this.protocol = ko.observable(protocol);
                    this.index = index;
                }

                var tempArr = [];
                for (var i = 0; i < companyArr.length; i++) {
                    var tempM = new schoolModel(record()[companyArr[i]],
                        record()[startTimeArr[i]],
                        record()[endTimeArr[i]],
                        record()[workArr[i]],
                        record()[protocolArr[i]],
                        record()[reasonArr[i]],
                        i);

                    if (record()[companyArr[i]] != null ||
                     record()[startTimeArr[i]] != null ||
                      record()[endTimeArr[i]] != null || 
                      record()[workArr[i]] != null || 
                      record()[protocolArr[i] != null] ||
                      record()[reasonArr[i]] != null) {
                        tempArr.push(tempM);
                    } else {
                        emptySchoolModelArr.push(tempM);
                    }
                }
                schoolModelArr(tempArr);

                ko.computed(function () {
                    for (var i = 0; i < schoolModelArr().concat(emptySchoolModelArr).length; i++) {
                        var tempM = schoolModelArr().concat(emptySchoolModelArr)[i];
                        record()[companyArr[tempM.index]] = tempM.companyName();
                        record()[startTimeArr[tempM.index]] = tempM.startTime();
                        record()[endTimeArr[tempM.index]] = tempM.endTime();
                        record()[workArr[tempM.index]] = tempM.major();
                        record()[protocolArr[tempM.index]] = tempM.major();
                        record()[reasonArr[tempM.index]] = tempM.reason();
                    }

                });

                var timeC = timeControl.createTimeControl();
                   timeC.record = record();
                 timeC.initTimeControl();
                
            },
            addWorkView: function () {//添加工作栏目
                if (emptySchoolModelArr.length) {
                    var tempSchoolModelArr = schoolModelArr();
                    tempSchoolModelArr.push(emptySchoolModelArr[0]);
                    schoolModelArr(tempSchoolModelArr);

                    emptySchoolModelArr.splice(0, 1);
                    var timeC = timeControl.createTimeControl();
                timeC.record = record();
                timeC.initTimeControl();
                }
            },
            routeMyWork4: function () {
                appConfig.app.myworkshell.router.navigate("#mywork/mywork4");
            },
            cellDelete: function (index, data, event) {//删除
                if( mywork1.record().C3_471002935941 == "Y"){
                        dialog.showMessage("已提交数据不能删除");
                        return;
                  }
                var tempSchoolM = schoolModelArr()[index()];
                emptySchoolModelArr.push(tempSchoolM);
                schoolModelArr().splice(index(), 1);

                tempSchoolM.companyName('');
                    tempSchoolM.startTime('');
                    tempSchoolM.endTime('');
                    tempSchoolM.major('');
                    tempSchoolM.protocol('');
                    tempSchoolM.reason('');

            //   record()[companyArr[tempSchoolM.index]] = '';
            //     record()[startTimeArr[tempSchoolM.index]] = '';
            //     record()[endTimeArr[tempSchoolM.index]] = '';
            //     record()[workArr[tempSchoolM.index]] = '';
            //     record()[reasonArr[tempSchoolM.index]] = '';

                schoolModelArr(schoolModelArr());
            },
            routeBack: function () {
                appConfig.app.myworkshell.router.navigateBack();
            }
        };
    });