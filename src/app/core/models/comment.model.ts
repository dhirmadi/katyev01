export class CommentModel {

    constructor (
    public userId: string,
    public imageId: string,
    public comment?: string,
    public _id?: string
    ) { }

}
