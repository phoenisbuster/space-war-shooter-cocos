import { PlayerController } from "../Learning/Main/PlayerContrller";
import GlobalTime from "../OtherScript/GlobalDTime";
import PlayerControler from "../Player/PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveBG extends cc.Component {

    //adding background sprites
    background: cc.SpriteFrame = null;
    Player: cc.Node = null;
    Canvas: cc.Node = null

    screenWidth: number = 0;
    screenHeight: number = 0;
    imgWidth: number = 720;
    imgHeight: number = 2310;

    switchPos: number = 0;
    newPos: number = 0;

    boundLeft: number  = 0;
    boundRight: number = 0;

    allowMove = true;
    @property(cc.Float)
    speed: number = -10;

    @property(cc.Float)
    TurnSpeed: number = -10;
    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        if(this.Canvas == null)
        {
            this.Canvas = cc.find("InGameMenu");
        }
        if(this.Player == null)
        {
            this.Player = cc.find("Player");
        }
        this.setBoundary();
    }

    setBoundary()
    {    
        this.screenWidth = this.Canvas.getContentSize().width;
        this.screenHeight = this.Canvas.getContentSize().height;

        this.switchPos = -this.imgHeight/2 - this.screenHeight/2;
        this.newPos = this.imgHeight + (this.imgHeight/2 - this.screenHeight/2) - 50;

        this.boundLeft = this.imgWidth/2;
        this.boundRight = this.screenWidth - this.imgWidth/2;

        // cc.warn("IMG Width " + this.imgWidth);
        // cc.warn("IMG Height " + this.imgHeight);
        // cc.warn("screen Width " + this.screenWidth);
        // cc.warn("screen Height " + this.screenHeight);
        // cc.warn("swich POS " + this.switchPos);
        // cc.warn("new POS " + this.newPos);
        //cc.warn("left Bound " + this.boundLeft);
        //cc.warn("right Bound " + this.boundRight);
    }

    setBG(spriteVal: cc.SpriteFrame)
    {
        this.background = spriteVal;
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.background;
        this.node.children[1].getComponent(cc.Sprite).spriteFrame = this.background;
        this.imgWidth = this.node.children[1].getContentSize().width;
        this.imgHeight = this.node.children[1].getContentSize().height;
    }

    start () 
    {
        if(this.Player != null)
        {
            //this.allowMove = this.Player.getComponent(PlayerControler).fisrtTouch;
        }
    }

    protected onEnable(): void 
    {
        this.Player?.on("BeginMatch", this.SetMove, this);
        this.Player?.on("TurnLeft", this.TurnLeft, this);
        this.Player?.on("TurnRight", this.TurnRight, this);
        //this.Player.on("MatchEnd", this.SetMove, this);
    }

    protected onDestroy(): void {
        this.Player?.off("BeginMatch", this.SetMove, this);
        this.Player?.off("TurnLeft", this.TurnLeft, this);
        this.Player?.off("TurnRight", this.TurnRight, this);
        //this.Player.off("MatchEnd", this.SetMove, this);
    }

    SetMove(value: boolean)
    {
        this.allowMove = value;
    }

    MovingForward(dt)
    {
        let Direction = cc.v2(0,1);
        if(this.allowMove)
        {
            let Pos1 = this.node.children[0].getPosition().y;
            let Pos2 = this.node.children[1].getPosition().y;
            Pos1 += this.speed * dt * GlobalTime.TimeScale;
            Pos2 += this.speed * dt * GlobalTime.TimeScale;

            if(Pos1 <= this.switchPos)
            {
                Pos1 = this.newPos;
            }
            if(Pos2 <= this.switchPos)
            {
                Pos2 = this.newPos;
            }

            this.node.children[0].setPosition(this.node.children[0].getPosition().x, Pos1);
            this.node.children[1].setPosition(this.node.children[1].getPosition().x, Pos2);    
        }
    }

    TurnLeft()
    {
        if(this.allowMove)
        {
            let Pos = this.node.getPosition().x;
            Pos += this.TurnSpeed * cc.director.getDeltaTime() * GlobalTime.TimeScale;
            if(Pos >= this.boundLeft)
            {
                Pos = this.boundLeft;
            }
            this.node.setPosition(Pos, this.node.getPosition().y);
        }
    }

    TurnRight()
    {
        if(this.allowMove)
        {
            let Pos = this.node.getPosition().x;
            Pos -= this.TurnSpeed * cc.director.getDeltaTime() * GlobalTime.TimeScale;
            if(Pos <= this.boundRight)
            {
                Pos = this.boundRight;
            }
            this.node.setPosition(Pos, this.node.getPosition().y);
        }
    }

    update (dt)
    {
        if(this.Canvas.getContentSize().width != this.screenWidth
        || this.Canvas.getContentSize().height != this.screenHeight)
        {
            this.setBoundary();
        }

        this.MovingForward(dt)
    }
}
