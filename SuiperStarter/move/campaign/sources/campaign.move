module campaign::campaign {

  use std::string::{Self, String};


  public struct Campaign has key {
    id: UID,
    owner: address,
    objective: u64,
    amount: u64,
    name: String,
    description: String

  }

  public fun create(name_bytes: vector<u8>, description_bytes: vector<u8>, objective : u64, ctx: &mut TxContext)  {
    transfer::share_object(Campaign {
      id: object::new(ctx),
      owner: ctx.sender(),
      objective: objective,
      amount: 0,
      name: string::utf8(name_bytes),
      description: string::utf8(description_bytes)
    })
  }

  public fun donate(campaign: &mut Campaign, value: u64) {
    campaign.amount = campaign.amount + value;
  }

  public fun set_value(campaign: &mut Campaign, value: u64, ctx: &TxContext) {
    assert!(campaign.owner == ctx.sender(), 0);
    campaign.amount = value;
  }

}