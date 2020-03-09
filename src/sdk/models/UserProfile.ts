export class UserProfile {
    public id: string;

    public type: string;

    public description: string;

    public name: string;

    public title: string;

    public content: any;

    public updateAt: Date;

    constructor(profile: UserProfile) {
        this.id = profile.id;
        this.type = profile.type;
        this.description = profile.description;
        this.name = profile.name;
        this.title = profile.title;
        this.content = profile.content;
        this.updateAt = profile.updateAt;
    }
}
