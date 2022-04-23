"use strict"

class UILowerHudWindow extends GameUI.UIBaseWindow {
    Show() {
        super.Show();
        this.RootPanel.ToggleClass("Show");
        $.Msg("UILowerHudWindow Open");
    }

    Hide() {
        this.RootPanel.ToggleClass("Show");
        super.Hide();
    }

    OnLoad() {
        let rootPanel = this.RootPanel;
        this.OnSwapItemEndCallback = new GameUI.ViDelegater4();
        this.OnDropItemEndCallback = new GameUI.ViDelegater3();
        let RegisterEventHandler = $.RegisterEventHandler;
        //
        this.ItemInventory = rootPanel.FindChildTraverse("ItemInventory");
        this.ItemInventoryList = this.ItemInventory.FindChildrenWithClassTraverse("InventoryList");
        this.ItemList = new GameUI.ViList();
        this.InventoryList = this.ItemInventoryList[2];
        this.AbilityInventoryList = new GameUI.ViList();
        this.InitItemInventory();
        this.InitAbilityInventory();
        //
        RegisterEventHandler('DragEnter', this.ItemInventory, this.OnDragEnter.bind(this));
        RegisterEventHandler('DragLeave', this.ItemInventory, this.OnDragLeave.bind(this));
        RegisterEventHandler('DragStart', this.ItemInventory, this.OnDragStart.bind(this));
        RegisterEventHandler('DragEnd', this.ItemInventory, this.OnDropItemEnd.bind(this));
        RegisterEventHandler('DragDrop', this.ItemInventory, this.OnDragItemDrop.bind(this));
        //
        this.SellItemType = -1;
        this.SellItemSlot = -1;
        this.SellAbilityEndCallback = new GameUI.ViDelegater1();
        this.SellItemEndCallback = new GameUI.ViDelegater2();
        this.InventoryMenu = rootPanel.FindChildTraverse("InventoryMenu");
        this.InventoryMenu.FindChildTraverse("InventoryMenuBg").SetPanelEvent("onactivate", this.ToggleInventoryMenuWindows.bind(this));
        this.InventoryMenu.FindChildTraverse("InventoryMenuBg").SetPanelEvent("oncontextmenu", this.ToggleInventoryMenuWindows.bind(this));
        this.InventoryMenu.FindChildTraverse("Sell").SetPanelEvent("onactivate", this.SellInventory.bind(this));
        //
        this.Left_Bottom_status = rootPanel.FindChildTraverse("Left_Bottom_status");
        this.Inventory = rootPanel.FindChildTraverse("Inventory");
        this.SummonerBuffContainer = rootPanel.FindChildTraverse("SummonerBuffContainer");
        this.SummonerBuffList = new GameUI.ViList();
        this.RefreshProbabilityContainer = rootPanel.FindChildTraverse("RefreshProbabilityContainer");
        this.ShopLevelTip = this.RefreshProbabilityContainer.FindChildTraverse("ShopLevelTip");
        this.PortraitGroup = rootPanel.FindChildTraverse("PortraitGroup");
        this.PortraitContainers = rootPanel.FindChildTraverse("PortraitContainers");
        //
        this.SummonerButton = rootPanel.FindChildTraverse("SummonerButton");
        this.SummonerAbilitys = rootPanel.FindChildTraverse("SummonerAbilitys");
        //
        this.Shop = rootPanel.FindChildTraverse("Shop");
        this.ShopLevelUp = rootPanel.FindChildTraverse("ShopLevelUp");
        this.ShopLevel = rootPanel.FindChildTraverse("ShopLevel");
        this.ShopLevelImage = rootPanel.FindChildTraverse("ShopLevelImage");
        this.ShopLevelUpButton = rootPanel.FindChildTraverse("ShopLevelUpButton");
        this.ShopLevelUpButton.SetPanelEvent("onactivate", this.OnShopLevelupMsg.bind(this));
        this.OnOpenShopBtnCallback = new GameUI.ViDelegater0();
        this.OpenShopBtn = this.Shop.FindChildTraverse("OpenShop");
        this.OpenShopBtn.SetPanelEvent("onactivate", this.OpenShopBtnClickMsg.bind(this));
        //
        let LocalHeroPortraitList = rootPanel.FindChildTraverse("Inventory").FindChildTraverse("LocalHeroPortrait").FindChildrenWithClassTraverse("PortraitButton");
        for (let iter = 0; iter < LocalHeroPortraitList.length; ++iter) {
            LocalHeroPortraitList[iter].style.opacity = 0;
        }
        let HeroPortraitList = rootPanel.FindChildTraverse("HeroPortraitContainer").FindChildTraverse("HeroPortrait").FindChildrenWithClassTraverse("PortraitButton");
        for (let iter = 0; iter < HeroPortraitList.length; ++iter) {
            HeroPortraitList[iter].style.opacity = 0;
        }
        //
        this.HeroPanel = rootPanel.FindChildTraverse("HeroPanel");
        this.Abilities = this.HeroPanel.FindChildTraverse("Abilities");
        this.abilities = this.HeroPanel.FindChildTraverse("abilities");
        this.AghsStatusContainer = this.HeroPanel.FindChildTraverse("AghsStatusContainer");
        this.Items = this.HeroPanel.FindChildTraverse("Items");
        this.HealthLabel = this.HeroPanel.FindChildTraverse("HealthLabel");
        this.HealthRegenLabel = this.HeroPanel.FindChildTraverse("HealthRegenLabel");
        this.HealthProgress = this.HeroPanel.FindChildTraverse("HealthProgress");
        this.ManaLabel = this.HeroPanel.FindChildTraverse("ManaLabel");
        this.ManaProgress = this.HeroPanel.FindChildTraverse("ManaProgress");
        this.ManaRegenLabel = this.HeroPanel.FindChildTraverse("ManaRegenLabel");
        this.SetupHeroPanel();
        //
        this.XpLevel = rootPanel.FindChildTraverse("Level");
        //
        this.BuffContainer = rootPanel.FindChildTraverse("BuffContainer");
        this.stats_tooltip_region = rootPanel.FindChildTraverse("stats_tooltip_region");
        //
        this.CustomStatBranch = rootPanel.FindChildTraverse("CustomStatBranch");
        //
        this.OnSellHeroCallback = new GameUI.ViDelegater1();
        this.SellRegion = rootPanel.FindChildTraverse("SellRegion");
        this.SellHeroButton = rootPanel.FindChildTraverse("SellHeroButton");
        this.SellHeroButton.SetPanelEvent("onactivate", this.OnSellHero.bind(this));
        //卖装备和技能
        this.SellItemButton = rootPanel.FindChildTraverse("SellItemButton");
        RegisterEventHandler('DragEnter', this.SellItemButton, this.OnDragEnter.bind(this));
        RegisterEventHandler('DragLeave', this.SellItemButton, this.OnDragLeave.bind(this));
        RegisterEventHandler('DragStart', this.SellItemButton, this.OnDragStart.bind(this));
        RegisterEventHandler('DragEnd', this.SellItemButton, this.OnDropItemEnd.bind(this));
        RegisterEventHandler('DragDrop', this.SellItemButton, this.OnDragItemDrop.bind(this));

        this.HeroIcon = rootPanel.FindChildTraverse("HeroIcon");
        this.SummonerAbilityslist = new GameUI.ViList();
        this.PortraitContainerslist = new GameUI.ViList();

    }
    OnDragStart(scrPanel, dragCallback) {
        $.Msg("LowerHud OnDragStart start");
        let imageID = scrPanel.GetAttributeInt("ImageID", -1);
        if (imageID == -1) {
            return;
        }
        let imageName = scrPanel.GetAttributeString("ImageName", "")
        let imageType = scrPanel.GetAttributeString("ImageType", "");
        let displayPanel = null;
        if (imageType == "Ability") {
            displayPanel = $.CreatePanel("DOTAAbilityImage", this.RootPanel, "DragAbilityImage");
            displayPanel.abilityname = imageName;
        } else {
            displayPanel = $.CreatePanel("DOTAItemImage", this.RootPanel, "DragItemImage")
            displayPanel.itemname = imageName;
        }
        dragCallback.displayPanel = displayPanel;
        $.DispatchEvent("DropInputFocus", displayPanel);
        let srcAbilitySlot = scrPanel.GetAttributeInt("AbilitySlot", -1);
        let heroIndex = scrPanel.GetAttributeInt("HeroIndex", -1);
        displayPanel.SrcAbilitySlot = srcAbilitySlot;
        displayPanel.SrcHeroIndex = heroIndex;
        displayPanel.ImageID = imageID;
        displayPanel.ImageType = imageType;
        //
        GameUI.ViewControllerManager.Instance.RightCenterView.ReturnLocalPlayer();
        let toggleButtonType = scrPanel.GetAttributeInt("ToggleButtonType", 0);
        GameUI.ViewControllerManager.Instance.RightCenterView._script.ToggleButtonType = toggleButtonType;
        //
        displayPanel.IsReplace = 1;
        dragCallback.offsetX = 0;
        dragCallback.offsetY = 0;
        scrPanel.SetHasClass("dragging_from", true);

        //卖出
        this.RootPanel.AddClass("ShowSellItemButton");
        this.SellItemType = imageType == "Item" ? 0 : 1;
        return true;
    }
    OnDragEnd(scrPanel, draggedPanel) {
        $.Msg("LowerHud OnDragEnd")
        draggedPanel.DeleteAsync(0);
        scrPanel.SetHasClass("dragging_from", false);

        // GameUI.SelectUnit(-1, false);
        return true;
    }
    OnDropItemEnd(scrPanel, draggedPanel) {
        $.Msg("LowerHud OnDropItemEnd");
        let isDrop = !GameUI.Dota2Assistant.IsCursorInPanel(this.ItemInventory);
        if (isDrop) {
            let dropPos = GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition());
            if (dropPos != null) {
                let vDropPos = { x: dropPos[0], y: dropPos[1], z: dropPos[2] };
                let srcHeroIndex = draggedPanel.SrcHeroIndex;
                let srcAbilitySlot = draggedPanel.SrcAbilitySlot;
                GameUI.ViDelegateAssisstant.Exec3(this.OnDropItemEndCallback, srcHeroIndex, srcAbilitySlot, vDropPos);
            }
        }
        //
        draggedPanel.DeleteAsync(0);
        scrPanel.SetHasClass("dragging_from", false);
        this.RootPanel.RemoveClass("ShowSellItemButton");
        this.RootPanel.RemoveClass("OpenSellItemButton");
        return true;
    }
    OnDragEnter(scrPanel, draggedPanel) {
        $.Msg("LowerHud Panel enter");
        let panelBG = scrPanel;
        let imageType = panelBG.GetAttributeString("ImageType", "");
        if (draggedPanel.paneltype == "DOTAItemImage" && imageType == "Item") {
            panelBG.SetHasClass("HighLight", true);
        }

        if (GameUI.Dota2Assistant.IsCursorInPanel(this.SellItemButton)) {
            this.RootPanel.AddClass("OpenSellItemButton");
        }

        return true;
    }
    OnDragLeave(scrPanel, draggedPanel) {
        $.Msg("LowerHud Panel leave");
        let panelBG = scrPanel;
        let imageType = panelBG.GetAttributeString("ImageType", "");
        if (draggedPanel.paneltype == "DOTAItemImage" && imageType == "Item") {
            panelBG.SetHasClass("HighLight", false);
        }
        this.RootPanel.RemoveClass("OpenSellItemButton");
        return true;
    }
    OnDragItemDrop(scrPanel, draggedPanel) {
            $.Msg("LowerHud OnDragItemDrop start");
            let abilityImage = scrPanel;
            let srcAbilitySlot = draggedPanel.SrcAbilitySlot;
            let srcHeroIndex = draggedPanel.SrcHeroIndex;
            let dstAbilitySlot = abilityImage.GetAttributeInt("AbilitySlot", -1);
            let dstHeroIndex = abilityImage.GetAttributeInt("HeroIndex", -1);
            let dstImageType = scrPanel.GetAttributeString("ImageType", "");
            if (srcAbilitySlot != -1 && dstAbilitySlot != -1) {
                if (draggedPanel.ImageType == "Item" && dstImageType == "Item") {
                    GameUI.ViDelegateAssisstant.Exec4(this.OnSwapItemEndCallback, srcHeroIndex, dstHeroIndex, srcAbilitySlot, dstAbilitySlot);
                    Game.EmitSound("General.SelectAction");
                }
            } else if (GameUI.Dota2Assistant.IsCursorInPanel(this.SellItemButton)) {
                if (this.SellItemType != -1 && srcAbilitySlot != -1) {
                    if (this.SellItemType == 0) { //装备
                        $.Msg("srcAbilitySlot=" + srcAbilitySlot + " 000000000");
                        GameUI.ViDelegateAssisstant.Exec2(this.SellItemEndCallback, srcHeroIndex, srcAbilitySlot);


                    } else {
                        $.Msg("srcAbilitySlot=" + srcAbilitySlot + " 1111111");
                        GameUI.ViDelegateAssisstant.Exec2(this.SellAbilityEndCallback, srcAbilitySlot);
                    }
                    draggedPanel.Complete = true;

                }
            }
            return true;
        }
        // ShowAnimation(panel) {
        //     panel.AddClass("ShowItem");
        //     $.Schedule(1, function() {
        //         panel.RemoveClass("ShowItem");
        //     }.bind(this));
        // }
    ShowPanel() {
        for (let iter = 0; iter < GameUI.ConstValue.HEROTALENTSKILLNUM; ++iter) {
            let pPanelID = "Ability" + iter;
            let pAbilityPanel = $.CreatePanel("Panel", this.SelectedSkillsContainer, pPanelID)
            pAbilityPanel.BLoadLayoutSnippet("AbilityPanel");
        }
    }
    OpenPanel(panel) {
        panel.visible = true;
    }
    HidePanel(panel) {
        panel.visible = false;
    }
    ToggleInventoryMenuWindows() {
        this.InventoryMenu.ToggleClass("ShowInventoryMenu");
    }
    ToggleSellItemButton(isOpen) {
        if (isOpen) {
            this.RootPanel.AddClass("ShowSellItemButton");
        } else {
            this.RootPanel.RemoveClass("ShowSellItemButton");
            this.RootPanel.RemoveClass("OpenSellItemButton");
        }
    }
    SetSellItemType(type) {
        this.SellItemType = type;
    }
    IsCursorInSellHeroButton() {
        if (GameUI.Dota2Assistant.IsCursorInPanel(this.SellHeroButton)) {
            return true;
        }
        return false;
    }
    UpdateHeroIconPositon() {
        let pos = GameUI.GetCursorPosition();
        let fx = pos[0] - this.HeroIcon.actuallayoutwidth;
        let fy = pos[1];
        this.HeroIcon.SetPositionInPixels(fx / this.HeroIcon.actualuiscale_x, fy / this.HeroIcon.actualuiscale_y, 0);
    }
    ShowHeroIcon(isShowHeroIcon) {
        this.RootPanel.SetHasClass("ShowHeroIcon", isShowHeroIcon);
    }
    InitAbilityInventory() {
        for (let iter = 0; iter < 1; ++iter) {
            let inventoryRoot = this.InventoryList;
            for (let i = 0; i < 3; ++i) {
                let pPanelID = "Ability" + i;
                let pAbilityPanel = $.CreatePanel("Panel", inventoryRoot, pPanelID)
                pAbilityPanel.BLoadLayoutSnippet("InventoryAbility");
                this.AbilityInventoryList.Push(pAbilityPanel);
            }
        }
    }
    UpdateAbilityInventory(iter, abilityID, abilityName, textureName) {
        let abilityPanel = this.AbilityInventoryList.Get(iter);
        let abilityImage = abilityPanel.FindChildTraverse("AbilityImage");
        this.OpenPanel(abilityImage);
        abilityImage.abilityname = abilityName;
        abilityPanel.SetHasClass("ShowItem", abilityID != -1);
        abilityImage.SetAttributeString("ImageType", "Ability");
        GameUI.AddAbilityTooltip(abilityImage, abilityName);
        abilityImage.SetAttributeInt("ImageID", abilityID);
        abilityImage.SetAttributeString("ImageName", abilityName);
        abilityImage.SetAttributeInt("AbilitySlot", iter);
        abilityImage.SetAttributeInt("ToggleButtonType", 0);
        let playerID = Game.GetLocalPlayerID();
        let playerHeroIndex = Players.GetPlayerHeroEntityIndex(playerID);
        abilityImage.SetAttributeInt("HeroIndex", playerHeroIndex);
        abilityImage.SetAttributeString("ImageType", "Ability");
        //
        abilityImage.SetPanelEvent("oncontextmenu", function() {
            let pos = abilityImage.GetPositionWithinWindow();
            let fx = pos.x + abilityImage.actuallayoutwidth + 5;
            let fy = pos.y;
            this.InventoryMenu.FindChildTraverse("Body").SetPositionInPixels(fx, fy, 0);
            this.InventoryMenu.ToggleClass("ShowInventoryMenu");
            this.InventoryMenu.FindChildTraverse("Body").SetAcceptsFocus(true);
            this.SellItemType = 1; //卖出物品为技能
            this.SellItemSlot = iter;
        }.bind(this));
    }

    ClearPanel(ownAbilitysCount) {
        for (let iter = ownAbilitysCount; iter < 3; ++iter) {
            let pAbilityPanel = this.AbilityInventoryList.Get(iter);
            let abilityImage = pAbilityPanel.FindChildTraverse("AbilityImage");
            this.HidePanel(abilityImage);
        }
    }

    InitItemInventory() {
        let playerID = Game.GetLocalPlayerID();
        let playerHeroIndex = Players.GetPlayerHeroEntityIndex(playerID);
        $.Msg("playerHeroIndex=" + playerHeroIndex);
        for (let iter = 0; iter < 2; ++iter) {
            let inventoryRoot = this.ItemInventoryList[iter];
            for (let i = 0; i < 3; ++i) {
                let itemPanelID = "Item" + i;
                let itemPanel = $.CreatePanel("Panel", inventoryRoot, itemPanelID)
                itemPanel.BLoadLayoutSnippet("InventoryItem");
                this.ItemList.Push(itemPanel);
                //
                let itemImagePanel = itemPanel.FindChildTraverse("AbilityImage")
                itemImagePanel.SetAttributeInt("AbilitySlot", iter * 3 + i);
                itemImagePanel.SetAttributeInt("HeroIndex", playerHeroIndex);
                itemImagePanel.SetAttributeInt("ToggleButtonType", 1);
            }
        }
    }
    UpdateItemInventory() {
        let playerID = Game.GetLocalPlayerID();
        let playerHeroIndex = Players.GetPlayerHeroEntityIndex(playerID);
        for (let itemSlot = 0; itemSlot < 6; ++itemSlot) {
            this.UpdatePerItem(itemSlot, playerHeroIndex);
        }
    }
    UpdatePerItem(itemSlot, heroIndex) {
        let itemID = Entities.GetItemInSlot(heroIndex, itemSlot);
        let itemRoot = this.ItemList.Get(itemSlot);
        let itemImage = itemRoot.FindChildTraverse("AbilityImage");
        itemRoot.SetHasClass("ShowItem", itemID != -1);
        itemImage.SetAttributeString("ImageType", "Item");
        let itemName = Abilities.GetAbilityName(itemID);
        itemImage.itemname = itemName;
        //
        let charge = Items.GetCurrentCharges(itemID);
        itemRoot.FindChildTraverse("ItemCharges").text = charge;
        itemRoot.SetHasClass("ShowCharge", charge > 0);
        //
        let playerID = Game.GetLocalPlayerID();
        let playerHeroIndex = Players.GetPlayerHeroEntityIndex(playerID);
        //
        let stage = GameUI.Player.Instance.Property.Stage.Value;
        let canUseInventory = stage == GameUI.PlayerStage.BATTLEING ? 0 : 1;
        // if (canUseInventory) {//屏蔽卖出
        //     itemImage.SetPanelEvent("oncontextmenu", function() {
        //         let pos = itemImage.GetPositionWithinWindow();
        //         let fx = pos.x + itemImage.actuallayoutwidth + 5;
        //         let fy = pos.y;
        //         // $.Msg("pos=" + JSON.stringify(pos));
        //         // $.Msg("fx=" + fx + " " + "fy=" + fy);
        //         this.InventoryMenu.FindChildTraverse("Body").SetPositionInPixels(fx / itemImage.actualuiscale_x, fy / itemImage.actualuiscale_y, 0);
        //         this.InventoryMenu.ToggleClass("ShowInventoryMenu");
        //         this.InventoryMenu.FindChildTraverse("Body").SetAcceptsFocus(true);
        //         this.SellItemType = 0; //卖出物品为装备
        //         this.SellItemSlot = itemSlot;
        //     }.bind(this));
        // } else {
        //     itemImage.ClearPanelEvent("oncontextmenu");
        // }
        //
        itemImage.SetAttributeString("ImageName", itemName);
        itemImage.SetAttributeString("ImageType", "Item");
        itemImage.SetAttributeInt("ImageID", itemID);
    }
    UpdateInventoryOverlay(canDragInventory) {
        let imageOverlay = this.ItemInventory.FindChildrenWithClassTraverse("AbilityImageOverlay");
        for (let iter = 0; iter < 6; ++iter) {
            imageOverlay[iter].visible = canDragInventory == 1 ? false : true;
        }
        for (let iter = 6; iter < 9; ++iter) {
            imageOverlay[iter].visible = canDragInventory == 1 ? false : true;
        }
        $.Msg("UpdateInventoryOverlay");
    }
    UpdateAbilitySell(canUseInventory) {
        $.Msg("UpdateAbilitySell");
        for (let iter = 0; iter < this.AbilityInventoryList.Count; ++iter) {
            let abilityPanel = this.AbilityInventoryList.Get(iter);
            let abilityImage = abilityPanel.FindChildTraverse("AbilityImage");
            if (abilityImage.visible == true) {
                if (canUseInventory) {
                    abilityImage.SetPanelEvent("oncontextmenu", function() {
                        let pos = abilityImage.GetPositionWithinWindow();
                        let fx = pos.x + abilityImage.actuallayoutwidth + 5;
                        let fy = pos.y;
                        this.InventoryMenu.FindChildTraverse("Body").SetPositionInPixels(fx, fy, 0);
                        this.InventoryMenu.ToggleClass("ShowInventoryMenu");
                        this.InventoryMenu.FindChildTraverse("Body").SetAcceptsFocus(true);
                        this.SellItemType = 1; //卖出物品为技能
                        this.SellItemSlot = iter;
                    }.bind(this));
                } else {
                    abilityImage.ClearPanelEvent("oncontextmenu");
                }

            }
        }
    }
    SellInventory() {
        $.Msg("SellSellSellSellv");
        let sellButton = this.InventoryMenu.FindChildTraverse("Sell");
        this.ToggleInventoryMenuWindows();
        $.DispatchEvent("DropInputFocus", sellButton);
        if (this.SellItemType != -1 && this.SellItemSlot != -1) {
            if (this.SellItemType == 0) { //装备
                GameUI.ViDelegateAssisstant.Exec2(this.SellItemEndCallback, entityID, this.SellItemSlot);
            } else {
                GameUI.ViDelegateAssisstant.Exec2(this.SellAbilityEndCallback, this.SellItemSlot);
            }
        }
    }
    UpdateSummoner(iter, index, heroName, abilityName, abilityTextureName, abilityLevel, releaseType, costType, cost) {
        if (this.SummonerAbilityslist.Count <= iter) {
            let panel = $.CreatePanel("Panel", this.SummonerAbilitys, "SummonerAbility" + iter);
            panel.BLoadLayoutSnippet("SummonerAbilitys");
            this.SummonerAbilityslist.Push(panel);
        }
        if (this.PortraitContainerslist.Count <= iter) {
            let panel = $.CreatePanel("Panel", this.PortraitContainers, "PortraitContainer" + iter);
            panel.BLoadLayoutSnippet("PortraitContainers");
            this.PortraitContainerslist.Push(panel);
        }
        let panel = this.SummonerAbilityslist.Get(iter);
        let moviepanel = this.PortraitContainerslist.Get(iter);
        if (iter == 0) {
            panel.FindChildTraverse("Shotcut").text = "V";
        } else if (iter == 1) {
            panel.FindChildTraverse("Shotcut").text = "B";
        }
        moviepanel.FindChildTraverse("HeroMovie").heroname = heroName;
        let SkillNameLabel = panel.FindChildTraverse("SkillNameLabel");
        SkillNameLabel.text = $.Localize("#" + "DOTA_Tooltip_ability_" + abilityName);
        panel.FindChildTraverse("AbilityImage").abilityname = abilityTextureName;
        panel.SetPanelEvent("onactivate", this.OnCastSummonerAbility.bind(this, index));
        GameUI.AddAbilityTooltipForLevel(panel, abilityName, abilityLevel);
        //
        panel.SetHasClass("Passive", releaseType == GameUI.SummonerAbilityStruct.SummonerAbilityType.PASSIVE);
        panel.SetHasClass("Active", releaseType == GameUI.SummonerAbilityStruct.SummonerAbilityType.ACTIVELY);
        if (releaseType == GameUI.SummonerAbilityStruct.SummonerAbilityType.ACTIVELY) {
            panel.SetHasClass("BloodCost", costType == GameUI.SummonerAbilityStruct.SummonerAbilityCostType.HP);
            panel.SetHasClass("CoinCost", costType == GameUI.SummonerAbilityStruct.SummonerAbilityCostType.GOLDCOIN);
            panel.FindChildTraverse("CostNum").text = cost;
        }

        this.Left_Bottom_status.SetHasClass("DoubleSummonerBg", iter == 1);
        this.Left_Bottom_status.SetHasClass("DoubleSummoner", iter == 1);
    }

    UpdateSummonerBuff(iter, summonerIndex, buffIndex, buffTexture, buffStackCount, buffDuration) {
        if (this.SummonerBuffList.Count <= iter) {
            let panel = $.CreatePanel("DOTABuff", this.SummonerBuffContainer, "Buff_" + iter);
            panel.BLoadLayoutSnippet("Buff");
            this.SummonerBuffList.Push(panel);
        }
        let buff = this.SummonerBuffList.Get(iter);
        buff.FindChildTraverse("BuffImage").SetImage("file://{images}/spellicons/" + buffTexture + ".png");
        buff.SetHasClass("has_stacks", buffStackCount != 0)
        buff.FindChildTraverse("StackCount").SetDialogVariableInt("stack_count", buffStackCount);
        GameUI.ShowBuffTooltip(buff, summonerIndex, buffIndex, false);
    }
    UpdateRefreshProbabilityView(shopLevel, ProbabilityList) {
        this.ShopLevelTip.text = shopLevel;
        let ProbabilityListTip = ProbabilityList;

        let des = $.Localize("#" + "RefreshProbabilityTip1") + ProbabilityListTip[0] + "%" + '</font>' + '<br>' + $.Localize("#" + "RefreshProbabilityTip2") + ProbabilityListTip[1] + "%" + '</font>' + '<br>' +
            $.Localize("#" + "RefreshProbabilityTip3") + ProbabilityListTip[2] + "%" + '</font>' + '<br>' + $.Localize("#" + "RefreshProbabilityTip4") + ProbabilityListTip[3] + "%" + '</font>' + '<br>' +
            $.Localize("#" + "RefreshProbabilityTip5") + ProbabilityListTip[4] + "%" + '</font>' + '<br>' + $.Localize("#" + "RefreshProbabilityTip6") + ProbabilityListTip[5] + "%" + '</font>';
        GameUI.ShowTextTooltip(this.RefreshProbabilityContainer, des);
    }



    UpdateSummonerAbility(slot, canCastAbility) {
        let panel = this.SummonerAbilityslist.Get(slot);
        panel.FindChildTraverse("SummonerAbility").SetHasClass("NotCastAbility", !canCastAbility);
    }
    UpdateShopLevel(shopLevel) {
        $.Msg("shopLevel=" + shopLevel);
        this.ShopLevelImage.SetHasClass("star1", shopLevel == 1);
        this.ShopLevelImage.SetHasClass("star2", shopLevel == 2);
        this.ShopLevelImage.SetHasClass("star3", shopLevel == 3);
        this.ShopLevelImage.SetHasClass("star4", shopLevel == 4);
        this.ShopLevelImage.SetHasClass("star5", shopLevel == 5);
        this.ShopLevelImage.SetHasClass("star6", shopLevel == 6);
        //
        this.ShopLevelUpButton.SetHasClass("ShopLevelup_Alive", shopLevel < 6);
        this.ShopLevelUpButton.SetHasClass("ShopLevelup_Dead", shopLevel == 6);
        //
        if (shopLevel == 6) {
            this.ShopLevelUpButton.hittest = false;
            // this.GoldCoin.AddClass("Invisible");
        }
    }
    UpdateSelectUnit(localTeam) {
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        let heroName = Entities.GetUnitName(iLocalPortraitUnit);
        if (heroName == "") { //有可能为空
            return;
        }
        let team = Entities.GetTeamNumber(iLocalPortraitUnit);
        this.RootPanel.SetHasClass("IsHero", heroName != "npc_dota_hero_weaver" || team != localTeam);
        //
        if (heroName != "npc_dota_hero_weaver" || team != localTeam) {
            // this.UpdateSelectUnitItems(iLocalPortraitUnit);
            if (this.aghsStatusContainer) {
                this.aghsStatusContainer.SetUnit(iLocalPortraitUnit);
            }
            //
            this.XpLevel.text = Entities.GetLevel(iLocalPortraitUnit);
            //
            let maxHealth = Entities.GetMaxHealth(iLocalPortraitUnit);
            let health = Entities.GetHealth(iLocalPortraitUnit);
            let healthPercent = parseFloat((health / maxHealth).toFixed(3));
            let healthThinkRegen = Entities.GetHealthThinkRegen(iLocalPortraitUnit);
            // $.Msg("healthThinkRegen=" + healthThinkRegen);
            this.HealthLabel.text = health + " / " + maxHealth;
            this.HealthProgress.value = healthPercent;
            this.HealthRegenLabel.text = "+" + healthThinkRegen.toFixed(1);
            //
            let maxMana = Entities.GetMaxMana(iLocalPortraitUnit);
            let mana = Entities.GetMana(iLocalPortraitUnit);
            let manaPercent = parseFloat((mana / maxMana).toFixed(3));
            let manaThinkRegen = Entities.GetManaThinkRegen(iLocalPortraitUnit);
            this.ManaLabel.text = mana + " / " + maxMana;
            this.ManaProgress.value = manaPercent;
            this.ManaRegenLabel.text = "+" + manaThinkRegen.toFixed(1);
            //
        }
        //
        let buffNums = Entities.GetNumBuffs(iLocalPortraitUnit);
        let isHasNoBuff = 1;
        for (let iter = 0; iter < buffNums; ++iter) {
            let buff = Entities.GetBuff(iLocalPortraitUnit, iter);
            if (!Buffs.IsDebuff(iLocalPortraitUnit, buff) && !Buffs.IsHidden(iLocalPortraitUnit, buff)) {
                isHasNoBuff = 0;
            }
        }
        this.BuffContainer.SetHasClass("NoBuffs", isHasNoBuff == 1);
        //
        this.stats_tooltip_region.SetPanelEvent("onmouseover", (function() {
            // GameUI.SelectUnit(iLocalPortraitUnit, false);
            $.DispatchEvent("DOTAHUDShowDamageArmorTooltip", this.stats_tooltip_region);
        }).bind(this));
        this.stats_tooltip_region.SetPanelEvent("onmouseout", function() {
            // GameUI.SelectUnit(-1, false);
            $.DispatchEvent("DOTAHUDHideDamageArmorTooltip");
        });

        if (this.CustomStatBranch) {
            this.CustomStatBranch.BLoadLayout("file://{resources}/layout/custom_game/elements/stat_branch/stat_branch.xml", false, false);
            this.CustomStatBranch.SetUnit(iLocalPortraitUnit);
        }

        if (this.RootPanel.BHasClass("ShowSellItemButton")) {
            this.SellItemButton.FindChildTraverse("RewardGold").text = GameUI.Player.Instance.Property.SellGoldCoin.Value;
        } else if (this.RootPanel.BHasClass("ShowSellHeroButton")) {
            let sellGold = GameUI.GetEntitySellGold(iLocalPortraitUnit);
            this.SellHeroButton.FindChildTraverse("RewardGold").text = sellGold;
        }
        this.HeroIcon.heroname = heroName;
    }
    SetupHeroPanel() {
        this.aghsStatusContainer = this.AghsStatusContainer;
        if (this.aghsStatusContainer) {
            this.aghsStatusContainer.BLoadLayout("file://{resources}/layout/custom_game/elements/aghs_status_display/aghs_status_display.xml", false, false);
            this.aghsStatusContainer.SetUnit(-1);
        }
        this.inventory_list_container = this.Items.FindChildTraverse("inventory_list_container");
        this.inventory_list_container.style.flowChildren = "right";
        this.inventory_list_container.FindChildTraverse("inventory_list").style.marginTop = "-2px";
        this.inventory_list_container.FindChildTraverse("inventory_list2").style.marginLeft = "-2px";
    }
    UpdateSelectUnitAbilities(iLocalPortraitUnit) {
        let abilityCount = 0;
        for (let abilitySlot = 0; abilitySlot < 5 && abilityCount < 3; ++abilitySlot) {
            let abilityID = Entities.GetAbility(iLocalPortraitUnit, abilitySlot);
            let abilityName = Abilities.GetAbilityTextureName(abilityID);
            let isActive = Abilities.IsActivated(abilityID);
            let isUltimateAbility = Abilities.GetAbilityType(abilityID);
            if (abilityName != "generic_hidden") {
                let abilityPanel = this.HeroPanel.FindChildTraverse("Ability" + abilityCount);
                if (abilityPanel) {
                    abilityPanel.FindChildTraverse("AbilityImage").abilityname = abilityName;
                    if (abilityName == "troll_warlord_berserkers_rage_active") {
                        let imageUrl = "file://{images}/spellicons/" + abilityName + ".png";
                        abilityPanel.FindChildTraverse("AbilityImage").SetImage(imageUrl);
                        abilityName = "troll_warlord_berserkers_rage";
                    }
                    let abilityLevel = Abilities.GetLevel(abilityID);
                    GameUI.AddAbilityTooltipForLevel(abilityPanel, abilityName, abilityLevel);
                }
                abilityCount++;
            }
        }
        let abilitySlot = 5;
        let abilityID = Entities.GetAbility(iLocalPortraitUnit, abilitySlot);
        let abilityName = Abilities.GetAbilityTextureName(abilityID);
        let isActive = Abilities.IsActivated(abilityID);
        let isUltimateAbility = Abilities.GetAbilityType(abilityID);
        if (abilityName != "generic_hidden") {
            let abilityPanel = this.HeroPanel.FindChildTraverse("Ability" + abilityCount);
            if (abilityPanel) {
                abilityPanel.FindChildTraverse("AbilityImage").abilityname = abilityName;
                if (abilityName == "troll_warlord_berserkers_rage_active") {
                    abilityName = "troll_warlord_berserkers_rage";
                }
                let abilityLevel = Abilities.GetLevel(abilityID);
                GameUI.AddAbilityTooltipForLevel(abilityPanel, abilityName, abilityLevel);
            }
            abilityCount++;
        }
    }
    UpdateSelectUnitItems(iLocalPortraitUnit) {
        for (let itemSlot = 0; itemSlot < 6; ++itemSlot) {
            let itemID = Entities.GetItemInSlot(iLocalPortraitUnit, itemSlot);
            let itemName = Abilities.GetAbilityName(itemID);
            let itemPanel = this.HeroPanel.FindChildTraverse("Item" + itemSlot);
            if (itemPanel) {
                itemPanel.FindChildTraverse("ItemImage").itemname = itemName;
            }
            let charge = Items.GetCurrentCharges(itemID);
            itemPanel.FindChildTraverse("ItemCharges").text = charge;
            itemPanel.SetHasClass("ShowCharge", charge > 0);
            //CD
            let a = Abilities.GetCooldown(itemID);
            let b = Abilities.GetCooldownLength(itemID);
            let c = Abilities.GetCooldownTime(itemID);
            let d = Abilities.GetCooldownTimeRemaining(itemID);
            // $.Msg("itemSlot=" + itemSlot + " " + a + "  " + b + " " + c + " " + d);
        }
    }
    ActiveShopButton(isActive) {
        this.OpenShopBtn.SetHasClass("ActiveStyle", isActive);
    }
    ActiveShopLevelUpButton(isActive) {
        this.ShopLevelUpButton.SetHasClass("ActiveStyle", isActive);
    }
    ActiveSummonerAbility(isActive) {
        for (let iter = 0; iter < this.SummonerAbilityslist.length; ++iter) {
            let panel = this.SummonerAbilityslist.Get(iter);

            panel.FindChildTraverse("AbilityImage").SetHasClass("ActiveStyle", isActive);
        }
    }
    OnShopLevelupMsg() {
        if (GameUI.Player.Instance != null && GameUI.Player.Instance.Property != null) {
            GameUI.Player.Instance.ShopLevelUp();
        }
    }
    OnSellHero() {
        let heroIndex = Players.GetLocalPlayerPortraitUnit();
        GameUI.ViDelegateAssisstant.Exec1(this.OnSellHeroCallback, heroIndex);
    }
    OpenShopBtnClickMsg() {
        GameUI.ViDelegateAssisstant.Exec0(this.OnOpenShopBtnCallback);
    }
    ShopLevelupGoldNeed(coinNeed) {
        this.ShopLevelUp.FindChildTraverse("CostNum").text = coinNeed;
    }
    OnCastSummonerAbility(entityIndex) {
        GameUI.SummonerController.Instance.CastAbility(entityIndex);
    }
}

GameUI.UILowerHudWindow = UILowerHudWindow;