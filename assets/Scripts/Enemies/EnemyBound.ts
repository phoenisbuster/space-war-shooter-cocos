const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBound extends cc.Component {

    @property(cc.Node)
    Canvas: cc.Node = null;

    @property(cc.Float)
    ScreenWidth = 0; 
    @property(cc.Float)
    ScreenHeight = 0; 

    @property(cc.Float)
    DistVertival = 75;
    @property(cc.Float)
    DistHorizontal = 75;
    @property(cc.Float)
    MinDistVertival = 51;
    @property(cc.Float)
    MinDistHorizontal = 51;

    PivotWidth = 0;
    PivotHeight = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        //cc.log("Init Boundary Pos is " + this.node.getPosition());
        this.setBoundary();
        this.setNewOffSet();
        this.setChildrenPosition();
        //cc.log("New Boundary Pos is " + this.node.getPosition());
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

       
        console.log("Screen Width is: " + this.ScreenWidth);
        console.log("Screen Height is: " + this.ScreenHeight);
        
    }

    public setNewOffSet()
    {
        this.node.setPosition(cc.v2(this.ScreenWidth/2, this.ScreenHeight/2));
        this.node.setContentSize(new cc.Size(this.ScreenWidth, this.ScreenHeight));

        this.DistHorizontal = ((75/428) * this.ScreenWidth);
        if(this.DistHorizontal < this.MinDistHorizontal)
        {
            this.DistHorizontal = this.MinDistHorizontal;
        }
        else if(this.DistHorizontal > 75)
        {
            this.DistHorizontal = 75;
        }

        this.DistVertival = ((75/926) * this.ScreenHeight);
        if(this.DistVertival < this.MinDistVertival)
        {
            this.DistVertival = this.MinDistVertival;
        }
        else if(this.DistVertival > 75)
        {
            this.DistVertival = 75;
        }

        this.PivotWidth = (-this.ScreenWidth/2) + (this.ScreenWidth - this.DistHorizontal*4)/2;
        this.PivotHeight = (this.ScreenHeight/2) - this.DistVertival;

        console.log("Enemy Bound Size is: " + this.node.getContentSize());
        console.log("DistVertival Enemy is: " + this.DistVertival);
        console.log("DistHorizontal Enemy is: " + this.DistHorizontal);
        console.log("PivotWidth Enemy is: " + this.PivotWidth);
        console.log("PivotHeight Enemy is: " + this.PivotHeight);
    }

    public setChildrenPosition()
    {
        for(let i=0; i < this.node.childrenCount; i++)
        {
            let x = this.PivotWidth + (i%5)*this.DistHorizontal;
            let y = this.PivotHeight - Math.floor(i/5)*this.DistVertival;

            this.node.children[i].setPosition(cc.v2(x,y));
        }
    }

    update(dt) 
    {
        if(this.Canvas.getContentSize().width != this.ScreenWidth
        || this.Canvas.getContentSize().height != this.ScreenHeight)
        {
            this.setBoundary();
            this.setNewOffSet();
            this.setChildrenPosition();
        }
    }
}
