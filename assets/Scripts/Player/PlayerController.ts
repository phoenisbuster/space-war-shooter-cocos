import GlobalTime from "../OtherScript/GlobalDTime";
import ShootingManager from "../SpaceShip/ShootingManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControler extends cc.Component {

    @property(cc.Node)
    TouchInput: cc.Node = null;

    @property(cc.Node)
    Canvas: cc.Node = null;

    @property(cc.Boolean)
    SetTouch: boolean = false;

    @property(cc.Float)
    speed = 1.0;

    @property(cc.Float)
    leftBound = 0; //min X
    @property(cc.Float)
    rightBound = 0; //max X
    @property(cc.Float)
    lowBound = 0; //min Y
    @property(cc.Float)
    upBound = 0; //max Y

    @property(cc.Float)
    ScreenWidth = 0; 
    @property(cc.Float)
    ScreenHeight = 0; 

    isTouch: boolean = false;
    Direction: cc.Vec2 = cc.Vec2.ZERO;
    deltaTime = 0.02;

    public fisrtTouch = false;
    public allowMove = true;
    public allowShot = false;

    onLoad()
    {
        this.TouchInput.on(cc.Node.EventType.MOUSE_DOWN, this.InputProcessing_Mouse, this);
        this.TouchInput.on(cc.Node.EventType.MOUSE_MOVE, this.InputProcessing_Mouse, this);
        this.TouchInput.on(cc.Node.EventType.MOUSE_LEAVE, this.ResetDirect, this);

        this.TouchInput.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.TouchInput.on(cc.Node.EventType.TOUCH_MOVE, this.InputProcessing_Touch, this);
        this.TouchInput.on(cc.Node.EventType.TOUCH_END, this.ResetDirect, this);

        this.isTouch = this.SetTouch;    
    }

    onDestroy()
    {
        this.TouchInput.off(cc.Node.EventType.MOUSE_DOWN, this.InputProcessing_Mouse, this);
        this.TouchInput.off(cc.Node.EventType.MOUSE_MOVE, this.InputProcessing_Mouse, this);
        this.TouchInput.off(cc.Node.EventType.MOUSE_LEAVE, this.ResetDirect, this);

        this.TouchInput.off(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.TouchInput.off(cc.Node.EventType.TOUCH_MOVE, this.InputProcessing_Touch, this);
        this.TouchInput.off(cc.Node.EventType.TOUCH_END, this.ResetDirect, this);
    }
    
    start () 
    {
        //cc.director.getScheduler().setTimeScale(0.05);
        this.setBoundary();
    }

    public LockInputProcessing(x, y, isfinish: boolean = false)
    {
        this.TouchInput.off(cc.Node.EventType.MOUSE_DOWN, this.InputProcessing_Mouse, this);
        this.TouchInput.off(cc.Node.EventType.MOUSE_MOVE, this.InputProcessing_Mouse, this);
        this.TouchInput.off(cc.Node.EventType.MOUSE_LEAVE, this.ResetDirect, this);

        this.TouchInput.off(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.TouchInput.off(cc.Node.EventType.TOUCH_MOVE, this.InputProcessing_Touch, this);
        this.TouchInput.off(cc.Node.EventType.TOUCH_END, this.ResetDirect, this);

        cc.tween(this.node).to(1,{
            position: cc.v3(x,y,0)
        }).start();

        this.Direction = cc.Vec2.ZERO;
        this.node.children[0].getComponent(ShootingManager).SetShootingSound(0, false);
        if(isfinish)
        {
            this.node.emit("MatchEnd", false);
            this.fisrtTouch = false;
        }
        else
        {
            this.fisrtTouch = true;
        }    
        this.allowShot = false;
        this.allowMove = false;
    }

    public UnlockInputProcessing()
    {
        //cc.warn("YES");
        this.TouchInput.on(cc.Node.EventType.MOUSE_DOWN, this.InputProcessing_Mouse, this);
        this.TouchInput.on(cc.Node.EventType.MOUSE_MOVE, this.InputProcessing_Mouse, this);
        this.TouchInput.on(cc.Node.EventType.MOUSE_LEAVE, this.ResetDirect, this);

        this.TouchInput.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.TouchInput.on(cc.Node.EventType.TOUCH_MOVE, this.InputProcessing_Touch, this);
        this.TouchInput.on(cc.Node.EventType.TOUCH_END, this.ResetDirect, this);

        this.Direction = cc.Vec2.ZERO;
        this.fisrtTouch = true;
        this.allowMove = true;
        this.allowShot = true;
    }

    setBoundary()
    {
        if(this.Canvas == null)
        {
            this.Canvas = cc.find("InGameMenu");
        }
        this.ScreenWidth = this.Canvas.getContentSize().width;
        this.ScreenHeight = this.Canvas.getContentSize().height;
        this.leftBound = this.node.getContentSize().width/2;
        this.rightBound = this.ScreenWidth - this.node.getContentSize().width/2;
        this.lowBound = 2 * this.node.getContentSize().height;
        this.upBound = this.ScreenHeight - 2 * this.node.getContentSize().height;

        // console.log("Screen Width is: " + this.ScreenWidth);
        // console.log("Screen Height is: " + this.ScreenHeight);
        // console.log("LeftB is: " + this.leftBound);
        // console.log("RightB is: " + this.rightBound);
        // console.log("LowB is: " + this.lowBound);
        // console.log("UpB is: " + this.upBound);
    }

    public InputProcessing_Mouse(event: cc.Event.EventMouse)
    {
        if(!this.isTouch)
        {
            this.Direction = event.getDelta();
            this.Direction.normalizeSelf();
            //console.log("Direction: " + event.getDelta());
            //this.Direction.multiplyScalar(this.speed * cc.director.getDeltaTime());
            
            // this.CheckDirection();

            // let Pos = new cc.Vec2();
            // this.node.getPosition().add(this.Direction, Pos);
            // this.node.setPosition(Pos);
            if(event.getButton() == 0)
            {
                if(!this.fisrtTouch)
                {
                    this.fisrtTouch = true;
                    this.node.emit("BeginMatch", true);
                }
                GlobalTime.TimeScale = 1;
            }   
        }    
    }

    public InputProcessing_Touch(event: cc.Event.EventTouch)
    {
        if(this.isTouch && this.allowMove)
        {
            //cc.warn("CHECK DELTA POS " + event.getTouches().length);
            if(event.getTouches().length == 1)
            {
                this.Direction = event.getDelta();

                this.Direction.multiplyScalar(this.speed * cc.director.getDeltaTime() * GlobalTime.TimeScale);
                
                this.CheckDirection();

                let Pos = new cc.Vec2();
                this.node.getPosition().add(this.Direction, Pos);
                this.node.setPosition(Pos);
                this.CheckPosition();

                GlobalTime.TimeScale = 1;

                if(!this.fisrtTouch)
                {
                    this.fisrtTouch = true;
                    this.allowMove = true;
                    this.allowShot = true;
                    this.node.emit("BeginMatch", true);
                }
            }
        }    
    }

    public CheckDirection()
    {
        if(this.node.position.x < this.leftBound && this.Direction.x < 0)
        {
            this.Direction.x = 0;
        } 
        if(this.node.position.x > this.rightBound && this.Direction.x > 0)
        {
            this.Direction.x = 0;
        }
        if(this.node.position.y < this.lowBound && this.Direction.y < 0)
        {
            this.Direction.y = 0;
        }
        if(this.node.position.y > this.upBound && this.Direction.y > 0)
        {
            this.Direction.y = 0;
        }
    }

    public CheckPosition()
    {
        if(this.node.position.x < this.leftBound)
        {
            this.node.setPosition(this.leftBound, this.node.getPosition().y);
            //this.node.position.x = this.leftBound;
            //cc.error("Call1");
            this.node.emit("TurnLeft");
        } 
        if(this.node.position.x > this.rightBound)
        {
            this.node.setPosition(this.rightBound, this.node.getPosition().y);
            //cc.error("Call2");
            this.node.emit("TurnRight");
        }

        if(this.node.position.y < this.lowBound)
        {
            //this.node.position.y = this.lowBound;
            this.node.setPosition(this.node.getPosition().x, this.lowBound);
            //cc.error("Call3");
        }
        if(this.node.position.y > this.upBound)
        {
            this.node.setPosition(this.node.getPosition().x, this.upBound);
            //cc.error("Call4");
        }
    }

    public TouchStart()
    {
        GlobalTime.TimeScale = 1;
        //cc.warn("Golbal timescale " + GlobalTime.TimeScale);
    }

    public ResetDirect()
    {
        this.Direction = cc.Vec2.ZERO;
        this.schedule(()=>
        {
            GlobalTime.TimeScale -= 0.1;
            if(GlobalTime.TimeScale <= 0.05)
            {
                GlobalTime.TimeScale = 0.05;
            }   
            //cc.warn("Golbal timescale " + GlobalTime.TimeScale); 
        }, 0.25, 10, 0.5);    
        //cc.warn("Golbal timescale " + GlobalTime.TimeScale);
    }

    public SetTimeScale()
    {
        
       
    }

    update(dt: number)
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth
        || this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.setBoundary();
        }

        // if(this.check <= 0)
        // {
        //     this.schedule(this.SetTimeScale, 0, 1, 0.5);
        //     //this.check = 0.5;
        // }
        // else
        // {
        //     this.unschedule(this.SetTimeScale);
        //     this.check -= dt;
        // }

        // if(this.Direction.x != 0 && this.Direction.y !=0)
        // {
        //     this.Direction.multiplyScalar(this.speed * dt);
                
        //     this.CheckDirection();

        //     let Pos = new cc.Vec2();
        //     this.node.getPosition().add(this.Direction, Pos);
        //     this.node.setPosition(Pos);
        // }
        // else
        // {
        //     this.node.setPosition(this.node.getPosition());
        // }
        
        //this.CheckPosition();
        this.deltaTime = dt;
    }
}
