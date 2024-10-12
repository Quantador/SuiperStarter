use std::vector;

module 0xYourAddress::Donation {
    
    use 0xYourAddress::Object::{Donation, Campaign};  // Import the structs
    use 0xYourAddress::Campaign::{check_goals};
    use 0xUSDCAddress::USDC;  // Adresse du contrat USDC sur Sui
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    
    // Function to create a new player bet
    public fun create_donation(contributor: address, amount: u64, campaignId: u64): Donation {
        Donation {
            contributor: signer::address_of(contributor),
            amount: amount,
            campaignId: campaignId
        }
    }

    /// Fonction pour créer une donation et transférer des fonds vers la campagne
    public fun add_donation(campaign: &mut Campaign, amount: u64, ctx: &mut TxContext) {
        // Vérifiez que le montant est supérieur à 0
        assert!(amount > 0, 1);

        // Récupérer l'adresse du contributeur
        let contributor_address = sender(ctx);

        // Transférer les fonds du portefeuille de l'utilisateur vers l'adresse de la campagne
        transfer::transfer(contributor_address, campaign.creator, amount, ctx);

        // Créer une nouvelle donation et l'ajouter à la liste des donations de la campagne
        let donation = Donation {
            contributor: contributor_address,
            amount: amount,
            campaignId: campaign.campaignId
        };
        vector::push_back(&mut campaign.donationList, donation);

        // Mettre à jour le montant actuel de la campagne
        campaign.currentAmount = campaign.currentAmount + amount;

        // Vérifier si la campagne a atteint son objectif
        check_goals(campaign);
    }
    
}
