const {ccclass, property} = cc._decorator;

const timeScale = 1;

@ccclass
export default class GlobalTime extends cc.Component {

    @property(cc.Float)
    TimeScale: number = 1;

    static TimeScale: number = 1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        //cc.warn("TimeScale is " + GlobalTime.test);
        GlobalTime.TimeScale = this.TimeScale;
        //cc.warn("TimeScale is " + GlobalTime.TimeScale);
    }

    // update (dt) {}
}
