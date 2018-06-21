export class Group{
    Name: string;
}

export class GroupCheck {
    Name: string;
    Checked: boolean;

    /**
     *
     */
    constructor(id: string,checked) {
        this.Name = id;
        this.Checked = checked;
    }
}