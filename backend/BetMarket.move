module 0xYourAddress::BetMarket {

    use 0xYourAddress::PlayerBet;
    use 0xYourAddress::Utils;

    struct BetMarket has store {
        id: u64,                  // Unique identifier for the market
        pool0: u64,               // Total amount bet on outcome 0 (No)
        pool1: u64,               // Total amount bet on outcome 1 (Yes)
        startTime: u64,           // Start time of the market (Unix timestamp)
        endTime: u64,             // End time of the market (Unix timestamp)
        description: vector<u8>,  // Description of the market (as bytes)
        creator: address,         // Address of the market creator
        answer: option<u8>,       // Market result (None before resolution, Some(0) or Some(1) after)
        betList: vector<PlayerBet::PlayerBet>, // List of all PlayerBet objects
    }

    // Function to create a new bet market
    public fun create_market(creator: &signer, id: u64, startTime: u64, endTime: u64, description: vector<u8>): BetMarket {
        BetMarket {
            id,
            pool0: 0,
            pool1: 0,
            startTime,
            endTime,
            description,
            creator: signer::address_of(creator),
            answer: option::none<u8>(),
            betList: vector::empty<PlayerBet::PlayerBet>(),
        }
    }

    // Function to resolve the bet market by the creator
    public fun resolve_market(creator: &signer, market: &mut BetMarket, answer: u8) {
        // Only the market creator can resolve the market
        assert!(signer::address_of(creator) == market.creator, 1);
        // Ensure the market has not been resolved yet
        assert!(option::is_none(&market.answer), 2);

        // Set the result (0 for No, 1 for Yes)
        market.answer = option::some(answer);

        // Distribute payouts
        Utils::distribute_payout(market);
    }

    // Function to cancel a bet market (only before it's resolved)
    public fun cancel_market(creator: &signer, market: &mut BetMarket) {
        assert!(signer::address_of(creator) == market.creator, 3);
        assert!(option::is_none(&market.answer), 4);

        // Refund all players
        Utils::refund_all_bets(market);
    }

    // Function to get the total amount bet in the market
    public fun get_total_bet_amount(market: &BetMarket): u64 {
        market.pool0 + market.pool1
    }

    // Function to get the pool of the winning outcome
    public fun get_winning_pool(market: &BetMarket): u64 {
        let result = option::extract(&market.answer);
        if (result == 0) {
            market.pool0
        } else {
            market.pool1
        }
    }
}
