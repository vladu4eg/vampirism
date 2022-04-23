modifier_antiblock = class({})

function modifier_antiblock:CheckState() 
    return { [MODIFIER_STATE_BLOCK_DISABLED] = false}
end

function modifier_antiblock:IsHidden()
    return false
end

function modifier_antiblock:IsPurgable()
    return false
end

function modifier_antiblock:DeclareFunctions()
	return { MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
             MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
             MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			 MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE,
			 MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT }
end

function modifier_antiblock:GetModifierIncomingDamage_Percentage()

	if string.match(GetMapName(),"clanwars") or string.match(GetMapName(),"1x1") then
		return -75
	end 
	return -1
end

function modifier_antiblock:GetModifierMagicalResistanceBonus()

	if string.match(GetMapName(),"clanwars") or string.match(GetMapName(),"1x1") then
		return 50
	end 
	return 1
end

function modifier_antiblock:GetModifierTotalDamageOutgoing_Percentage()
	if string.match(GetMapName(),"clanwars") or string.match(GetMapName(),"1x1") then
		return 50
	end 
	return 1
end

function modifier_antiblock:GetModifierPreAttack_BonusDamage_Proc()
	if string.match(GetMapName(),"clanwars") or string.match(GetMapName(),"1x1") then
		return 50
	end 
	-- return 1
end

function modifier_antiblock:GetModifierMoveSpeedBonus_Constant()
	if string.match(GetMapName(),"clanwars") or string.match(GetMapName(),"1x1") then
		return 20
	end 
	-- return 1
end

