module 0xYourAddress::Campaign {

    use 0xYourAddress::Donation;
    use sui::clock::Clock;
    use sui::tx_context::TxContext;
    use sui::event;

    public struct MyEvent has copy, drop, store {}

    // Function to create a new bet market
    public fun create_campaign(creator: &signer, campaignId: u64, startTime: u64, endTime: u64, description: vector<u8>, targetAmount: u64): Campaign {
        Campaign {
            campaignId: campaignId,          // Unique identifier for the campaign
            targetAmount: targetAmount,    
            currentAmount: 0,   
            time0: Clock.timestamp          // Target amount of the campaign
            startTime: startTime,           // Start time of the campaign (Unix timestamp)
            endTime: endTime,             // End time of the campaign (Unix timestamp) (can be modified if needed)
            description: description,  // Description of the campaign (as bytes)
            creator: creator,         // Address of the campaign creator
            donationList: donationList,  // List pf all the Donation objects for this Campaign
            goalHit : bool  // True if the total amount is reached, false otherwise
        }
    }
    
    public fun check_goals(campaign: &mut Campaign) {
       if (campaign.targetAmount - campaign.currentAmount) <= 0 :
            resolve_campaign(campaign);
    }


    // Function to resolve the campaign
    public fun resolve_campaign(campaign : &mut Campaign) {
        campaign.goalHit = True ;
        notify_creator()
        notify_donators(campaign);
    }

    public fun notify_creator(campaign: &mut Campaign){
        
    }

    //Update the target amount, only by the owner of the campaign
    
    public fun modify_target_amount(new_target_amount : u64, campaign, ctx: &mut TxContext) {
        //Verify that the new target amount is not negative, and that it's the creator of the campaign that is modifying it
        assert(tx_context::sender(ctx) == campaign.creator);
        assert(new_target_amount > 0 );

        //Check if with the new target amount the goal is hit
        if (new_target_amount > campaign.currentAmount){
            campaign.goalHit = False;
        }
        campaign.targetAmount = new_target_amount;
    }

    public fun notify_donators(campaign: &Campaign, ctx: &mut TxContext) {
        for donation in &campaign.donationList {
            let donator_address = donation.contributor;

            // Émettre un événement de notification pour chaque donateur
            sui::event::emit_event(
                NotificationEvent {
                    recipient: donator_address,
                    message: b"Merci pour votre don, la campagne a atteint son objectif!".to_vec(),
                }, 
                ctx
            );
        }
    }
            
}
