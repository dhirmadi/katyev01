export class UserModel {
    constructor (
        public userId: string,
        public screenName: string,
        public avatar: string,
        public primaryRole: string,
        public location: string,
        public createDate: Date,
        public description?: string,
        public _id?: string
    ) { }
}

export const UserRoles = ['Collector', 'Model', 'Photographer', 'MakeUp Artist', 'Studio Owner'];
