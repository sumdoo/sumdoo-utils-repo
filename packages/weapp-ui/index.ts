const install = (Vue: any) => {
    // 抛出事件
    Vue.prototype.__emitEvent = (res: any, eventName: string, params: Record<string, any>) => {
        res.eventChannel.emit(eventName, params);
    };

    // 接收事件
    Vue.prototype.__onEvent = (that: any, eventName: string, callback: Function) => {
        // 接收上个页面传递来的数据
        const eventChannel = that.getOpenerEventChannel();
        if (!eventChannel) return;

        eventChannel.on(eventName, callback);
    };
}

export default {
	install
};
