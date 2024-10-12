    // Entity corresponding to a donation made by a contributor
    struct Donation has store {
        contributor : address,
        amount: u64,
        campaignId: u64,   // Reference to the Campaign
    }
    
    // Entity corresponding to a Campaingn 
    struct Campaign has store, key {
        campaignId: UID :          // Unique identifier for the campaign
        targetAmount: u64,   
        currentAmount: u64 
        time0: u64       // Target amount of the campaign
        startTime: u64,           // Start time of the campaign (Unix timestamp)
        endTime: u64,             // End time of the campaign (Unix timestamp) (can be modified if needed)
        description: vector<u8>,  // Description of the campaign (as bytes)
        creator: address,         // Address of the campaign creator
        donationList vector<Donation>, // List of all Donation objects
    }

    // All different campaigns available on the platform
    struct campaignList has store {
        list_campaigns : vector<Campaign>, // List of all campaigns currently available on our websites
    }
