CheckUnit = true
function TvESpawnBoss(trigger)
	if CheckUnit then
		local point = Entities:FindByName( nil, "event_line"):GetAbsOrigin() 
        local waypoint = Entities:FindByName( nil, "event_line") 
        
        local unit = CreateUnitByName( "event_line_boss_halloween" , point, true, nil, nil, DOTA_TEAM_NEUTRALS ) 
        unit:SetInitialGoalEntity( waypoint )
        unit:AddNewModifier(unit, nil, "modifier_phased", {})
        unit:AddNewModifier(unit, nil, "modifier_invulnerable", {duration = 30})
		
        local dropRadius = RandomFloat( 20, 120 )     
        local spawnPoint = unit:GetAbsOrigin() + RandomVector( dropRadius )
        local newItem = CreateItem( "item_get_gem", nil, nil )
        local drop = CreateItemOnPositionForLaunch( spawnPoint, newItem )
        newItem:LaunchLootInitialHeight( false, 0, 150, 0.5, spawnPoint )
		CheckUnit = false
	end
end