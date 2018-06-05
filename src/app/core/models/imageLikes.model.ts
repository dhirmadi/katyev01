export class ImageLikesModel {

    constructor (
    public _id: string,
    public imageId: string,
    users: [{ userId: String}]
    ) { }
}
