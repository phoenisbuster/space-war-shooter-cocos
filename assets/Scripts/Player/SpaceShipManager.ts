import PlayerStats from "./PlayerStats";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpaceShipManager extends cc.Component {

    @property([cc.Prefab])
    SpaceShipType: cc.Prefab[] = [];

    @property(cc.Node)
    CurSpaceShipType: cc.Node = null;

    @property(cc.Integer)
    index = -1;

    curSprite: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        this.SetSpaceShip(PlayerStats.ID? PlayerStats.ID : 0);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);    
    }

    onDestroy() 
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);
    }

    public OnKeyPress(event: cc.Event.EventKeyboard)
    {
        if(event.keyCode == cc.macro.KEY.space)
        {
            this.SetSpaceShipDebug();
        }
    }

    public SetSpaceShip(i: number)
    {
        if(i != this.index)
        {
            if(this.node.childrenCount > 0)
            {
                this.node.destroyAllChildren();
            }
            
            this.index = i;
            this.CurSpaceShipType = cc.instantiate(this.SpaceShipType[i]);
            this.CurSpaceShipType.parent = this.node;
            this.CurSpaceShipType.setPosition(cc.Vec2.ZERO);
            this.CurSpaceShipType.angle = this.node.angle;

            this.curSprite = this.SpaceShipType[i].data.getComponent(cc.Sprite).spriteFrame;
            //cc.warn("TEST 2 " + this.curSprite.name);

            this.node.getComponent(PlayerStats).isLv10 = false;
            this.node.getComponent(PlayerStats).CurLv10Time = 0;
            this.node.getComponent(PlayerStats).SetLevel(11, this.CurSpaceShipType);
        }
        else
        {
            this.node.getComponent(PlayerStats).SetLevel();
        }
        //cc.warn("New Index is: " + this.index);
        //transform.GetChild(0).localPosition = Vector3.zero;
        //transform.GetChild(0).localEulerAngles = Vector3.zero;
    }

    public SetSpaceShipDebug()
    {
        //cc.warn("Length Space Ship: " + this.SpaceShipType.length);
        //cc.warn("Index is: " + this.index);
        let i = this.index;
        i = i < this.SpaceShipType.length-1? ++i : 0;
        //cc.warn("New i is: " + i);
        this.SetSpaceShip(i); 
    }

    // update(dt) 
    // {

    // }
}
