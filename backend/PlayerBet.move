module 0xYourAddress::PlayerBet {

    struct PlayerBet has store {
        better: address,
        amount: u64,
        outcome: u8,        // 0 for "No", 1 for "Yes"
        betMarketId: u64,   // Reference to the BetMarket
    }

    // Function to create a new player bet
    public fun create_player_bet(better: &signer, amount: u64, outcome: u8, betMarketId: u64): PlayerBet {
        PlayerBet {
            better: signer::address_of(better),
            amount,
            outcome,
            betMarketId,
        }
    }

    // Function to add a bet to a specific market
    public fun add_bet(market: &mut BetMarket::BetMarket, bet: PlayerBet) {
        // Add the bet to the market's list of bets
        vector::push_back(&mut market.betList, bet);

        // Update the pool depending on the outcome
        if (bet.outcome == 0) {
            market.pool0 = market.pool0 + bet.amount;
        } else {
            market.pool1 = market.pool1 + bet.amount;
        }
    }

    // Function to get the bet of a specific user in a market
    public fun get_bet_by_user(market: &BetMarket::BetMarket, user: address): option<PlayerBet> {
        for bet in &market.betList {
            if (bet.better == user) {
                return option::some(copy bet);
            }
        }
        option::none<PlayerBet>()
    }
}
