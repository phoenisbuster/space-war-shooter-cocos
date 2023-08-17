import BuffManager from "../BuffSystem/BuffManager";
import { HealthManager } from "../Player/HealthManager";
import PlayerStats from "../Player/PlayerStats";
import SpaceShipManager from "../Player/SpaceShipManager";
import { PlayerData } from "../UserData/UserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gacha extends cc.Component {

    @property([cc.Prefab])
    BuffList: cc.Prefab[] = [];

    @property(cc.Boolean)
    debug: boolean = false;

    Player: cc.Node = null;

    fristIdx = 0;
    secIdx = 0;
    thirdIdx = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.Player = cc.find("Player");
        if(!this.debug && this.BuffList.length <= 0)
        {
            cc.resources.loadDir("BuffsList", cc.Prefab, (e: Error, items: cc.Prefab[])=>
            {
                if(e)
                {
                    cc.log("Error when loading Gacha In-game: " + e.message);
                }
                else
                {
                    this.BuffList = items;
                    cc.log("Gacha In-game Assets Length: " + items.length);
                }    
            })
            //cc.warn("LENGTH " + this.BuffList.length);
        }
    }

    public ChoiceDebug(event, customEventData)
    {
        if(this.debug)
        {
            switch(customEventData)
            {
                case "1":
                    this.Player?.getComponent(PlayerStats).SetlvDebug();
                    break;
                case "2":
                    this.Player?.getComponent(SpaceShipManager).SetSpaceShipDebug();
                    break;
                case "3":
                    this.Player?.getComponent(HealthManager).Healing(10);
                    break;
            }
        }
        else
        {
            let buff: cc.Node = null;
            switch(customEventData)
            {    
                case "1":
                    //this.BuffList[this.fristIdx].data.getComponent(BuffManager).ApplyEffect();
                    buff = cc.instantiate(this.BuffList[this.fristIdx]);
                    buff.parent = cc.director.getScene();
                    break;
                case "2":
                    //this.BuffList[this.secIdx].data.getComponent(BuffManager).ApplyEffect();
                    buff = cc.instantiate(this.BuffList[this.secIdx]);
                    buff.parent = cc.director.getScene();
                    break;
                case "3":
                    //this.BuffList[this.thirdIdx].data.getComponent(BuffManager).ApplyEffect();
                    buff = cc.instantiate(this.BuffList[this.thirdIdx]);
                    buff.parent = cc.director.getScene();
                    break;
            }
        }
        this.node.emit("ChooseDone");
    }

    public Reroll()
    {
        if(PlayerStats.reroll > 0)
        {    
            PlayerStats.reroll = PlayerStats.reroll/1 - 1;
            cc.tween(this.node).to(0.5, {
                scale: 0
            }).call(()=>
            {
                cc.tween(this.node).to(0.5, {
                    scale: 1
                }).start();
                this.FetchChoices();
            }).start();
        }
    }

    public FetchChoices()
    {
        if(!this.debug)
        {    
            let idxList = []
            this.fristIdx = Math.floor(Math.random() * this.BuffList.length);
            this.secIdx = Math.floor(Math.random() * this.BuffList.length);
            this.thirdIdx = Math.floor(Math.random() * this.BuffList.length);
            idxList.push(this.fristIdx);
            idxList.push(this.secIdx);
            idxList.push(this.thirdIdx);

            for(let i = 0; i < this.node.childrenCount-1; i++)
            {
                // cc.warn(idxList[i]);
                // cc.warn("PREFAB CHECK" + this.BuffList[idxList[i]].name);
                // cc.warn("data prefab CHECK" + this.BuffList[idxList[i]].data);
                this.node.children[i].children[1].getComponent(cc.Sprite).spriteFrame = 
                            this.BuffList[idxList[i]].data.getComponent(BuffManager).Icon;

                this.node.children[i].children[2].getComponent(cc.Label).string = 
                            this.BuffList[idxList[i]].data.getComponent(BuffManager).tooltip;
                
                this.BuffList[idxList[i]].data.getComponent(BuffManager).setEffect();
                this.BuffList[idxList[i]].data.getComponent(BuffManager).setTarget(this.Player);
            }
        }
    }

    start () 
    {

    }

    update (dt) 
    {
        if(PlayerStats.reroll <= 0)
        {
            this.node.children[3].getComponent(cc.Button).interactable = false;
        }
        else
        {
            this.node.children[3].getComponent(cc.Button).interactable = true;
        }
    }
}
