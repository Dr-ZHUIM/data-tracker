import { DefaultOptions, TrackerConfig, Options } from "../types/index";
import { createHistoryEvent } from "../utils/utils";

const domList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];

export default class Tracker {

    public data: Options

    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker()
    }

    //初始化值
    private initDef(): DefaultOptions {
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptions>{
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        }
    }

    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid
    }

    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra
    }

    //手动发送跟踪
    public sendTracker<T>(data: T) {
        this.reportTracker(data)
    }

    private captureEvent<T>(mouseEventList: string[], targetKey: string, data?: T) {
        mouseEventList.map(e => {
            window.addEventListener(e, () => {
                console.log("listeninng");
                this.reportTracker({
                    e,
                    targetKey,
                    data
                })
            })
        })
    }

    private targetKeyReport() {
        domList.forEach(ev => {
            window.addEventListener(ev, (e) => {
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');
                if (targetKey) {
                    this.reportTracker({
                        e: ev,
                        targetKey
                    })
                }
            })
        })
    }

    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvent(['pushState', 'replaceState', 'popstate'], 'history-pv');
        };
        if (this.data.hashTracker) {
            this.captureEvent(['hashchange'], 'hash-pv');
        };
        if (this.data.domTracker) {
            this.targetKeyReport();
        };
        if (this.data.jsError) {
            this.jsError();
        };
    }

    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }

    private jsError() {
        this.errorEvent();
        this.promiseReject();
    }

    private errorEvent() {
        window.addEventListener('error', (e) => {
            this.reportTracker({
                e: "error",
                targetKey: "message",
                message: e.message
            });
        });
    }

    private promiseReject() {
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