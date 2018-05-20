class ImageModel {
    constructor (
        public title: string,
        public link: string,
        public location: string,
        public userId: string,
        public likes: number,
        public online: boolean,
        public createDate: Date,
        public editDate: Date,
        public description?: string,
        public _id?: string
    ) { }
}

class FormImageModel {
  constructor(
        public title: string,
        public link: string,
        public location: string,
        public online: boolean,
        public createDate: string,
        public startTime: string,
        public editDate: string,
        public stopTime: string,
        public description?: string,
  ) { }
}

export { ImageModel, FormImageModel };
