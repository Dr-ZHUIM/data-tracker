(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tracker = factory());
})(this, (function () { 'use strict';

    var TrackerConfig;
    (function (TrackerConfig) {
        TrackerConfig["version"] = "1.0.0";
    })(TrackerConfig || (TrackerConfig = {}));

    //制作 pv功能 page-view
    const createHistoryEvent = (type) => {
        const origin = history[type];
        return function () {
            const res = origin.apply(this, arguments);
            const e = new Event(type);
            window.dispatchEvent(e);
            return res;
        };
    };

    const domList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
    class Tracker {
        constructor(options) {
            this.data = Object.assign(this.initDef(), options);
            this.installTracker();
        }
        //初始化值
        initDef() {
            window.history['pushState'] = createHistoryEvent('pushState');
            window.history['replaceState'] = createHistoryEvent('replaceState');
            return {
                sdkVersion: TrackerConfig.version,
                historyTracker: false,
                hashTracker: false,
                domTracker: false,
                jsError: false
            };
        }
        setUserId(uuid) {
            this.data.uuid = uuid;
        }
        setExtra(extra) {
            this.data.extra = extra;
        }
        //手动发送跟踪
        sendTracker(data) {
            this.reportTracker(data);
        }
        captureEvent(mouseEventList, targetKey, data) {
            mouseEventList.map(e => {
                window.addEventListener(e, () => {
                    console.log("listeninng");
                    this.reportTracker({
                        e,
                        targetKey,
                        data
                    });
                });
            });
        }
        targetKeyReport() {
            domList.forEach(ev => {
                window.addEventListener(ev, (e) => {
                    const target = e.target;
                    const targetKey = target.getAttribute('target-key');
                    if (targetKey) {
                        this.reportTracker({
                            e: ev,
                            targetKey
                        });
                    }
                });
            });
        }
        installTracker() {
            if (this.data.historyTracker) {
                this.captureEvent(['pushState', 'replaceState', 'popstate'], 'history-pv');
            }
            if (this.data.hashTracker) {
                this.captureEvent(['hashchange'], 'hash-pv');
            }
            if (this.data.domTracker) {
                this.targetKeyReport();
            }
            if (this.data.jsError) {
                this.jsError();
            }
        }
        reportTracker(data) {
            const params = Object.assign(this.data, data, { time: new Date().getTime() });
            let headers = {
                type: 'application/x-www-form-urlencoded'
            };
            let blob = new Blob([JSON.stringify(params)], headers);
            navigator.sendBeacon(this.data.requestUrl, blob);
        }
        jsError() {
            this.errorEvent();
            this.promiseReject();
        }
        errorEvent() {
            window.addEventListener('error', (e) => {
                this.reportTracker({
                    e: "error",
                    targetKey: "message",
                    message: e.message
                });
            });
        }
        promiseReject() {
            window.addEventListener('unhandledrejection', (e) => {
                e.promise.catch(err => {
                    this.reportTracker({
                        e: "promise",
                        targetKey: "message",
                        message: err
                    });
                });
            });
        }
    }

    return Tracker;

}));
