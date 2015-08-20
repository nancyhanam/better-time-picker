(function () {
    var module = angular.module('betterTimePicker', []);

    module.directive('betterTimePicker', function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'better-time-picker.html',
            scope: {
                date: "=",
                hideAfterSelection: "="
            },
            bindToController: true,
            controllerAs: 'betterTimePicker',

            controller: function ($scope) {
                var betterTimePicker = this;
                betterTimePicker.initializeTime = function () {
                    betterTimePicker.PageState = {};
                    betterTimePicker.PageState.times = [];
                    var currentDate = this.date;
                    if (!currentDate) {
                        currentDate = new Date();
                    } else if (typeof date == "string") {
                        currentDate = new Date(date);
                    }
                    betterTimePicker.UserSelection = {
                        selectedDate: currentDate
                    };

                    betterTimePicker.selectHourPicker();
                };

                betterTimePicker.bindDate = function () {
                    betterTimePicker.date =
                        betterTimePicker.UserSelection.selectedDate;
                };

                betterTimePicker.clearTimeCircle = function () {
                    betterTimePicker.PageState.times = [];
                    betterTimePicker.PageState.hourPickerEnabled = false;
                    betterTimePicker.PageState.minutePickerEnabled = false;
                };

                betterTimePicker.selectHourPicker = function () {
                    betterTimePicker.clearTimeCircle();
                    betterTimePicker.PageState.hourPickerEnabled = true;
                    var items = 12;
                    for (var i = 1; i <= items; i++) {
                        var x = 60 + 104 *
                            Math.cos(2 * Math.PI * i / items - (Math.PI / 2));
                        var y = 60 + 104 *
                            Math.sin(2 * Math.PI * i / items - (Math.PI / 2));
                        betterTimePicker.PageState.times.push({
                            x: x,
                            y: y,
                            value: i
                        });
                    }
                };

                betterTimePicker.selectMinutePicker = function () {
                    betterTimePicker.clearTimeCircle();
                    betterTimePicker.PageState.minutePickerEnabled = true;
                    var items = 12;
                    for (var i = 0; i < items; i++) {
                        var x = 60 + 104 * Math.cos(2 * Math.PI * i / items -
                                (Math.PI / 2)),
                            y = 60 + 104 * Math.sin(2 * Math.PI * i / items -
                                (Math.PI / 2)),
                            value = i * 5;
                        betterTimePicker.PageState.times.push({
                            x: x,
                            y: y,
                            value: value
                        });
                    }
                };

                betterTimePicker.toggleAmPm = function () {
                    var hour = betterTimePicker.UserSelection.selectedDate.getHours() +
                        12;
                    if (hour > 23) {
                        hour = hour - 24;
                    }
                    betterTimePicker.UserSelection.selectedDate.setHours(hour);
                };

                betterTimePicker.setSelectedHour = function (hour) {
                    var acc = 0,
                        currentHour = betterTimePicker.UserSelection.selectedDate.getHours();
                    if (currentHour >= 12) {
                        acc = 12;
                    }
                    if (hour + acc > 24) {
                        hour -= 24;
                    }
                    betterTimePicker.UserSelection.selectedDate.setHours(hour + acc);
                };

                betterTimePicker.setSelectedMinute = function (minute) {
                    betterTimePicker.UserSelection.selectedDate.setMinutes(minute);
                };


                betterTimePicker.checkSelected = function (timeValue) {
                    if (betterTimePicker.PageState.hourPickerEnabled){
                        var hour = betterTimePicker.UserSelection.selectedDate.getHours();
                        if(hour > 12) {
                            hour -= 12;
                        }
                        return hour === timeValue;
                    }

                    if (betterTimePicker.PageState.minutePickerEnabled) {
                        return betterTimePicker.UserSelection.selectedDate.getMinutes() ===
                            timeValue;
                    }
                };

                betterTimePicker.setSelectedTime = function (time) {
                    betterTimePicker.hideAfterSelection &&
                    betterTimePicker.clearTimeCircle();
                    if (betterTimePicker.PageState.hourPickerEnabled) {
                        betterTimePicker.setSelectedHour(time);
                        // Switch to select minutes.
                        betterTimePicker.selectMinutePicker();
                    } else if (betterTimePicker.PageState.minutePickerEnabled) {
                        betterTimePicker.setSelectedMinute(time);
                    }
                };
            },
            link: function (scope, element, attrs, betterTimePicker) {
                betterTimePicker.initializeTime();
                if (attrs.date) {
                    betterTimePicker.bindDate();
                }
            }
        }
    })
}());
