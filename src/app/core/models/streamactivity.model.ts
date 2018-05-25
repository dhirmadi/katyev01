export class StreamResponseModel {
    constructor(
        public results: StreamActivityModel[],
        public next: string,
        public duration: string) {}
}


export class StreamActivityModel {
    constructor(
        public id: string,
        public actor: string,
        public verb: string,
        public object: string,
        public target?: string,
        public time?: string,
        public to?: string[],
        public foreign_id?: string) {}
}


