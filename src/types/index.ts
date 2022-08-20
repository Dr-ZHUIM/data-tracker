export interface DefaultOptions {
    uuid : string | undefined,
    requestUrl : string | undefined,
    //设置history或者hash模式
    historyTracker : boolean,
    hashTracker : boolean,
    //设置是否监听dom交互
    domTracker : boolean,
    sdkVersion : string | number,
    extra : Record<string, any> | undefined,
    jsError : boolean
}

export interface Options extends Partial<DefaultOptions>{
    requestUrl : string,
}

export enum TrackerConfig{
    version = '1.0.0'
}