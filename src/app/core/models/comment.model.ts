export class CommentModel {

    constructor (
    public userId: string,
    public imageId: string,
    public comment?: string,
    public _id?: string
    ) { }

//    constructor (
//    public userId: string,
//    public imageId: string,
//    public attending: boolean,
//    public likes?: number,
//    public comments?: string,
//    public _id?: string
//    ) { }
}
