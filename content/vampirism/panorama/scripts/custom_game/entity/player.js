"use strict"

class PlayerRandomType {

}

PlayerRandomType.CARD = 0;
PlayerRandomType.ITEM = 1;
PlayerRandomType.ABILITY = 2;
PlayerRandomType.MAX = 3;

GameUI.PlayerRandomType = PlayerRandomType;


class PlayerStage {

}

PlayerStage.NONE = 0;
PlayerStage.SELECT_MASTER = 1;
PlayerStage.PRE = 2;
PlayerStage.BATTLEING = 3;
PlayerStage.SETTLE = 4;
PlayerStage.MATCH = 5;
GameUI.PlayerStage = PlayerStage;


class Player extends GameUI.Entity {
    constructor() {
        super();
        let THIS = this;
        THIS._property = new GameUI.PlayerReceiveProperty();
        THIS._stageNode = new GameUI.ViAsynCallback1();
        THIS._currentPopulationNode = new GameUI.ViAsynCallback1();
        THIS._maxPopulationNode = new GameUI.ViAsynCallback1();
        THIS._updateShopRedDotNodeCallback = new GameUI.ViAsynCallback1();
        THIS._updatePlayerOnlineQuestRedDotCallback = new GameUI.ViAsynCallback1();
        THIS._updatePlusFreeGoldRedDotCallback = new GameUI.ViAsynCallback1();
        THIS._updatePlusFreeGoldRedDotByPlusNode = new GameUI.ViAsynCallback1();
        THIS._updatePlusFreeGemsRedDotCallback = new GameUI.ViAsynCallback1();
        THIS._updatePlusFreeGemsRedDotByPlusNode = new GameUI.ViAsynCallback1();
        THIS._updatePlayerTreasureRedDotNode = new GameUI.ViAsynCallback1();
        //
        this._updateBattlePassLevelNode = new GameUI.ViAsynCallback1();
        this._updateBattlePassVipGetLevelsNode = new GameUI.ViAsynCallback1();
        this._updateBattlePassFreeGetLevelsNode = new GameUI.ViAsynCallback1();
        this._updateBattlePassKillNode = new GameUI.ViAsynCallback1();
        this._updateBattlePassPurchaseNode = new GameUI.ViAsynCallback1();
        this._isSoulNode = new GameUI.ViAsynCallback1();
        this._UpdateRankRewardRedDotNode = new GameUI.ViAsynCallback1();

        //
    }

    Start() {
        this._isCloseVerificationNode = new GameUI.ViAsynCallback1(); //碎片数量
        GameUI.Player.Instance.Property.Verify.CallbackList.AttachAsyn(this._isCloseVerificationNode, this, this.UpdateVerification);
        this.UpdateVerification();
        GameUI.Player.Instance.Property.OwnPlayerMarket.CallbackList.AttachAsyn(this._updateShopRedDotNodeCallback, this, this.UpdateShopRedDotNode);
        this.UpdateShopRedDotNode();
        this._updatePlayerOnlineQuestTimeNode = new GameUI.ViTimeNode4();
        GameUI.Player.Instance.Property.OnlineQuest.CallbackList.AttachAsyn(this._updatePlayerOnlineQuestRedDotCallback, this, this.UpdatePlayerOnlineQuestRedDot);
        this.UpdatePlayerOnlineQuestRedDot();
        this._updateGetFreeRefreshTicketTimeNode = new GameUI.ViTimeNode4();
        this._updateGetFreeGemsTimeNode = new GameUI.ViTimeNode4();
        GameUI.Player.Instance.Property.OwnPlayerMarket.CallbackList.AttachAsyn(this._updatePlusFreeGoldRedDotCallback, this, this.UpdatePlusFreeGoldRedDot);
        GameUI.Player.Instance.Property.PlusType.CallbackList.AttachAsyn(this._updatePlusFreeGoldRedDotByPlusNode, this, this.UpdatePlusFreeGoldRedDot);
        this.UpdatePlusFreeGoldRedDot();
        GameUI.Player.Instance.Property.OwnPlayerMarket.CallbackList.AttachAsyn(this._updatePlusFreeGemsRedDotCallback, this, this.UpdatePlusFreeGemsRedDot);
        GameUI.Player.Instance.Property.PlusType.CallbackList.AttachAsyn(this._updatePlusFreeGemsRedDotByPlusNode, this, this.UpdatePlusFreeGemsRedDot);
        this.UpdatePlusFreeGemsRedDot();
        GameUI.Player.Instance.Property.Stage.CallbackList.AttachAsyn(this._stageNode, this, this._UpdateStage);
        GameUI.Player.Instance.Property.CurrentPopulation.CallbackList.AttachAsyn(this._currentPopulationNode, this, this.UpdatePopulation);
        GameUI.Player.Instance.Property.MaxPopulation.CallbackList.AttachAsyn(this._maxPopulationNode, this, this.UpdatePopulation);
        GameUI.Player.Instance.Property.IsSoul.CallbackList.AttachAsyn(this._isSoulNode, this, this.UpdateIsSoulState);
        this._attachBattlePassCallback();
        GameUI.Player.Instance.Property.OwnPlayerItems.CallbackList.AttachAsyn(this._updatePlayerTreasureRedDotNode, this, this.UpdatePlayerTreasureRedDot);
        this.UpdatePlayerTreasureRedDot();
        GameUI.Player.Instance.Property.SeasonReward.CallbackList.AttachAsyn(this._UpdateRankRewardRedDotNode, this, this.UpdateRankRewardRedDot);
        this.UpdateRankRewardRedDot();
        this._populationParticle == null;
        this._UpdateStage();
        let isSoul = GameUI.Player.Instance.Property.IsSoul.Value;
        if (isSoul && GameUI.ViewControllerManager.Instance.GameOverView != null && !GameUI.ViewControllerManager.Instance.GameOverView.IsOpen) {
            GameUI.ViewControllerManager.Instance.GameOverView.Toggle();
        }
        if (isSoul && GameUI.ViewControllerManager.Instance.BattlePassView != null && !GameUI.ViewControllerManager.Instance.BattlePassView.IsOpen && this.BHasItemForBattlePass()) {
            GameUI.ViewControllerManager.Instance.BattlePassView.Toggle();
        }
        ///
        GameEvents.Subscribe(GameUI.GameKeyWord.Server_Event, this.OnDayRewardItemsCallback);
    }


    OnDayRewardItemsCallback(stream) {
        let severEventType = stream.FuncID;
        if (severEventType == GameUI.PlayerClientMethod.GET_DAY_REWARD_ITEM) {
            let data = JSON.parse(stream.Data).Items;
            if (GameUI.ViewControllerManager.Instance.DayRewardView != null) {
                GameUI.ViewControllerManager.Instance.DayRewardView.Open();
            }
            GameUI.ViewControllerManager.Instance.DayRewardView.DayRewardInfo(data);
        }

    }

    UpdateVerification() {
        if (GameUI.ViewControllerManager.Instance.VerificationView != null) {
            if (GameUI.Player.Instance.Property.Verify.Value == 0) {
                $.Msg("VerificationView.Open()")
                GameUI.ViewControllerManager.Instance.VerificationView.Open();
            } else {
                $.Msg("VerificationView.Close()")
                GameUI.ViewControllerManager.Instance.VerificationView.Close(true);
            }
            $.Msg("GameUI.Player.Instance.Property.Verify.Value=" + GameUI.Player.Instance.Property.Verify.Value);
        }
    }

    UpdateIsSoulState() {
        let isSoul = GameUI.Player.Instance.Property.IsSoul.Value;
        if (isSoul == 0) {
            return;
        }
        //
        if (GameUI.ViewControllerManager.Instance.GameOverView != null) {
            GameUI.ViewControllerManager.Instance.GameOverView.Toggle();
        }
        if (GameUI.ViewControllerManager.Instance.BattlePassView != null && this.BHasItemForBattlePass()) {
            GameUI.ViewControllerManager.Instance.BattlePassView.Toggle();
        }
        if (GameUI.ViewControllerManager.Instance.FightDamageView != null && GameUI.ViewControllerManager.Instance.FightDamageView.IsOpen) {
            GameUI.ViewControllerManager.Instance.FightDamageView.Close(true)
        }
        if (GameUI.ViewControllerManager.Instance.BuyCardView != null && GameUI.ViewControllerManager.Instance.BuyCardView.IsOpen) {
            GameUI.ViewControllerManager.Instance.BuyCardView.Close(true)
        }
    }
    UpdatePopulation() {
        let currentPopulation = GameUI.Player.Instance.Property.CurrentPopulation.Value;
        let maxPopulation = GameUI.Player.Instance.Property.MaxPopulation.Value;
        let playerID = Game.GetLocalPlayerID();
        let team = Players.GetTeam(playerID);
        let positon = GameUI.WorldParameterStruct.LevelsInfo[team].WorldCenter;
        if (this._populationParticle != null) {
            Particles.DestroyParticleEffect(this._populationParticle, true);
        }
        let data_index = currentPopulation * 10 + maxPopulation;
        let particle_name = GameUI.PopulationData[data_index].Particle;
        this._populationParticle = Particles.CreateParticle(particle_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1);
        if (this._populationParticle !== null) {
            Particles.SetParticleControl(this._populationParticle, 0, [positon.x, positon.y + 600, 150]);
            Particles.SetParticleControl(this._populationParticle, 1, [300, 300, 300]);
        }
    }

    _UpdateStage() {
        let isSoul = GameUI.Player.Instance.Property.IsSoul.Value;
        if (isSoul == 1) {
            return;
        }
        let stage = GameUI.Player.Instance.Property.Stage.Value;
        if (stage == GameUI.PlayerStage.PRE) {
            // $.Msg("stage == GameModeRecordStage.PRE");
            if (GameUI.ViewControllerManager.Instance.BuyCardView != null) {
                GameUI.ViewControllerManager.Instance.BuyCardView.Open();
            }
            this.UpdatePopulation();
            GameUI.SelectUnit(-1, false);
        } else if (stage == GameUI.PlayerStage.BATTLEING) {
            if (GameUI.ViewControllerManager.Instance.BuyCardView != null && GameUI.ViewControllerManager.Instance.BuyCardView.IsOpen) {
                GameUI.ViewControllerManager.Instance.BuyCardView.Close();
            }
            //删除英雄选中标记
            if (this._populationParticle != null) {
                Particles.DestroyParticleEffect(this._populationParticle, true);
            }
        }

    }
    _attachBattlePassCallback() {
        GameUI.Player.Instance.Property.BattlePassLevel.CallbackList.AttachAsyn(this._updateBattlePassLevelNode, this, this.UpdateBattlePassRedDot);
        GameUI.Player.Instance.Property.BattlePassVipGetLevels.CallbackList.AttachAsyn(this._updateBattlePassVipGetLevelsNode, this, this.UpdateBattlePassRedDot);
        GameUI.Player.Instance.Property.BattlePassFreeGetLevels.CallbackList.AttachAsyn(this._updateBattlePassFreeGetLevelsNode, this, this.UpdateBattlePassRedDot);
        GameUI.Player.Instance.Property.BattlePassKillCnt.CallbackList.AttachAsyn(this._updateBattlePassKillNode, this, this.UpdateBattlePassRedDot);
        GameUI.Player.Instance.Property.BattlePassPurchased.CallbackList.AttachAsyn(this._updateBattlePassPurchaseNode, this, this.UpdateBattlePassRedDot);
        this.UpdateBattlePassRedDot();
    }
    _GetPlayerOnlineQuestKillNum() {
        let onlineQuest = GameUI.Player.Instance.Property.OnlineQuest.Value;
        let onlineQuestProperty = onlineQuest.Get(GameUI.ConstValue.DailyMissionID);
        if (onlineQuestProperty == null) {
            $.Msg("onlineQuestProperty == null");
            return;
        }

        let dailyKill = this._GetPlayerQuestProgress() >= 3 ? 0 : GameUI.ViMathDefine.Max(0, onlineQuestProperty.Kill);
        return dailyKill;
    }
    _GetPlayerQuestProgress() {
        let onlineQuest = GameUI.Player.Instance.Property.OnlineQuest.Value;
        let onlineQuestProperty = onlineQuest.Get(GameUI.ConstValue.DailyMissionID);
        if (onlineQuestProperty == null) {
            $.Msg("onlineQuestProperty == null");
            return;
        }
        let progress = onlineQuestProperty.Progress;
        return progress
    }
    _GetCurrentQuestNeedKillNum() {
        let onlineQuest = GameUI.Player.Instance.Property.OnlineQuest.Value;
        if (!onlineQuest) {
            return 0;
        }
        $.Msg("onlineQuest=" + JSON.stringify(onlineQuest));
        let onlineQuestProperty = onlineQuest.Get(GameUI.ConstValue.DailyMissionID);
        if (onlineQuestProperty == null) {
            $.Msg("onlineQuestProperty == null");
            return 0;
        }
        let onlineQuestID = onlineQuestProperty.QuestID;
        let onlineQuestData = GameUI.OnlineQuestStruct.Data(onlineQuestID);
        let progress = this._GetPlayerQuestProgress();
        let questID;
        if (progress < 3) {
            questID = onlineQuestData.Quests[progress + 1].ForeignKey_Quest;
        }
        let questStruct = GameUI.QuestStruct.Data(questID);
        let questNeed = questStruct.Content.MiscVlaue[1].Value;
        if (questNeed == null) {
            questNeed = 0;
        }
        return questNeed;
    }
    UpdatePlusFreeGoldRedDot() {
        let plusType = GameUI.Player.Instance.Property.PlusType.Value;
        let isVip = plusType != GameUI.PlusType.NONE;

        if (!isVip) {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGold", 0);
            return;
        }
        let playerHasGotLimitedItemDic = GameUI.Player.Instance.Property.OwnPlayerMarket.Value;
        let isHasGotRefreshCard = playerHasGotLimitedItemDic.Contain(GameUI.ConstValue.PlusGoldCoinID);
        if (!isHasGotRefreshCard) {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGold", 1);
        } else {
            if (!this._updateGetFreeRefreshTicketTimeNode.IsAttach()) {
                this._updateGetFreeRefreshTicketTimeNode.Start(GameUI.ViRealTimerInstance.Timer(), 1, this, function() {
                    let purchaseAt = playerHasGotLimitedItemDic.Get(GameUI.ConstValue.PlusGoldCoinID).PurchaseAt;
                    purchaseAt = GameUI.ViMathDefine.Max(0, purchaseAt - parseInt(Game.GetGameTime()));
                    if (purchaseAt <= 0) {
                        this._updateGetFreeRefreshTicketTimeNode.Detach();
                        if (isVip) {
                            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGold", 1);
                        } else {
                            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGold", 0);
                        }
                    } else {
                        GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGold", 0);
                    }

                }.bind(this));
            }

        }
    }
    UpdatePlusFreeGemsRedDot() {
        let plusType = GameUI.Player.Instance.Property.PlusType.Value;
        let isVip = plusType != GameUI.PlusType.NONE;

        if (!isVip) {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGems", 0);
            return;
        }
        let playerHasGotLimitedItemDic = GameUI.Player.Instance.Property.OwnPlayerMarket.Value;
        let isHasGotRefreshCard = playerHasGotLimitedItemDic.Contain(GameUI.ConstValue.PlusGemsCoinID);
        if (!isHasGotRefreshCard) {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGems", 1);
        } else {
            if (!this._updateGetFreeGemsTimeNode.IsAttach()) {
                this._updateGetFreeGemsTimeNode.Start(GameUI.ViRealTimerInstance.Timer(), 1, this, function() {
                    let purchaseAt = playerHasGotLimitedItemDic.Get(GameUI.ConstValue.PlusGemsCoinID).PurchaseAt;
                    purchaseAt = GameUI.ViMathDefine.Max(0, purchaseAt - parseInt(Game.GetGameTime()));
                    if (purchaseAt <= 0) {
                        this._updateGetFreeGemsTimeNode.Detach();
                        if (isVip) {
                            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGems", 1);
                        } else {
                            GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGems", 0);
                        }
                    } else {
                        GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_PlusDailyGems", 0);
                    }

                }.bind(this));
            }

        }
    }
    UpdatePlayerOnlineQuestRedDot() {
        let onlineQuest = GameUI.Player.Instance.Property.OnlineQuest.Value;
        let onlineQuestProperty = onlineQuest.Get(GameUI.ConstValue.DailyMissionID);
        if (onlineQuestProperty == null) {
            $.Msg("onlineQuestProperty == null");
            return;
        }
        let progress = this._GetPlayerQuestProgress();
        let dailyKill = this._GetPlayerOnlineQuestKillNum();
        let questNeed = this._GetCurrentQuestNeedKillNum();
        this._updatePlayerOnlineQuestTimeNode.Detach();
        this._updatePlayerOnlineQuestTimeNode.Start(GameUI.ViRealTimerInstance.Timer(), 1, this, function() {
            let collectTime = 0;
            if (progress < 3) {
                collectTime = onlineQuestProperty.Collect;
            } else {
                collectTime = onlineQuestProperty.StartAt;
            }
            collectTime = GameUI.ViMathDefine.Max(0, collectTime - parseInt(Game.GetGameTime()));
            if (collectTime <= 0) {
                this._updatePlayerOnlineQuestTimeNode.Detach();
            }
            let bComplete = (dailyKill >= questNeed) && collectTime <= 0;
            if (bComplete && progress < 3) {
                GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_MissionComplete", 1);
            } else {
                GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_MissionComplete", 0);
            }
        }.bind(this));
    }
    UpdateShopRedDotNode() {
        let itemList = GameUI.PlayerItemMarketData;
        for (let itemID in itemList) {
            if (itemID == 0) {
                continue;
            }
            let playerItemMarketStruct = GameUI.PlayerItemMarketStruct.Data(itemID);
            let isAcitve = playerItemMarketStruct.Active;
            if (!isAcitve) {
                continue;
            }
            let canBuyItem = this._CanPlayerBuyItem(itemID);
            let playerItemPayStruct = GameUI.PlayerItemPayStruct.Data(playerItemMarketStruct.ForeignKey_ItemPayStruct);
            let itemCost = playerItemPayStruct.Value;
            if (itemID == GameUI.ConstValue.DailyDoubleGoldID) {
                //双倍金币
                if (itemCost == 0 && canBuyItem) {
                    //免费且能购买加入红点系统
                    GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_DailyDoubleGold", 1);
                } else {
                    GameUI.RedDotModule.Instance.OnRedDotUpdate("Shop_DailyDoubleGold", 0);
                }
            }
        }
    }
    _CanPlayerBuyItem(itemID) {
        let playerItemMarketStruct = GameUI.PlayerItemMarketStruct.Data(itemID);
        let limitType = playerItemMarketStruct.PurchaseLimit.ResetType;
        let isLimitedChargeItem = limitType != GameUI.PlayerItemMarketStruct.ResetType.NONE; //是限购商品
        let limitedCount = 0;
        let canBuyItem = 1;
        if (itemID == GameUI.ConstValue.BattlePassID) {
            canBuyItem = GameUI.Player.Instance.Property.BattlePassPurchased.Value ? 0 : 1;
            return canBuyItem;
        }

        if (isLimitedChargeItem) {
            limitedCount = playerItemMarketStruct.PurchaseLimit.Count;
            let playerHasGotLimitedItemDic = GameUI.Player.Instance.Property.OwnPlayerMarket.Value;
            let isHasGotItem = playerHasGotLimitedItemDic.Contain(itemID);
            if (!isHasGotItem) {
                canBuyItem = 1;
            } else {
                let buyLimitItem = playerHasGotLimitedItemDic.Get(itemID);
                let purchaseAt = buyLimitItem.PurchaseAt;
                let currentCount = buyLimitItem.Count;
                canBuyItem = currentCount < limitedCount ? 1 : 0;
                if (limitType == 2) {
                    canBuyItem = GameUI.ViMathDefine.Max(0, purchaseAt - parseInt(Game.GetGameTime())) <= 0 ? 1 : 0;
                }
            }
        }
        return canBuyItem;
    }
    UpdateBattlePassRedDot() {
        let count = this.BHasItemForBattlePass();
        GameUI.RedDotModule.Instance.OnRedDotUpdate("BattlePass_CanGet", count);
    }
    BHasItemForBattlePass() {
        let battlePassID = GameUI.Player.Instance.Property.BattlePassID.Value;
        let battlePassStruct = GameUI.BattlePassStruct.Data(battlePassID);
        let maxNum = battlePassStruct.MaxLevel;
        let bHasBuyBattlePass = GameUI.Player.Instance.Property.BattlePassPurchased.Value;
        let count = 0;
        let freenum = 0;
        for (let iter = 1; iter <= maxNum; ++iter) {
            if (GameUI.GetFreeItemIDForBattlePass(battlePassID, iter) == true) {
                freenum++;
            }
        }
        $.Msg("freenum" + freenum)
        for (let iter = 0; iter < maxNum; ++iter) {
            if (iter < freenum && this._CanGetBattlePassFreeItem(iter)) {
                count++;
            }
            if (bHasBuyBattlePass && this._CanGetBattlePassVipItem(iter)) {
                count++;
            }
        }
        return count;
    }
    _CanGetBattlePassFreeItem(slot) {
        let playerBattlePassLevel = GameUI.Player.Instance.Property.BattlePassLevel.Value;
        let playerBattlePassFreeStatus = GameUI.Player.Instance.Property.BattlePassFreeGetLevels.Value;
        if (playerBattlePassLevel < slot + 1) {
            return false;
        }
        let canGet = !playerBattlePassFreeStatus.Get(slot);
        return canGet;
    }
    _CanGetBattlePassVipItem(slot) {
        let playerBattlePassLevel = GameUI.Player.Instance.Property.BattlePassLevel.Value;
        let playerBattlePassVipStatus = GameUI.Player.Instance.Property.BattlePassVipGetLevels.Value;
        if (playerBattlePassLevel < slot + 1) {
            return false;
        }
        let canGet = !playerBattlePassVipStatus.Get(slot);
        return canGet;
    }
    UpdateRankRewardRedDot() {
        let isHasGet = GameUI.Player.Instance.Property.SeasonReward.Value;
        let rankID = GameUI.Player.Instance.Property.PreSeasonGrade.Value;
        let rankNameID = GameUI.RankPositionStruct.Data(rankID).RankNameID;
        if (isHasGet == 0 && rankNameID >= 4) {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Rank_Reward", 1);
        } else {
            GameUI.RedDotModule.Instance.OnRedDotUpdate("Rank_Reward", 0);
        }
    }
    UpdatePlayerTreasureRedDot() {
        $.Msg("UpdatePlayerTreasureRedDot----------------------------------------------");

        let playerItems = GameUI.Player.Instance.Property.OwnPlayerItems.Value.Values;
        $.Msg("playerItems=" + JSON.stringify(playerItems));
        for (let iter in playerItems) {
            if (playerItems[iter].ID == GameUI.ConstValue.SilverTreasureID) {
                var silverTreasureCount = playerItems[iter].Count;
            } else if (playerItems[iter].ID == GameUI.ConstValue.SummonerTreasureID) {
                var summonerTreasureCount = playerItems[iter].Count;
            } else if (playerItems[iter].ID == GameUI.ConstValue.CourierTreasureID) {
                var courierTreasureCount = playerItems[iter].Count;
            }

        }
        GameUI.RedDotModule.Instance.OnRedDotUpdate("Treasure_Summoner", summonerTreasureCount);
        GameUI.RedDotModule.Instance.OnRedDotUpdate("Treasure_Courier", courierTreasureCount);
        GameUI.RedDotModule.Instance.OnRedDotUpdate("Treasure_Silver", silverTreasureCount);
    }
    End() {
        this._stageNode.End();
        this._currentPopulationNode.End();
        this._maxPopulationNode.End();
        this._isSoulNode.End();
    }

    StartProperty(stream) {
        $.Msg("Player:StartProperty" + stream);
        this.Property.Start(stream);
    }

    get Property() {
        return this._property;
    }

    get ClientExecer() {
        return this._execer;
    }

    OnPropertyUpdate(stream) {
        //$.Msg("Player:OnPropertyUpdate");
        this._property.OnPropertyUpdate(stream, this);
    }

    EndProperty() {
        let THIS = this;
        if (THIS._property != null) {
            THIS._property.EndProperty(this);
        }
    }

    ClearProperty() {
        let THIS = this;
        if (THIS._property != null) {
            THIS._property.Clear();
            THIS._property = null;
        }
    }

    GetItem(itemID, count) {

    }

    GetLootItems(items) {

    }

    Refresh() {
        let goldCoin = GameUI.Player.Instance.Property.GoldCoin.Value;
        let cost = GameUI.Player.Instance.Property.RandomGoldCoin.Value;
        if (cost <= goldCoin) {
            Game.EmitSound("ui.spect_pickup_in");
        } else {
            Game.EmitSound("General.Cancel");
        }
        let playerID = Game.GetLocalPlayerID();
        GameUI.PlayerServerInvoker.REQ_ReRandomCard(playerID);
        $.Msg("Send Refresh to Server");
    }
    FreeRefresh() {
        $.Msg("Send FreeRefresh to Server");
        let playerID = Game.GetLocalPlayerID();
        GameUI.PlayerServerInvoker.REQ_ReVipFreeRandomCard(playerID);

    }
    UseGoldToRefresh() {
        $.Msg("Send UseGoldToRefresh to Server");
        let playerID = Game.GetLocalPlayerID();
        GameUI.PlayerServerInvoker.REQ_UseGoldRandomCard(playerID);

    }
    ShopLevelUp() {
        let localPlayerID = Game.GetLocalPlayerID();
        GameUI.PlayerServerInvoker.REQ_UpgradeShopLevel(localPlayerID);
        let goldCoin = GameUI.Player.Instance.Property.GoldCoin.Value;
        let cost = GameUI.Player.Instance.Property.UpgradeShopLevelGoldCoin.Value;
        if (cost <= goldCoin) {
            Game.EmitSound("General.LevelUp");
        } else {
            Game.EmitSound("General.Cancel");
        }
        $.Msg("Send ShopLevelUp to Server");
    }
    GetRandomGoldCoin() {
        let costCoin = 0;
        let THIS = this;
        let property = THIS._property;
        if (property != null) {
            let randomGoldCoin = property.RandomGoldCoin.Value;
            let randomGoldCoinExtra = property.RandomGoldCoinExtra.Value;
            let randomGoldCoinScale = property.RandomGoldCoinScale.Value;
            costCoin = GameUI.ViAssisstant.Max(0, (randomGoldCoin + randomGoldCoinExtra) * randomGoldCoinScale);
        }
        //
        return costCoin;
    }

    GetBuyCardGoldCoin() {
        let costCoin = 0;
        let THIS = this;
        let property = THIS._property;
        if (property != null) {
            let buyCardGoldCoin = property.BuyCardGoldCoin.Value;
            let buyCardGoldCoinExtra = property.BuyCardGoldCoinExtra.Value;
            let buyCardGoldCoinScale = property.BuyCardGoldCoinScale.Value;
            costCoin = GameUI.ViAssisstant.Max(0, (buyCardGoldCoin + buyCardGoldCoinExtra) * buyCardGoldCoinScale);
        }
        //
        return costCoin;
    }

    GetBuyItemGoldCoin() {
        let costCoin = 0;
        let THIS = this;
        let property = THIS._property;
        if (property != null) {
            let buyItemGoldCoin = property.BuyItemGoldCoin.Value;
            let buyItemGoldCoinExtra = property.BuyItemGoldCoinExtra.Value;
            let buyItemGoldCoinScale = property.BuyItemGoldCoinScale.Value;
            costCoin = GameUI.ViAssisstant.Max(0, (buyItemGoldCoin + buyItemGoldCoinExtra) * buyItemGoldCoinScale);
        }
        //
        return costCoin;
    }

    GetBuyAbilityGoldCoin() {
        let costCoin = 0;
        let THIS = this;
        let property = THIS._property;
        if (property != null) {
            let buyAbilityGoldCoin = property.BuyAbilityGoldCoin.Value;
            let buyAbilityGoldCoinExtra = property.BuyAbilityGoldCoinExtra.Value;
            let buyAbilityGoldCoinScale = property.BuyAbilityGoldCoinScale.Value;
            costCoin = GameUI.ViAssisstant.Max(0, (buyAbilityGoldCoin + buyAbilityGoldCoinExtra) * buyAbilityGoldCoinScale);
        }
        //
        return costCoin;
    }

    GetServerKey() {
        return this.Property.SelfKey.Value;
    }

    GetRankStatics() {
        let mathRankstatics = GameUI.Player.MathRanlstatics;
        if (mathRankstatics.length == 0) {
            let matchrankstatics = CustomNetTables.GetTableValue("match", "matchrankstatics");
            let keys = Object.keys(matchrankstatics);
            for (let iter = 0; iter < keys.length; ++iter) {
                let key = keys[iter];
                let value = matchrankstatics[key];
                let iterData = { Star: value.star, Score: value.score, Rank: value.rank, Total: value.total }
                mathRankstatics.push(iterData);
            }
            mathRankstatics.sort(
                function(left, right) {
                    return left.Score - right.Score
                }
            );
        }
        //
        let totalNumber = 0;
        let exceedNumber = 0;
        let grade = this.Property.Grade.Value;
        let gradeStar = this.Property.GradeStar.Value;
        for (let iter = 0; iter < mathRankstatics.length; ++iter) {
            let iterMatchRank = mathRankstatics[iter];
            if (grade > iterMatchRank.Rank && gradeStar > iterMatchRank.Star) {
                exceedNumber = exceedNumber + iterMatchRank.Total;
            }
            //
            totalNumber = totalNumber + iterMatchRank.Total;
        }
        //
        return GameUI.ViAssisstant.IntNear((exceedNumber) / GameUI.ViAssisstant.Max(1, totalNumber) * 100);
    }

    GetTreasureActivityID() {
        let serverTime = this.Property.ConnectServerTime.Value + Game.GetGameTime(); //几分钟延迟
        serverTime = serverTime * 1000;
        for (var reasureActivityID in GameUI.TreasureActivityData) {
            if (reasureActivityID == 0) {
                continue;
            }
            //
            let treasureActivityData = GameUI.TreasureActivityStruct.Data(reasureActivityID);
            if (!treasureActivityData.Active) {
                continue;
            }
            let dateStartTime = treasureActivityData.DateStartTime;
            let dateEndTime = treasureActivityData.DateEndTime;
            let dateStart = new Date(dateStartTime.Year, dateStartTime.Month - 1, dateStartTime.Day, dateStartTime.Hour, dateStartTime.Minute, dateStartTime.Second);
            let dateEnd = new Date(dateEndTime.Year, dateEndTime.Month - 1, dateEndTime.Day, dateEndTime.Hour, dateEndTime.Minute, dateEndTime.Second);
            dateStartTime = dateStart.getTime();
            dateEndTime = dateEnd.getTime();
            if (serverTime >= dateStartTime && serverTime <= dateEndTime) {
                return reasureActivityID;
            }
        }
        //
        return 0;
    }

    GetCourierPracticeCardID(courierID) {
        let playerOwnItemsIDList = GameUI.Player.Instance.Property.OwnPlayerItems.Value.Keys;
        for (let iter in playerOwnItemsIDList) {
            let id = playerOwnItemsIDList[iter];
            let itemStruct = GameUI.PlayerItemStruct.Data(id);
            let type = itemStruct.Type;
            if (type == GameUI.ConstValue.CourierPracticeCardType && courierID == itemStruct.MiscVlaue[1].Value) {
                return id;
            }
        }
        //-1表示没有该信使体验卡
        return -1;
    }

    IsPlayerHasCouriers(id) {
        let playerOwnCouriersDic = GameUI.Player.Instance.Property.OwnCouriers.Value;
        let isPlayerOwn = playerOwnCouriersDic.Contain(id) ? true : false;
        return isPlayerOwn;
    }

    IsPlayerHasSummoner(id) {
        let playerOwnSkinsSelectedDic = GameUI.Player.Instance.Property.OwnServerMasters.Value;
        let isPlayerOwn = playerOwnSkinsSelectedDic.Contain(id) ? true : false;
        return isPlayerOwn;
    }
    IsPlayerHasDress(id) {
        let playerOwnDressDic = GameUI.Player.Instance.Property.OwnPlayerItems.Value;
        let isPlayerOwn = playerOwnDressDic.Contain(id) ? true : false;
        return isPlayerOwn;
    }
    GetCourierPracticeCardNum(cardID) {
        let playerOwnItemsData = GameUI.Player.Instance.Property.OwnPlayerItems.Value;
        let cardNum = 0;
        if (playerOwnItemsData.Contain(cardID)) {
            cardNum = playerOwnItemsData.Get(cardID).Count;
        }
        return cardNum;
    }
    IsBanSummoner(id) {
        let playerOwnSkinsSelectedDic = GameUI.Player.Instance.Property.OwnServerMasters.Value;
        let IsBan = playerOwnSkinsSelectedDic.Contain(id) ? true : false;
        return IsBan;
    }
    IsPlayerHasFrame(id) {
        let playerOwnFrameDic = GameUI.Player.Instance.Property.OwnPlayerItems.Value;
        let isPlayerOwn = playerOwnFrameDic.Contain(id) ? true : false;
        return isPlayerOwn;
    }
}

Player.MathRanlstatics = new Array();

GameUI.Player = Player;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
class PlayerAssistant {

}

/*** Get the maximum number of players on teams.*/
function GetMaxPlayers() {
    return Players.GetMaxPlayers();
}

/*** Get the maximum number of players on teams.*/
function GetMaxTeamPlayers() {
    return Players.GetMaxTeamPlayers();
}

/*** Get the local player ID.*/
function GetLocalPlayerID() {
    return Players.GetLocalPlayer();
}

/*** Is the nth player a valid player?*/
function IsValidPlayerID(playerID) {
    return Players.IsValidPlayerID(playerID);
}

/*** Return the name of a player.*/
function GetPlayerName(playerID) {
    return Players.GetPlayerName(playerID);
}

/*** Get the entity index of the hero controlled by this player.*/
function GetPlayerHeroEntityIndex(playerID) {
    return Players.GetPlayerHeroEntityIndex(playerID);
}

/*** Get the entities this player has selected.*/
function GetSelectedEntities(playerID) {
    return Players.GetSelectedEntities(playerID);
}

/*** Get the entities this player is querying.*/
function GetQueryUnit(playerID) {
    return Players.GetQueryUnit(playerID);
}

/*** Get local player current portrait unit. (ie. Player's hero or primary selected unit.)*/
function GetLocalPlayerPortraitUnit() {
    return Players.GetLocalPlayerPortraitUnit();
}

/*** Can the player buy back?*/
function CanPlayerBuyback(playerID) {
    return Players.CanPlayerBuyback(iPlayerID);
}

/*** Does this player have a custom game ticket?*/
function HasCustomGameTicketForPlayerID(playerID) {
    return Players.HasCustomGameTicketForPlayerID(iPlayerID);
}

/*** The number of assists credited to a player.*/
function GetAssists(playerID) {
    return Players.GetAssists(playerID);
}

function GetClaimedDenies(playerID) {
    return Players.GetClaimedDenies(playerID);
}

function GetClaimedMisses(playerID) {
    return Players.GetClaimedMisses(playerID);
}

/*** The number of deaths a player has suffered.*/
function GetDeaths(playerID) {
    return Players.GetDeaths(playerID);
}

/*** The number of denies credited to a player.*/
function GetDenies(playerID) {
    return Players.GetDenies(playerID);
}

/*** The amount of gold a player has.*/
function GetGold(playerID) {
    return Players.GetGold(playerID);
}

/*** The number of kills credited to a player.*/
function GetKills(playerID) {
    return Players.GetKills(playerID);
}

function GetLastBuybackTime(playerID) {
    return Players.GetLastBuybackTime(playerID);
}

function GetLastHitMultikill(playerID) {
    return Players.GetLastHitMultikill(playerID);
}

/*** The number of last hits credited to a player.*/
function GetLastHits(playerID) {
    return Players.GetLastHits(playerID);
}

function GetLastHitStreak(playerID) {
    return Players.GetLastHitStreak(playerID);
}

/*** The current level of a player.*/
function GetLevel(playerID) {
    return Players.GetLevel(playerID);
}

function GetMisses(playerID) {
    return Players.GetMisses(playerID);
}

function GetNearbyCreepDeaths(playerID) {
    return Players.GetNearbyCreepDeaths(playerID);
}

/*** Total reliable gold for this player.*/
function GetReliableGold(playerID) {
    return Players.GetReliableGold(playerID);
}

function GetRespawnSeconds(playerID) {
    return Players.GetRespawnSeconds(playerID);
}

function GetStreak(playerID) {
    return Players.GetStreak(playerID);
}

/**
 * Total gold earned in this game by this player.
 */
function GetTotalEarnedGold(playerID) {
    return Players.GetTotalEarnedGold(playerID);
}

/**
 * Total xp earned in this game by this player.
 */
function GetTotalEarnedXP(playerID) {
    return Players.GetTotalEarnedXP(playerID);
}

/**
 * Total unreliable gold for this player.
 */
function GetUnreliableGold(playerID) {
    return Players.GetUnreliableGold(playerID);
}

/**
 * Get the team this player is on.
 */
function GetTeam(playerID) {
    return Players.GetTeam(playerID);
}

/**
 * Average gold earned per minute for this player.
 */
function GetGoldPerMin(playerID) {
    return Players.GetGoldPerMin(playerID);
}

/**
 * Average xp earned per minute for this player.
 */
function GetXPPerMin(playerID) {
    return Players.GetXPPerMin(playerID);
}

/**
 * Return the name of the hero a player is controlling.
 */
function GetPlayerSelectedHero(playerID) {
    return Players.GetPlayerSelectedHero(playerID);
}

/**
 * Get the player color.
 */
function GetPlayerColor(playerID) {
    return Players.GetPlayerColor(playerID);
}

/**
 * Is this player a spectator.
 */
function IsSpectator(playerID) {
    return Players.IsSpectator(playerID);
}


function PlayerPortraitClicked(clickedPlayerID, holdingCtrl, bHoldingAlt) {
    Players.PlayerPortraitClicked(clickedPlayerID, holdingCtrl, bHoldingAlt);
}


function BuffClicked(nEntity, nBuffSerial, bAlert) {
    Players.BuffClicked(nEntity, nBuffSerial, bAlert);
}

PlayerAssistant.GetMaxPlayers = GetMaxPlayers;
PlayerAssistant.GetMaxTeamPlayers = GetMaxTeamPlayers;
PlayerAssistant.GetLocalPlayerID = GetLocalPlayerID;
PlayerAssistant.IsValidPlayerID = IsValidPlayerID;
PlayerAssistant.GetPlayerName = GetPlayerName;
PlayerAssistant.GetPlayerHeroEntityIndex = GetPlayerHeroEntityIndex;
PlayerAssistant.GetSelectedEntities = GetSelectedEntities;
PlayerAssistant.GetQueryUnit = GetQueryUnit;
PlayerAssistant.GetLocalPlayerPortraitUnit = GetLocalPlayerPortraitUnit;
PlayerAssistant.CanPlayerBuyback = CanPlayerBuyback;
PlayerAssistant.HasCustomGameTicketForPlayerID = HasCustomGameTicketForPlayerID;
PlayerAssistant.GetAssists = GetAssists;
PlayerAssistant.GetClaimedDenies = GetClaimedDenies;
PlayerAssistant.GetClaimedMisses = GetClaimedMisses;
PlayerAssistant.GetDeaths = GetDeaths;
PlayerAssistant.GetDenies = GetDenies;
PlayerAssistant.GetGold = GetGold;
PlayerAssistant.GetKills = GetKills;
PlayerAssistant.GetLastBuybackTime = GetLastBuybackTime;
PlayerAssistant.GetLastHitMultikill = GetLastHitMultikill;
PlayerAssistant.GetLastHits = GetLastHits;
PlayerAssistant.GetLastHitStreak = GetLastHitStreak;
PlayerAssistant.GetLevel = GetLevel;
PlayerAssistant.GetMisses = GetMisses;
PlayerAssistant.GetNearbyCreepDeaths = GetNearbyCreepDeaths;
PlayerAssistant.GetReliableGold = GetReliableGold;
PlayerAssistant.GetRespawnSeconds = GetRespawnSeconds;
PlayerAssistant.GetStreak = GetStreak;
PlayerAssistant.GetTotalEarnedGold = GetTotalEarnedGold;
PlayerAssistant.GetTotalEarnedXP = GetTotalEarnedXP;
PlayerAssistant.GetUnreliableGold = GetUnreliableGold;
PlayerAssistant.GetTeam = GetTeam;
PlayerAssistant.GetGoldPerMin = GetGoldPerMin;
PlayerAssistant.GetXPPerMin = GetXPPerMin;
PlayerAssistant.GetPlayerSelectedHero = GetPlayerSelectedHero;
PlayerAssistant.GetPlayerColor = GetPlayerColor;
PlayerAssistant.IsSpectator = IsSpectator;
PlayerAssistant.PlayerPortraitClicked = PlayerPortraitClicked;
PlayerAssistant.BuffClicked = BuffClicked;

GameUI.PlayerAssistant = PlayerAssistant;