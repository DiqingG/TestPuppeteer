class MetaData {
    success: boolean;
    errored: boolean;
    startTime: Date;
    endTime: Date;
    totalRuntime: number;
    other?: any;
    constructor() {
        this.startTime = new Date();
    }

    calculateRuntime() {
        this.totalRuntime = this.endTime.getTime() - this.startTime.getTime();
    }
}

export default MetaData;
