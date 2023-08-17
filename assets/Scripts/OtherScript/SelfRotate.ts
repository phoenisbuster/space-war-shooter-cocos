const {ccclass, property} = cc._decorator;

@ccclass
export default class SelfRotate extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        // var actionBy = cc.rotateBy(1, 360).repeatForever();
        // this.node.runAction(actionBy);
        cc.tween(this.node).by(0.5, {angle: 360}).repeatForever().start();
    }

    update (dt) 
    {
        //this.node.angle -= dt * 6;
    }
}
