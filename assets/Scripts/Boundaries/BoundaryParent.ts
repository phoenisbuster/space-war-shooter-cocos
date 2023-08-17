const {ccclass, property} = cc._decorator;

@ccclass
export default class BoundaryParent extends cc.Component {

    @property(cc.Node)
    Canvas: cc.Node = null;

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

    @property(cc.Float)
    OffSet = 0;
    @property(cc.Float)
    PivotWidth = 50;
    @property(cc.Float)
    PivotHeight = 50;


    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        cc.log("Init Boundary Pos is " + this.node.getPosition());
        this.setBoundary();
        this.setNewPosition();
        this.setChildrenPosition();
        cc.log("New Boundary Pos is " + this.node.getPosition());
    }

    start () 
    {
        
    }

    setBoundary()
    {
        if(this.Canvas == null)
        {
            this.Canvas = cc.find("InGameMenu");
        }
        this.ScreenWidth = this.Canvas.getContentSize().width;
        this.ScreenHeight = this.Canvas.getContentSize().height;

        this.leftBound = -50;//this.node.getContentSize().width/2;
        this.rightBound = this.ScreenWidth + 50;//this.node.getContentSize().width/2;
        this.lowBound = -50; //-this.node.getContentSize().height/2;
        this.upBound = this.ScreenHeight + 50;//this.node.getContentSize().height;

        this.PivotWidth = ((this.ScreenWidth + Math.abs(this.OffSet)*2) * (6/5)) - this.ScreenWidth;
        this.PivotHeight = ((this.ScreenHeight + Math.abs(this.OffSet)*2) * (10/9)) - this.ScreenHeight;

        console.log("Screen Width is: " + this.ScreenWidth);
        console.log("Screen Height is: " + this.ScreenHeight);
        console.log("LeftB is: " + this.leftBound);
        console.log("RightB is: " + this.rightBound);
        console.log("LowB is: " + this.lowBound);
        console.log("UpB is: " + this.upBound);
        console.log("Pivot Width is: " + this.PivotWidth);
        console.log("Pivot Height is: " + this.PivotHeight);
    }

    public setNewPosition()
    {
        this.node.setPosition(cc.v2(this.ScreenWidth/2, this.ScreenHeight/2));
        this.node.setContentSize(new cc.Size(this.ScreenWidth, this.ScreenHeight));
        console.log("Boundary Size is: " + this.node.getContentSize());
    }

    public setChildrenPosition()
    {
        for(let i = 0; i < this.node.childrenCount; i++)
        {
            switch(i)
            {
                case 0: 
                    //Left
                    this.node.children[0].setPosition(cc.v2(
                            -this.ScreenWidth/2 - this.node.children[0].getContentSize().width/2, 
                            0)
                    );

                    ////////////////////////// Left Children ///////////////////////
                    let lengthLeft = this.node.children[0].childrenCount
                    for(let j = 0; j < lengthLeft; j++)
                    {
                        this.node.children[0].children[j].setPosition(cc.v2(
                            this.OffSet,
                            this.ScreenHeight/2 - this.OffSet - j*((this.ScreenHeight+this.PivotHeight)/lengthLeft))
                        );
                    }

                    break;
                case 1: 
                    //Right
                    this.node.children[1].setPosition(cc.v2(
                            this.ScreenWidth/2 + this.node.children[1].getContentSize().width/2, 
                            0)
                    );

                    ///////////////////////// Right Children ////////////////////////
                    let lengthRight = this.node.children[1].childrenCount
                    for(let j = 0; j < lengthRight; j++)
                    {
                        this.node.children[1].children[j].setPosition(cc.v2(
                            -this.OffSet,
                            this.ScreenHeight/2 - this.OffSet - j*((this.ScreenHeight+this.PivotHeight)/lengthRight))
                        );
                    }

                    break;
                case 2: 
                    //Low
                    this.node.children[2].setPosition(cc.v2(
                            0, 
                            -this.ScreenHeight/2 - this.node.children[2].getContentSize().height/2)
                    );

                    ////////////////////////// Low Children ///////////////////////////
                    let lengthLow = this.node.children[2].childrenCount
                    for(let j = 0; j < lengthLow; j++)
                    {
                        this.node.children[2].children[j].setPosition(cc.v2(
                            -this.ScreenWidth/2 + this.OffSet + j*((this.ScreenWidth+this.PivotWidth)/lengthLow),
                            this.OffSet)
                        );
                    }

                    break;
                case 3: 
                    //Up
                    this.node.children[3].setPosition(cc.v2(
                            0, 
                            this.ScreenHeight/2 + this.node.children[3].getContentSize().height/2)
                    );

                    ////////////////////////// Up Children ////////////////////////
                    let lengthUp = this.node.children[3].childrenCount
                    for(let j = 0; j < lengthUp; j++)
                    {
                        this.node.children[3].children[j].setPosition(cc.v2(
                            -this.ScreenWidth/2 + this.OffSet + j*((this.ScreenWidth+this.PivotWidth)/lengthUp),
                            -this.OffSet)
                        );
                    }

                    break;
            }
        }
    }

    update(dt) 
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth
        || this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.setBoundary();
            this.setNewPosition();
            this.setChildrenPosition();
        }
    }
}
