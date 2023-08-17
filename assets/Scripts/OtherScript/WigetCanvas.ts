const {ccclass, property} = cc._decorator;

@ccclass
export default class WigetCanvas extends cc.Component {

    @property(cc.Node)
    Canvas: cc.Node = null;

    ScreenWidth: number = 0
    ScreenHeight: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        if(!this.Canvas)
        {
            this.Canvas = cc.find("InGameMenu");
        }
        this.SetSizeAndPos();
    }

    public SetSizeAndPos()
    {
        this.ScreenWidth = this.Canvas.getContentSize().width;
        this.ScreenHeight = this.Canvas.getContentSize().height;
        this.node.setContentSize(this.ScreenWidth, this.ScreenHeight)
        this.node.setPosition(cc.v2(this.Canvas.getPosition()))
    }

    update (dt) 
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth ||
            this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.SetSizeAndPos();
        }
    }
}
