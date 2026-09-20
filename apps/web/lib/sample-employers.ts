export type SampleEmployer = {
  legal_name: string;
  ein: string;
  everify_company_id: string;
  everify_status: "unverified" | "everify_listed" | "lca_listed" | "everify_and_lca";
  hq_city: string;
  hq_state: string;
  website: string;
  is_sample: true;
};

export const SAMPLE_EMPLOYERS: SampleEmployer[] = [
  {
    legal_name: "Northlake Analytics LLC",
    ein: "11-1111111",
    everify_company_id: "EV-SAMPLE-001",
    everify_status: "everify_and_lca",
    hq_city: "Austin",
    hq_state: "TX",
    website: "https://example.com/northlake",
    is_sample: true,
  },
  {
    legal_name: "Harbor Bridge Software Inc",
    ein: "22-2222222",
    everify_company_id: "EV-SAMPLE-002",
    everify_status: "everify_listed",
    hq_city: "Seattle",
    hq_state: "WA",
    website: "https://example.com/harbor",
    is_sample: true,
  },
  {
    legal_name: "Cedar & Pine Research",
    ein: "33-3333333",
    everify_company_id: "EV-SAMPLE-003",
    everify_status: "everify_and_lca",
    hq_city: "Boston",
    hq_state: "MA",
    website: "https://example.com/cedar",
    is_sample: true,
  },
  {
    legal_name: "Midwest Circuits Corp",
    ein: "44-4444444",
    everify_company_id: "EV-SAMPLE-004",
    everify_status: "everify_listed",
    hq_city: "Chicago",
    hq_state: "IL",
    website: "https://example.com/midwest",
    is_sample: true,
  },
  {
    legal_name: "Sonoma Health Systems",
    ein: "55-5555555",
    everify_company_id: "EV-SAMPLE-005",
    everify_status: "lca_listed",
    hq_city: "San Jose",
    hq_state: "CA",
    website: "https://example.com/sonoma",
    is_sample: true,
  },
  {
    legal_name: "Redwood Robotics",
    ein: "66-6666666",
    everify_company_id: "EV-SAMPLE-006",
    everify_status: "everify_and_lca",
    hq_city: "Pittsburgh",
    hq_state: "PA",
    website: "https://example.com/redwood",
    is_sample: true,
  },
  {
    legal_name: "Atlantic Data Co",
    ein: "77-7777777",
    everify_company_id: "EV-SAMPLE-007",
    everify_status: "unverified",
    hq_city: "New York",
    hq_state: "NY",
    website: "https://example.com/atlantic",
    is_sample: true,
  },
  {
    legal_name: "Prairie STEM Labs",
    ein: "88-8888888",
    everify_company_id: "EV-SAMPLE-008",
    everify_status: "everify_listed",
    hq_city: "Minneapolis",
    hq_state: "MN",
    website: "https://example.com/prairie",
    is_sample: true,
  },
];
