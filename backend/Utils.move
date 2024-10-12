module 0xYourAddress::Utils {

    use 0xYourAddress::Donation;

    // Function to distribute payouts to winners
    public fun distribute_payout(market: &mut BetMarket::BetMarket) {
        let result = option::extract(&market.answer);

        // Get the total pool for winners
        let total_pool = if (result == 0) { market.pool0 } else { market.pool1 };

        for bet in &market.betList {
            if (bet.outcome == result) {
                let payout = (bet.amount * (market.pool0 + market.pool1)) / total_pool;
                // TODO: Implement token transfer logic to payout winners
                // Example: Transfer payout to bet.better
            }
        }
    }

    // Function to refund all bets in a canceled market
    public fun refund_all_bets(market: &mut BetMarket::BetMarket) {
        for bet in &market.betList {
            // TODO: Implement refund logic here
            let refund_amount = bet.amount;
            // Example: Transfer refund_amount back to bet.better
        }
    }

    // Simple validation to ensure that bet amounts are greater than zero
    public fun validate_bet_amount(amount: u64) {
        assert!(amount > 0, 5);
    }
}
