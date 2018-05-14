class ImageModel {
    constructor (
        public title: string,
        public link: string,
        public location: string,
        public userId: string,
        public likes: number,
        public nsfw: boolean,
        public startDate: Date,
        public stopDate: Date,
        public description?: string,
        public _id?: string
    ) { }
}

class FormImageModel {
  constructor(
        public title: string,
        public link: string,
        public location: string,
        public nsfw: boolean,
        public startDate: string,
        public startTime: string,
        public stopDate: string,
        public stopTime: string,
        public description?: string,
  ) { }
}

export { ImageModel, FormImageModel };
